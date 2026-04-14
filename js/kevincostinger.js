"use strict";
/*******************************************************
 *     kevincostinger.js - 100p.
 *
 *     This is Kevin. Kevin keeps track of your expenses
 *     and costs. To add an expense, pick a date, declare
 *     the amount and add a short description.
 *
 *     When you submit the form, all fields are validated.
 *     If Kevin is not happy with your inputs, the least
 *     he will do is, bring you back to the field where
 *     you made a mistake. But who knows? Maybe he can
 *     even provide some excellent User experience?
 *     (+5 Bonus points available)
 *
 *     These are the rules for the form validation:
 *      - Date is valid, if it's not empty.
 *      - Amount is valid, if it's at least 0.01.
 *      - Text is valid, if it's at least 3 letters long.
 *
 *     If everything is okay, Kevin adds a new table row,
 *     containing the expense. The table row also contains
 *     a button, which deletes the expense, once you click
 *     it. After adding a table row, the form is reset and
 *     ready for the next input.
 *
 *     At the bottom of the expense tracker, you can see
 *     a small number. It represents the sum of all expenses,
 *     which are currently tracked. It is always accurate!
 *
 *     Have a look at the pictures provided. They demonstrate
 *     how the software looks like. Notice the details, like
 *     the perfectly formatted currency! Isn't that great?
 *
 *     By the way...
 *     Kevin is a clean guy. He is free of code duplications.
 *     Kevin defines his quality by using functions and
 *     events, to keep his sourcecode clean af. He understands
 *     the scope of his variables and of course, makes use of
 *     event delegation, to keep his event listeners tidied up!
 *
 *     Emina - 2026-04-14
 *******************************************************/
let sumExpenses = 0; //Use this variable to keep the sum up to date.

const selectors = {
    form: "#expenseTracker form",
    date: "#date",
    amount: "#amount",
    expense: "#expense",
    tableBody: "#expenses tbody",
    expenseSum: "#expenseSum"
};

function getElements() {
    return {
        form: document.querySelector(selectors.form),
        dateInput: document.querySelector(selectors.date),
        amountInput: document.querySelector(selectors.amount),
        expenseInput: document.querySelector(selectors.expense),
        tableBody: document.querySelector(selectors.tableBody),
        expenseSum: document.querySelector(selectors.expenseSum)
    };
}

function submitForm(e){
    //TODO: Prevent the default behavior of the submit button.
    e.preventDefault();

    //TODO: Validate the form. If everything is fine, add the expense to the tracker and reset the form.
    const { form, dateInput, amountInput, expenseInput, tableBody } = getElements();

    const validationResult = validateForm(dateInput, amountInput, expenseInput);

    if (!validationResult.isValid) {
        validationResult.invalidField.focus();
        validationResult.invalidField.reportValidity();
        return;
    }

    const expenseData = {
        date: dateInput.value.trim(),
        amount: Number(amountInput.value),
        text: expenseInput.value.trim()
    };

    addExpenseRow(tableBody, expenseData);
    updateSum(expenseData.amount);
    form.reset();
    clearValidationState(dateInput, amountInput, expenseInput);
    dateInput.focus();
}

function validateForm(dateInput, amountInput, expenseInput) {
    clearValidationState(dateInput, amountInput, expenseInput);

    const dateValue = dateInput.value.trim();
    const amountValue = Number(amountInput.value);
    const expenseValue = expenseInput.value.trim();

    if (isEmpty(dateValue)) {
        setFieldInvalid(dateInput, "Please enter a date.");
        return { isValid: false, invalidField: dateInput };
    }

    if (Number.isNaN(amountValue) || amountValue < 0.01) {
        setFieldInvalid(amountInput, "Amount must be at least 0.01.");
        return { isValid: false, invalidField: amountInput };
    }

    if (expenseValue.length < 3) {
        setFieldInvalid(expenseInput, "Expense text must be at least 3 letters long.");
        return { isValid: false, invalidField: expenseInput };
    }

    return { isValid: true };
}

function setFieldInvalid(field, message) {
    field.setCustomValidity(message);
}

function clearValidationState(...fields) {
    fields.forEach(function(field) {
        field.setCustomValidity("");
    });
}

function clearFieldWarning(e) {
    e.target.setCustomValidity("");
}

function addExpenseRow(tableBody, expenseData) {
    const row = document.createElement("tr");
    row.dataset.amount = String(expenseData.amount);

    const dateCell = document.createElement("td");
    dateCell.textContent = expenseData.date;

    const amountCell = document.createElement("td");
    amountCell.textContent = formatEuro(expenseData.amount);

    const expenseCell = document.createElement("td");
    expenseCell.textContent = expenseData.text;

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "X";
    deleteButton.setAttribute("aria-label", "Delete expense");
    deleteCell.appendChild(deleteButton);

    row.append(dateCell, amountCell, expenseCell, deleteCell);
    tableBody.appendChild(row);
}

function updateSum(amountDelta) {
    sumExpenses += amountDelta;
    renderSum();
}

function renderSum() {
    const { expenseSum } = getElements();
    expenseSum.textContent = formatEuro(sumExpenses);
}

function handleTableClick(e) {
    const deleteButton = e.target.closest("button");

    if (!deleteButton) {
        return;
    }

    const row = deleteButton.closest("tr");

    if (!row || row.querySelector("th")) {
        return;
    }

    const amount = Number(row.dataset.amount);

    if (!Number.isNaN(amount)) {
        updateSum(-amount);
    }

    row.remove();
}

/*****************************
 * DO NOT CHANGE CODE BELOW.
 * USE IT.
 ****************************/


/*******************************************************
 *     Checks if variable is empty
 *     @param {any} variable - Variable which you want to check.
 *     @return {Boolean} Empty or not.
 ******************************************************/
let isEmpty = function(variable) {
    if(Array.isArray(variable))
        return (variable.length === 0);
    else if(typeof variable === "object")
        return (Object.entries(variable).length === 0);
    else
        return (typeof variable === "undefined" || variable == null || variable === "");
};

/*******************************************************
 *     Converts number into currency string.
 *     @param {Number} number - Any numeric value.
 *     @return {String} Well formatted currency string.
 ******************************************************/
function formatEuro(number) {
    return number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function initializeSumFromTable() {
    const { tableBody } = getElements();
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    sumExpenses = 0;

    rows.forEach(function(row) {
        if (row.querySelector("th")) {
            return;
        }

        const amountCell = row.children[1];

        if (!amountCell) {
            return;
        }

        const normalizedAmount = amountCell.textContent
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^\d.-]/g, "");

        const amount = Number(normalizedAmount);

        if (!Number.isNaN(amount)) {
            row.dataset.amount = String(amount);
            sumExpenses += amount;
        }
    });

    renderSum();
}

function initializeValidationListeners() {
    const { dateInput, amountInput, expenseInput } = getElements();

    [dateInput, amountInput, expenseInput].forEach(function(field) {
        field.addEventListener("input", clearFieldWarning);
        field.addEventListener("change", clearFieldWarning);
    });
}

function initializeApp() {
    const { form, tableBody } = getElements();

    if (!form || !tableBody) {
        return;
    }

    form.addEventListener("submit", submitForm);
    tableBody.addEventListener("click", handleTableClick);

    initializeValidationListeners();
    initializeSumFromTable();
}

document.addEventListener("DOMContentLoaded", initializeApp);