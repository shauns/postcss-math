# PostCSS Math [![Build Status][ci-img]][ci]

## Work-in-progress!

[PostCSS] plugin for making calculations with math.js.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/shauns/postcss-math.svg
[ci]:      https://travis-ci.org/shauns/postcss-math


This plug-in supports:

* Plain-old maths, as per math.js built-in functionality
* `px` units
* CSS-friendly rendering (`10cm` not `10 cm`)
* Unit stripping e.g. `strip(25px)` becomes `25`

Contributions are very welcome!


```css
.foo {
    font-size: resolve(2 * 8px);
    padding: resolve(strip(16cm) + (2px * 3));
    margin: resolve(4px + resolve(2 * 3px));
}
```

```css
.foo {
    font-size: 16px;
    padding: 22px;
    margin: 10px;
}
```

## Usage

```js
postcss([ require('postcss-math') ])
```

See [PostCSS] docs for examples for your environment.
