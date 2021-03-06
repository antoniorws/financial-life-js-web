const btnRegisterIncome = document.querySelector("#registerIncome")
const btnRegisterExpense = document.querySelector('#registerExpense')
const textIncome = document.querySelector("#newCategoryIncome")
const textExpense = document.querySelector("#newCategoryExpense")
const tableExpenses = document.querySelector("#table-expenses")
const tableIncomes = document.querySelector("#table-incomes")

/**
 * @description Verify if user exist
 */
function verifyUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            init()
        } else {
            window.location.href = "../index.html"
        }
    });
}

/**
 * @description Init methods to screen
 */
function init(){
    document.querySelector("#nav-categories").classList.add("main")
    loadIncomesCategories()
    loadExpensesCategories()
}

/**
 * @description Load expenses categories
 */
function loadExpensesCategories(){
    while(tableExpenses.childNodes.length > 2){
        tableExpenses.removeChild(tableExpenses.lastChild);
    }
    const response = getCategoriesExpense()
    response.then(typesOfExpenses => {
        typesOfExpenses.forEach(typeExpense => {
            updateTable(typeExpense.id, typeExpense.data().name, tableExpenses, "/expense_category/")
            
        });
    }).catch(error =>{
        console.log(error.message);
    })

}

/**
 * @description Load incomes categories
 */
function loadIncomesCategories(){
    while(tableIncomes.childNodes.length > 2){
        tableIncomes.removeChild(tableIncomes.lastChild);
    }
    const response = getIncomeCategories()
    response.then(typesOfExpenses => {
        typesOfExpenses.forEach(typeExpense => {
            updateTable(typeExpense.id, typeExpense.data().name, tableIncomes, "/income_category/")
            
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Event click to button Register Expense
 */
btnRegisterExpense.addEventListener("click", () => {
    createExpenseCategory(textExpense.value)
    .then((expenseCategory) => {
        updateTable(expenseCategory.id, textExpense.value, tableExpenses, "/expense_category/")
        clean()
    }).catch(error => {
        alert(error.message)
    })
    textExpense.innerText = ""
})

/**
 * @description Event click to button Register Income
 */
btnRegisterIncome.addEventListener("click", () => {
    createIncomeCategory(textIncome.value)
    .then((incomeCategory) => {
        updateTable(incomeCategory.id, textIncome.value, tableIncomes, "/income_category/")
        clean()
    }).catch(error => {
        alert(error.message)
    })
    textIncome.innerText = ""
})

/**
 * 
 * @param {string} idMovimentation 
 * @param {string} nameMovimentation 
 * @param {table} table 
 * @param {string} category 
 * @description Update table
 */
function updateTable(idMovimentation, nameMovimentation, table, category){
    const tr = document.createElement("TR")
    const tdName = document.createElement("TD")
    const btnDeleteCategory = document.createElement("BUTTON")
    const btnUpdateCategory = document.createElement("BUTTON")
    btnDeleteCategory.innerText = "Delete"
    btnDeleteCategory.classList.add("btn-table")
    btnUpdateCategory.innerText = "Change"
    btnUpdateCategory.classList.add("btn-table")
    tdName.className = idMovimentation
    tdName.innerText = nameMovimentation 
    tr.appendChild(tdName)
    tr.appendChild(btnUpdateCategory)
    tr.appendChild(btnDeleteCategory)
    table.appendChild(tr)

    btnUpdateCategory.addEventListener("click", () => {
        let nameChanged = prompt("Write a new category name:", "");
        if (nameChanged != null && nameChanged != "") {
            tdName.innerText = nameChanged;
            clean()
            updateCategory(idMovimentation, nameChanged, category)
        } 
    })

    btnDeleteCategory.addEventListener("click", () => {
        deleteCategory(idMovimentation, category)
        tr.remove()
    })
}

/**
 * Clean new category
 */
function clean(){
    textIncome.value = ""
    textExpense.value = ""
}

verifyUser(); 