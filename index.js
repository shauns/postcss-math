var postcss = require('postcss');
var helpers = require('postcss-message-helpers');
var reduceFunctionCall = require('reduce-function-call');
var maths = require('mathjs');

var PREFIXES = maths.type.Unit.PREFIXES;
var BASE_UNITS = maths.type.Unit.BASE_UNITS;

BASE_UNITS.PIXELS = {};

maths.type.Unit.UNITS.px = {
    name: 'px', base: BASE_UNITS.PIXELS, prefixes: PREFIXES.NONE, value: 1,
    offset: 0
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
        var res = maths.eval(argString);
        var formatted = res.toString();

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
