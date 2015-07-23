# PostCSS Math [![Build Status][ci-img]][ci]

## Work-in-progress!

[PostCSS] plugin for making calculations with math.js.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/shauns/postcss-math.svg
[ci]:      https://travis-ci.org/shauns/postcss-math

```css
.foo {
    font-size: resolve(2 * 8px);
    padding: resolve(strip(16cm) + (2 * 3));
    margin: resolve(4px + resolve(2 * 3px));
}
```

```css
.foo {
    font-size: 16px;
    padding: 22;
    margin: 10px;
}
```

## Usage

```js
postcss([ require('postcss-math') ])
```

See [PostCSS] docs for examples for your environment.
