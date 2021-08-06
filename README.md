# Animated Web Components

Content on the web is increasingly _less static_. However adding even simple animations can be repetitive and verbose. This library uses Web Components to provide animations to objects inside a page. Still in development, more will be added soon.

## Getting started

### Using NPM

In you project root
```bash
npm install animated-web-components
```

Then load the content in your html file
```html
<script src="./node_modules/animated-web-components/index.js" type="module">
```

### Using CDN
If you prerfer, you can use [https://unpkg.com]
```html
<script src="://unpkg.com/animated-web-components/index.js" type="module">
```

## Usage

### Floating Random Thing
Use this tag to make its content float around its parent. Can be set to duplicate on click
```html
<section>
    <floating-random-thing animation-range="20" animation-duration="100" duplicates="true" auto="true">
        <p>Hello</p>
    </floating-random-thing>
</section>
```