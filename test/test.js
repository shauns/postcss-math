var postcss = require('postcss');
var expect = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
    postcss([plugin(opts)]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-math', function () {

    it('basic resolve', function (done) {
        test(
            'p{ foo: resolve(2 * (3 + 5))px; }',
            'p{ foo: 16px; }',
            {},
            done
        );
    });

    it('recursive resolve', function(done) {
        test(
            'p{ foo: resolve(2 * resolve(3 + 5)); }',
            'p{ foo: 16; }',
            {},
            done
        );
    });

    it('supports pixel units', function(done) {
        test(
            'p{ font-size: resolve(2 * 8px); }',
            'p{ font-size: 16px; }',
            {},
            done
        );
    });

    it('supports pixel calculations', function(done) {
        test(
            'p{ font-size: resolve(10px + 6px); }',
            'p{ font-size: 16px; }',
            {},
            done
        );
    });

    it('supports stripping units', function(done) {
        test(
            'p{ font-size: resolve(strip(8cm) * 2px); }',
            'p{ font-size: 16px; }',
            {},
            done
        );
    });

});
