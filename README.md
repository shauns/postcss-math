# PostCSS Math [![Build Status][ci-img]][ci]

## Work-in-progress!

[PostCSS] plugin for making calculations with math.js.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/shauns/postcss-math.svg
[ci]:      https://travis-ci.org/shauns/postcss-math


This plug-in supports:

* Plain-old maths, as per math.js built-in functionality
* `px`, `em`, `rem`, `vh`, `vmax` and other units
* CSS-friendly rendering (`10cm` not `10 cm`)
* Unit stripping e.g. `strip(25px)` becomes `25`
* Unit math operations e.g. `floor(12.6px)` becomes `12px` and `ceil(12.6px)` becomes `13px`

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

## Using `postcss-assets`?

You can pass in a `functionName` option to switch to something other than `resolve`.

## How does this differ to `postcss-calc`?

They're (deliberately) trying to work towards the calc(...) standard, so for 
instance it doesn't support things like exponentials at the moment. This wraps 
up math.js so you have a wider range of things you can do.
