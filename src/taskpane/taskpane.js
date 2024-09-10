/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */

Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {
        document.getElementById("create-table").onclick = () => trycatch(createTable);
        document.getElementById("filter-table").onclick = () => tryCatch(filterTable);
        document.getElementById("sort-table").onclick = () => tryCatch(sortTable);
        document.getElementById("sideload-msg").style.display = "none";
        document.getElementById("app-body").style.display = "flex";
        document.getElementById("create-chart").onclick = () => tryCatch(createChart);
        document.getElementById("freeze-header").onclick = () => tryCatch(freezeHeader);
        document.getElementById("open-dialog").onclick = openDialog;
  }
});

async function createTable() {
    await Excel.run(async (context) => {

        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        const expensesTable = currentWorksheet.tables.add("A1:D1", true /*hasHeaders*/);
        expensesTable.name = "ExpensesTable";

        expensesTable.getHeaderRowRange().values =
            [["Date", "Merchant", "Category", "Amount"]];

        expensesTable.rows.add(null /*add at the end*/, [
            ["1/1/2017", "The Phone Company", "Communications", "120"],
            ["1/2/2017", "Northwind Electric Cars", "Transportation", "142.33"],
            ["1/5/2017", "Best For You Organics Company", "Groceries", "27.9"],
            ["1/10/2017", "Coho Vineyard", "Restaurant", "33"],
            ["1/11/2017", "Bellows College", "Education", "350.1"],
            ["1/15/2017", "Trey Research", "Other", "135"],
            ["1/15/2017", "Best For You Organics Company", "Groceries", "97.88"]
        ]);


        expensesTable.columns.getItemAt(3).getRange().numberFormat = [['\u20AC#,##0.00']];
        expensesTable.getRange().format.autofitColumns();
        expensesTable.getRange().format.autofitRows();


        await context.sync();
    });
}

async function filterTable() {
    await Excel.run(async (context) => {

        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
        const categoryFilter = expensesTable.columns.getItem('Category').filter;
        categoryFilter.applyValuesFilter(['Education', 'Groceries']);
        await context.sync();
    });
}

async function sortTable() {
    await Excel.run(async (context) => {

        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
        const sortFields = [
            {
                key: 1,            // Merchant column
                ascending: false,
            }
        ];

        await context.sync();
    });
}

async function createChart() {
    await Excel.run(async (context) => {

        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        const expensesTable = currentWorksheet.tables.getItem('ExpensesTable');
        const dataRange = expensesTable.getDataBodyRange();

        const chart = currentWorksheet.charts.add('ColumnClustered', dataRange, 'Auto');

        chart.setPosition("A15", "F30");
        chart.title.text = "Expenses";
        chart.legend.position = "Right";
        chart.legend.format.fill.setSolidColor("white");
        chart.dataLabels.format.font.size = 15;
        chart.dataLabels.format.font.color = "black";
        chart.series.getItemAt(0).name = 'Value in \u20AC';

        await context.sync();
    });
}

async function freezeHeader() {
    await Excel.run(async (context) => {

        const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
        currentWorksheet.freezePanes.freezeRows(1);

        await context.sync();
    });
}



/** Default helper for invoking an action and handling errors. */
async function tryCatch(callback) {
    try {
        await callback();
    } catch (error) {
        // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
        console.error(error);
    }
}

