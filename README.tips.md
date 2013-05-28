# Tips, Gotch-yas, and random code

## Angular Best Practices
- Only use `ng-bind` in `index.html` file only
- ng-templates & partials cannot have leading white space (ie \n) in IE8
- Always use `data-ng-x` over `ng-x`
- Avoid `<ng-x>` tags, use `<div data-ng-x></div>`

## jQuery alternatives
`jQuery == native / angular`

### angular.element
`angular.element('body')` == `angular.element(document.querySelectorAll('body'))`

### inArray
`array.inArray(needle)` == `(array.indexOf(needle) != -1)`



