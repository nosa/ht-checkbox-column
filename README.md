# ht-checkbox-column

ht-checkboc-column is a [Handsomtable](http://handsontable.com/) plugin for the checkbox column.

## Features
* Row checkbox.
* Column header checkbox.(select all or deselect all)
* You can define callback for the checked row event.

## Usage
html
```html
<script src="handsontable.full.min.js"></script>
<script src="ht-checkbox-column.js"></script>
```
Javascript
```javascript
var container = document.getElementById('table');
// table create.
var settings = {
    afterCheckedRowChange: onAfterCheckedRowChange
};
var table = new Handsontable(container, settings);

///////////////////////////////
/**
 * Event of the checked row change.
 * @param  {Boolean} checked
 * @param  {Number} row
 * @param  {Object} currentData
 * @param  {Array} checkedData
 */
function onAfterCheckedRowChange(checked, row, currentData, checkedData) {
    // 
}
```

## Handsomtable Version
"handsontable": "~0.17.0"

## Licence
MIT