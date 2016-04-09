var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var reduceFunctionCall = require('reduce-function-call');
var maths = require('mathjs');

var PREFIXES = maths.type.Unit.PREFIXES;
var BASE_UNITS = maths.type.Unit.BASE_UNITS;

BASE_UNITS.PIXELS = {
    dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0],
    key: 'PIXELS'
};

maths.type.Unit.UNITS.px = {
    name: 'px',
    base: BASE_UNITS.PIXELS,
    prefixes: PREFIXES.NONE,
    value: 1,
    offset: 0,
    dimensions: [0, 1, 0, 0, 0, 0, 0, 0, 0]
};

maths.type.Unit.prototype.strip = function() {
    return this._denormalize(this.value);
};

function strip(value) {
    return value.strip();
}
maths.import({
    strip: strip
});

function transformResolve(value) {
    return reduceFunctionCall(value, 'resolve', function(argString) {

        var unit = '';
        if (argString.indexOf('floor(') >= 0
                || argString.indexOf('ceil(') >= 0) {
            // drop unit to apply floor or ceil function
            var start = argString.indexOf('(') + 1;
            var end = argString.indexOf(')');
            var numberWithUnit = argString.substring(start, end);

            var number = numberWithUnit.replace(/([0-9\.]+)([a-zA-Z]+)$/, '$1');
            unit = numberWithUnit.replace(/([0-9]|\.)+([a-zA-Z]+)$/, '$2');

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

    // Work with options here

    return function (css) {

        // Transform CSS AST here
        css.eachDecl(function (decl) {
            if (!decl.value || decl.value.indexOf('resolve(') === -1) {
                return;
            }
            decl.value = helpers.try(function () {
                return transformResolve(decl.value);
            }, decl.source);
        });
    };
});
