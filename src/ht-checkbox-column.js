/**
 * Handsontable checkbox plugin.
 * depend on Handsontable
 */
/*global htCheckboxColumn: true*/
var htCheckboxColumn = (function() {
    'use strict';
    var plugin = {};

    /**
     * Checkbox column index.
     * @type {Boolean}
     */
    var checkboxColumnIndex;

    /**
     * State of the header check.
     * @type {Boolean}
     */
    var headerCheckState = false;

    /**
     * Checked data name.
     * @type {String}
     */
    var cellDataName;

    // register after cheked row chnage callback option.
    Handsontable.hooks.register('afterCheckedRowChange');

    /**
     * Set custom setting.
     * @param {Handsontable} hTable
     * @param {Array} excludeSortColumns
     */
    plugin.SetSetting = function(hTable, columIndex, headerName, dataName, readOnly, colWidth) {
        checkboxColumnIndex = columIndex ? columIndex : 0;
        cellDataName = dataName ? dataName : 'checked';
        if (readOnly !== true) readOnly = false;
        if (!colWidth) colWidth = 25;

        var options = hTable.getSettings();
        // header
        var headers = options.colHeaders;
        headers.splice(columIndex, 0, !headerName ? '' : headerName);
        // column
        var columns = options.columns;
        columns.splice(columIndex, 0, { data: cellDataName, type: 'checkbox', readOnly: readOnly, renderer: checkboxRenderer });
        // width
        var widths = options.colWidths;
        widths.splice(columIndex, 0, colWidth);

        // update Handsontable
        hTable.updateSettings({
            colHeaders: headers,
            columns: columns,
            colWidths: widths,
            afterGetColHeader: onAfterGetColHeader,
            afterChange: onAfterChange
        });

        // add function for get the checked data.
        hTable.getCheckedData = getCheckedData;
    };

    /**
     * Checkbox horizontal align to center.
     */
    function checkboxRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.style['text-align'] = 'center';
        Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
    }

    /**
     * Event of the after get column header.
     * @param  {Number} col
     * @param  {Element} th
     */
    function onAfterGetColHeader(col, th) {
        if (col !== checkboxColumnIndex) return;
        // Handsontable has table clone. not to use node id.

        // remove current
        var thLast = th.firstChild.lastChild;
        if (thLast.nodeName === 'INPUT') {
            th.firstChild.removeChild(thLast);
        }

        // create checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = headerCheckState;
        checkbox.addEventListener('click', onHeaderCheckboxClick.bind(this, checkbox), false);
        th.firstChild.appendChild(checkbox);
    }

    /**
     * Event of header checkbox click.
     * @param  {Element} checkbox
     */
    function onHeaderCheckboxClick(checkbox) {
        headerCheckState = checkbox.checked;
        var collection = this.getData();
        for (var i = 0; i < collection.length; i++) {
            var data = collection[i];
            data[cellDataName] = headerCheckState;
        }
        this.render();
        var checkedData = getCheckedData.apply(this);
        Handsontable.hooks.run(this, 'afterCheckedRowChange', headerCheckState, -1, checkedData, checkedData);
    }

    /**
     * Event of cell checkbox change.
     * @param  {Array} changes
     */
    function onAfterChange(changes) {
        if (!changes) return;
        var change = changes[0];
        var row = change[0];
        var prop = change[1];
        if (prop !== cellDataName) return;
        var currentData = this.getSourceDataAtRow(row);
        var checkedData = getCheckedData.apply(this);
        Handsontable.hooks.run(this, 'afterCheckedRowChange', headerCheckState, row, currentData, checkedData);
    }

    /**
     * Get the all checked rows.
     * @return {Array} [description]
     */
    function getCheckedData() {
        var checkedData = [];
        var collection = this.getData();
        for (var i = 0; i < collection.length; i++) {
            var data = collection[i];
            var checked = data[cellDataName];
            if (checked) {
                checkedData.push(data);
            }
        }
        return checkedData;
    }

    return plugin;
}());