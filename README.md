Gradually change the color of the background, text or anything else as the user scrolls.

Define a DOM element, color-related CSS property, and colors in a `colorScroll.Plot`. Define your DOM element and CSS property jQuery-style, and define your colors in any format valid in CSS.

```
var textColors = new colorScroll.Plot('div#my-div', 'backgroundColor', [
	{ position: 0, color: '#FFFFFF' },
	{ position: 500, color: 'blue'},
	{ position: 1000, color: 'rgb(0,0,0)' }
]);

```
The background color of `#my-div` starts out white, and gradually change to blue until the users scrolls 500 px down from the top of the div, and then to goes black. Positions can also be defined in decimal values (0 meaning the top of the element, .5 meaning halfway down, 1 meaning the bottom etc.), as long as you don't mix the two kinds of positions in the same plot. Then, call `change()` on your Plot when you want the colors to change. If you don't define colors for the very top and bottom of your element, the first/last colors will be used to fill those parts in. 

```
$(function() {
	$(document).scroll(function() {
		textColors.change();
	});
});
```

Making a colorScroll.Plot for the body background color makes transitions between colors choppy on big pages. You can put a fixed-position div behind everything that spans the area of the viewport to achieve the same effect. This requires `'body'` as the fourth argument.

```
var bodyBackgroundColors = new colorSroll.Plot('#color-bg', 'backgroundColor', [
	{ position: 0, color: 'red' }.
	{ position: 0.5, color: 'green' },
	{ position: 1, color: 'blue' }
], 'body')
```
Calling `bodyBackgroundColors.change()` will change the color of the DOM element with id `#color-bg` according the the scroll position relative to the top of the `body` element. You can make use any DOM element as a reference point in the same way.

Dependencies: jQuery, jQuery Color