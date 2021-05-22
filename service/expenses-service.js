const btnRegister = document.querySelector("#registerExpense")
const btnCancel = document.querySelector("#cancelUpdate")
const tableExpenses = document.querySelector("#tableExpenses")
//Nova despesa
const divNewData = document.querySelector("#div-new-data")
const nameNewExpense = document.querySelector("#nameNewExpense")
const dateNewExpense = document.querySelector("#dateNewExpense")
const categoryNewExpense = document.querySelector("#categoryNewExpense")
const accountNewExpense = document.querySelector("#accountNewExpense")
const valueNewExpense = document.querySelector("#valueNewExpense")
const repeatExpense = document.querySelector("#repeatExpense")
const payedNewExpense = document.querySelector("#payedNewExpense")
//filtro
const categoryFilter = document.querySelector("#categoryFilter")
const accountFilter = document.querySelector("#accountFilter")
const dateFilter = document.querySelector("#dateExpenseFilter")
//
const previsionMonthlyBalance = document.querySelector("#monthlyPrevision")
let totalExpense = [];

/**
 * @description Verify if user is logged
*/
function verifyUser(){
    firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
            init()
        } else {
            window.location.href = "../index.html"
        }
    });
}

/**
 * @description Init methods to screen.
 */
function init(){
    const dateToday = new Date();
    const day = formatDay(dateToday)
    const month = formatMonth(dateToday)
    const year = dateToday.getFullYear()
    document.querySelector("#nav-expenses").classList.add("main")
    fillComboBoxCategories()
    fillComboBoxAccounts()
    fillCurrentDate(day, month, year)
    getAllMonthExpenses(month, year, "", "")
}

/**
 * @description Monthly Prevision.
 */
function previsionMonth(){
    let banksAndValues = "";
    totalExpense.forEach(bank => {
        const symbol = symbolFromCurrency(bank.coin)
        banksAndValues += `${bank.bank}: ${symbol} ${bank.expenseValue} \n`
    })
    previsionMonthlyBalance.innerText = banksAndValues
}

/**
 * 
 * @param {string} currency 
 * @returns Symbol from currency
 */
function symbolFromCurrency(currency){
    let symbolCurrency = ""
    if(currency === "BRL"){
        symbolCurrency = "R$ "
    }else if(currency === "EUR"){
        symbolCurrency = "€ "
    }else if(currency === "USD"){
        symbolCurrency = "$ "
    }
    return symbolCurrency
}

/**
 * 
 * @param {string} day 
 * @param {string} month 
 * @param {string} year 
 * @description Fill current date
 */
function fillCurrentDate(day, month, year){
    dateNewExpense.value = year + "-" + month + "-" + day
    dateFilter.value = year + "-" + month
}

/**
 * @description Fill ComboBox Categories
 */
