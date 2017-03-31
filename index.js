var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var reduceFunctionCall = require('reduce-function-call');
var maths = require('mathjs');

var PREFIXES = maths.type.Unit.PREFIXES;
var BASE_UNITS = maths.type.Unit.BASE_UNITS;

var cssUnits = {
    PIXELS: 'px',
    EM: 'em',
    EX: 'ex',
    CH: 'ch',
    REM: 'rem',
    POINTS: 'pt',
    VH: 'vh',
    VW: 'vw',
    VMIN: 'vmin',
    VMAX: 'vmax'
};

Object.keys(cssUnits).forEach(function (unitKey) {
    BASE_UNITS[unitKey] = {
        dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        key: unitKey
    };

    var unit = cssUnits[unitKey];

    maths.type.Unit.UNITS[unit] = {
        name: unit,
        base: BASE_UNITS[unitKey],
        prefixes: PREFIXES.NONE,
        value: 1,
        offset: 0,
        dimensions: BASE_UNITS[unitKey].dimensions
    };
});

maths.type.Unit.prototype.strip = function() {
    return this._denormalize(this.value);
};

function strip(value) {
    return value.strip();
}
maths.import({
    strip: strip
});

function transformResolve(value, functionName) {
    return reduceFunctionCall(value, functionName, function(argString) {

        var unit = '';
        if (argString.indexOf('floor(') >= 0
                || argString.indexOf('ceil(') >= 0) {
            // drop unit to apply floor or ceil function
            var start = argString.indexOf('(') + 1;
            var end = argString.indexOf(')');
            var numberWithUnit = argString.substring(start, end);


            var number = numberWithUnit.replace(
                /([^a-zA-Z]+)([a-zA-Z]*)$/, '$1'
            );
            unit = numberWithUnit.replace(/([^a-zA-Z]+)([a-zA-Z]*)$/, '$2');
            argString = argString.substring(0, start) + number + ')';
        }

        var res = maths.eval(argString);
        // Add previous splitted unit if any
        var formatted = res.toString() + unit;

        // Math.JS puts a space between numbers and units, drop it.
        formatted = formatted.replace(/(.+) ([a-zA-Z]+)$/, '$1$2');
        return formatted;
    });
}

module.exports = postcss.plugin('postcss-math', function (opts) {
    opts = opts || {};

    var functionName = 'resolve';
    if (opts.functionName) {
        functionName = opts.functionName
    }

    return function (css) {

        // Transform CSS AST here
        css.walk(function (node) {
            var nodeProp;

            if (node.type === 'decl') {
                nodeProp = 'value';
            }
            else if (node.type === 'atrule' && node.name === 'media') {
                nodeProp = 'params';
            }
            else if (node.type === 'rule') {
                nodeProp = 'selector';
            }
            else {
                return;
            }

            var match = functionName + '(';
            if (!node[nodeProp] || node[nodeProp].indexOf(match) === -1) {
                return;
            }

            node[nodeProp] = helpers.try(function () {
                return transformResolve(node[nodeProp], functionName);
            }, node.source);
        })
    };
});