function fillComboBoxCategories(){
    const response = getCategoriesExpense(firebase.auth().currentUser.uid)
    response.then(typesOfExpenses => {
        typesOfExpenses.forEach(typeExpense => {
            const option = document.createElement("option")
            option.value = typeExpense.data().name
            option.innerText = typeExpense.data().name
            categoryNewExpense.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = typeExpense.data().name
            categoryFilter.appendChild(optionFiltro)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Fill ComboBox Accounts
 */
function fillComboBoxAccounts(){
    const response = getaccounts(firebase.auth().currentUser.uid)
    response.then(accounts => {
        accounts.forEach(account => {
            const option = document.createElement("option")
            option.value = account.id + "--"+account.data().currency
            option.innerText = account.data().name
            accountNewExpense.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = account.data().name
            accountFilter.appendChild(optionFiltro)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * 
 * @param {string} month 
 * @param {string} year 
 * @param {string} category 
 * @param {string} account 
 * @description Load all of the user expense at the expense table
 */
 function getAllMonthExpenses(month, year, category, account){
    totalExpense = []
    while(tableExpenses.childNodes.length > 2){
        tableExpenses.removeChild(tableExpenses.lastChild);
    }
    const dateStart = year + "-" + month
    const monthEnd = parseInt(month) === 12 ? "01" : "0" + (parseInt(month) + 1)
    const dateEnd = year + "-" + monthEnd
    const response = getMonthlyExpense(firebase.auth().currentUser.uid, dateStart, dateEnd, category, account)
    response.then((expenses) => {
        expenses.forEach(expense => {
            const expenseJSON = expense.data()
            expenseJSON.id = expense.id
            
            let bankAlreadyExist = false;
            
            totalExpense.forEach(expenseBank => {
                if(expenseBank.bank === expenseJSON.account.name){
                    expenseBank.expenseValue += parseFloat(expenseJSON.value)
                    bankAlreadyExist = true
                }
            })

            if(!bankAlreadyExist){
                totalExpense.push({
                    "bank": expenseJSON.account.name,
                    "expenseValue": parseFloat(expenseJSON.value),
                    "coin": expenseJSON.account.currency
                })
            }
            
            updateTable(expenseJSON)
        });
        previsionMonth()
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Filter by month
 */
dateFilter.addEventListener("change", () => {
    filterResearch()
})

/**
 * @description Filter by category
 */
categoryFilter.addEventListener("change", () => {
    filterResearch()
})

/**
 * @description Filter by account
 */
accountFilter.addEventListener("change", () => {
    filterResearch()
})

/**
 * @description Filter
 */
function filterResearch(){
    const dateFilterSplit = dateFilter.value.split("-")
    getAllMonthExpenses(dateFilterSplit[1], dateFilterSplit[0], categoryFilter.value, accountFilter.value)
}

/**
 * 
 * @param {JSON} expense 
 * @description Load table
 */
 function updateTable(expense){
    const tr = document.createElement("TR")
    const tdName = document.createElement("TD")
    const tdDate = document.createElement("TD")
    const tdCategory = document.createElement("TD")
    const tdAccount = document.createElement("TD")
    const tdValue = document.createElement("TD")
    const tdPayed = document.createElement("TD")
    const btnDelete = document.createElement("BUTTON")
    const btnUpdate = document.createElement("BUTTON")
    
    btnDelete.innerText = "Delte"
    btnDelete.classList.add("btn-table")
    btnUpdate.innerText = "Change"
    btnUpdate.classList.add("btn-table")

    tdName.innerText = expense.name 
    tdDate.innerText = expense.date
    tdCategory.innerText = expense.category
    tdAccount.innerText = typeof expense.account === "string" ? expense.account : expense.account.name
    tdValue.innerText = symbolFromCurrency(expense.account.currency) + expense.value
    tr.appendChild(tdName)
    tr.appendChild(tdDate)
    tr.appendChild(tdCategory)
    tr.appendChild(tdAccount)
    tr.appendChild(tdValue)
    tr.appendChild(tdPayed)
    tr.appendChild(btnUpdate)
    tr.appendChild(btnDelete)
    
    if(expense.payed === "N"){
        btnPay(tdPayed, expense)
    }else{
        btnPayed(tdPayed, expense)
    }

    tableExpenses.appendChild(tr)

    btnUpdate.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }
        payedNewExpense.classList.add("hidden-class")
        btnRegister.classList.add("hidden-class")
        repeatExpense.classList.add("hidden-class")
        btnCancel.classList.remove("hidden-class")
        nameNewExpense.value = expense.name
        dateNewExpense.value = expense.date
        categoryNewExpense.value = expense.category
        accountNewExpense.value = expense.account.id + "--" + expense.account.currency
        valueNewExpense.value = expense.value
        payedNewExpense.value = expense.payed
        nameNewExpense.focus()

        const btnUpdateExpense = document.createElement("BUTTON")
        btnUpdateExpense.innerText = "Update"
        divNewData.appendChild(btnUpdateExpense)
        
        btnUpdateExpense.addEventListener("click", () => {
            expense = getExpenseJSON(expense.id)
            
            getDespesa(firebase.auth().currentUser.uid, expense.id)
            .then(expenseDB => {

                if(expense.account.name != expenseDB.data().account.name && 
                    expenseDB.data().payed === "S"){

                    alert("Can not change an account from a payed expense.\n Give back the expense to change an account!")
                }else{
                    updateExpense(firebase.auth().currentUser.uid, expense.id, expense)
                    tdName.innerText = expense.name 
                    tdDate.innerText = expense.data
                    tdCategory.innerText = expense.category
                    tdAccount.innerText = expense.account.name     
                    tdValue.innerText = symbolFromCurrency(expense.account.currency) + expense.value
                    
                    cancel(btnUpdateExpense)
                }
            }).catch(error => {
                alert(error.mesage)
            })
        })

        btnCancel.addEventListener("click", () => {
            cancel(btnUpdateExpense)
        })
    })

    btnDelete.addEventListener("click", () => {
        if(expense.payed === "Y"){
            creditExpense(expense)
        }
        deleteExpense(firebase.auth().currentUser.uid, expense.id)
        tr.remove()
    })

}

/**
 * @description Pay expense
 * @param {String} tdPayed 
 * @param {JSON} expense 
 */
function btnPay(tdPayed, expense){
    const btnPay = document.createElement("BUTTON")
    btnPay.classList.add("btn-table")
    btnPay.classList.add("btn-pay")
    btnPay.innerText = "Pagar"
    for (child of tdPayed.children){
        child.remove();
    }
    tdPayed.appendChild(btnPay)
    btnPay.addEventListener("click", () => {
        expense.payed = "Y"
        debitExpense(expense)
        receiveOrGiveBackExpense(firebase.auth().currentUser.uid, expense.id, expense.payed)
        btnPayed(tdPayed, expense)
    })
}

/**
 * @description Give back payed expense
 * @param {String} tdPayed 
 * @param {Json} expense 
 */
function btnPayed(tdPayed, expense){
    const btnPayed = document.createElement("BUTTON")
    btnPayed.classList.add("btn-table")
    btnPayed.innerText = "Payed"
    for (child of tdPayed.children){
        child.remove();
    }
    tdPayed.appendChild(btnPayed)
    btnPayed.addEventListener("click", () => {
        expense.payed = "N"
        creditExpense(expense)
        receiveOrGiveBackExpense(firebase.auth().currentUser.uid, expense.id, expense.payed)
        btnPay(tdPayed, expense)
    })
}

/**
 * 
 * @param {String} id 
 * @returns Expense JSON
 */
function getExpenseJSON(id){
    const accountValue = accountNewExpense.value.split("--")
    const expenseJSON = {"name": nameNewExpense.value,
                        "date": dateNewExpense.value,
                        "category": categoryNewExpense.value,
                        "account": {
                            "id": accountValue[0],
                            "name": accountNewExpense.selectedOptions[0].innerText,
                            "currency": accountValue[1]
                        },
                        "value": valueNewExpense.value,
                        "payed": payedNewExpense.value
                    }

    if(id !== undefined){
        expenseJSON.id = id
        return expenseJSON
    }
    return expenseJSON
        
 }

/**
 * @description Button click to register expense
 */
btnRegister.addEventListener("click", () => {
    registerExpense()
})

/**
 * 
 * @param {string} expenseDate 
 * @returns day formated
 */
function formatDay(expenseDate){
    return expenseDate.getDate().toString().length === 2 ? expenseDate.getDate() : "0" + expenseDate.getDate()
}

/**
 * 
 * @param {string} expenseDate 
 * @returns Motnh formated
 */
function formatMonth(expenseDate){
    return (expenseDate.getMonth() + 1).toString().length === 2 ? (expenseDate.getMonth() + 1) : "0" + (expenseDate.getMonth() + 1)
}

/**
 * @description Register expense
 */
function registerExpense(){
    const expenseJSON = getExpenseJSON()
    let qtdRepeatExpense = parseInt(repeatExpense.value);
    registerExpenseDB(expenseJSON, qtdRepeatExpense, dateFilter.value, null)
}

/**
 * 
 * @param {JSON} expenseJSON 
 * @param {int} repetition 
 * @param {string} filterMonthly 
 */
function registerExpenseDB(expenseJSON, repetition, filterMonthly, number){
    const name = expenseJSON.name
    if(number === null && repetition > 1){
        number = repetition;
        expenseJSON.name += ` 1/${number}`
    }else if(repetition >= 1 && number != null){
        const qtd = (number - repetition + 1).toString()
        expenseJSON.name += ` ${qtd}/${number}`
    }

    createExpense(firebase.auth().currentUser.uid, expenseJSON)
    .then((expense) => {
        expenseJSON.id = expense.id
        if(expenseJSON.payed === "S"){
            debitExpense(expenseJSON)
        }
        if(expenseJSON.data.includes(filterMonthly)){
            updateTable(expenseJSON)
        }
        repetition--
        if(repetition > 0){
            expenseJSON.date = validDateRepetition(expenseJSON.date)
            expenseJSON.name = name
            registerExpenseDB(expenseJSON, repetition, filterMonthly, number)
        }else{
            cleanRegister()
        }
    }).catch(error => {
        console.log(error.message)
    })
}

/**
 * 
 * @param {JSON} dataJson 
 * @returns valid date
 */
function validDateRepetition(dataJson){
    const expenseDate = new Date(dataJson);
    let day = formatDay(expenseDate)
    day = (parseInt(day) + 1).toString().length === 2 ? (parseInt(day) + 1).toString() : "0" + (parseInt(day) + 1).toString()
    let month = formatMonth(expenseDate)
    let year = expenseDate.getFullYear()

    if(month === "12"){
        month = "01"
        year = (parseInt(year) + 1).toString()
    }else{
        month = (parseInt(month) + 1).toString().length === 2 ? (parseInt(month) + 1) : "0" + (parseInt(month) + 1)
    }

    if(month === "02" && parseInt(day) > 28){
        day = "28"
    }
    return `${year}-${month}-${day}`
}

/**
 * @description Debit value
 * @param {Json} expenseJSON 
 */
function debitExpense(expenseJSON){
    getAccount(firebase.auth().currentUser.uid, expenseJSON.account.id)
    .then(account => {
        const newBalance = account.data().balance - expenseJSON.valor
        atualizaSaldoaccount(firebase.auth().currentUser.uid, account.id, newBalance)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Credit value
 * @param {Json} expenseJSON 
 */
 function creditExpense(expenseJSON){
    getaccount(firebase.auth().currentUser.uid, expenseJSON.account.id)
    .then(account => {
        const newBalance = parseFloat(account.data().saldo) + parseFloat(expenseJSON.valor)
        updateAccountBalance(firebase.auth().currentUser.uid, account.id, newBalance)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Clean values
 */
function cleanRegister(){
    nameNewExpense.value = ""
    dateNewExpense.innerText = ""
    categoryNewExpense.value = ""
    accountNewExpense.value = ""
    valueNewExpense.value = ""
    payedNewExpense.value = "N"
    repeatExpense.value = "1"
}

/**
 * @description Cancela operação
 * @param {BUTTON} btnUpdateExpenses 
 */
function cancel(btnUpdateExpenses){
    payedNewExpense.classList.remove("hidden-class")
    const tableButtons = document.querySelectorAll("table button")
    btnRegister.classList.remove("hidden-class")
    repeatExpense.classList.remove("hidden-class")
    btnUpdateExpenses.remove()
    btnCancel.classList.add("hidden-class")
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
    cleanRegister()
}

//MAIN

verifyUser()