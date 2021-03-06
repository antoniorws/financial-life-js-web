const btnRegister = document.querySelector("#registerIncome")
const btnCancel = document.querySelector("#cancelUpdate")
const tableIncomes = document.querySelector("#tableIncomes")
//New Income
const divNewRegister = document.querySelector("#div-new-register")
const nameNewIncome = document.querySelector("#nameNewIncome")
const dateNewIncome = document.querySelector("#dateNewIncome")
const categoryNewIncome = document.querySelector("#categoryNewIncome")
const accountNewIncome = document.querySelector("#accountNewIncome")
const amountNewIncome = document.querySelector("#amountNewIncome")
const receivedNewIncome = document.querySelector("#receivedNewIncome")
//filter
const categoryFilter = document.querySelector("#categoryFilter")
const accountFilter = document.querySelector("#accountFilter")
const dateFilter = document.querySelector("#dateFilter")
//others
const empty = ""

/**
 * @description Verifica se existe usuário.
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
 * @description Fill method to screen
 */
 function init(){
    const dateToday = new Date();
    const day = dateToday.getDate().toString().length === 2 ? dateToday.getDate() : "0" + dateToday.getDate()
    const month = (dateToday.getMonth() + 1).toString().length === 2 ? (dateToday.getMonth() + 1) : "0" + (dateToday.getMonth() + 1)
    const year = dateToday.getFullYear()
    document.querySelector("#nav-incomes").classList.add("main")
    fillComboBoxCategories()
    fillComboBoxAccounts()
    fillCurrentDate(day, month, year)
    getAllIncomesMonth(month, year, empty, empty)
}

/**
 * 
 * @param {string} day 
 * @param {string} month 
 * @param {string} year 
 * @description Fill with current date
 */
function fillCurrentDate(day, month, year){
    dateNewIncome.value = year + "-" + month + "-" + day
    dateFilter.value = year + "-" + month
}

/**
 * @description Fill comboBox of the Categories
 */
 function fillComboBoxCategories(){
    const response = getIncomeCategories()
    response.then(incomesTypes => {
        incomesTypes.forEach(incomeType => {
            const option = document.createElement("option")
            option.value = incomeType.data().name
            option.innerText = incomeType.data().name
            categoryNewIncome.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = incomeType.data().name
            categoryFilter.appendChild(optionFiltro)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Fill Combo Box of Accounts
 */
 function fillComboBoxAccounts(){
    const response = getAccounts()
    response.then(accounts => {
        accounts.forEach(account => {
            const option = document.createElement("option")
            option.value = account.id + "--"+account.data().currency
            option.innerText = account.data().name
            accountNewIncome.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = account.data().name
            accountFilter.appendChild(optionFiltro)
        });
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
 * @description To filter
 */
function filterResearch(){
    const dateFilterSplit = dateFilter.value.split("-")
    getAllIncomesMonth(dateFilterSplit[1], dateFilterSplit[0], categoryFilter.value, accountFilter.value)
}

/**
 * @description Load all of incomes from user at incomes table.
 */
 function getAllIncomesMonth(month, year, category, account){
    while(tableIncomes.childNodes.length > 2){
        tableIncomes.removeChild(tableIncomes.lastChild);
    }
    const dateStart = year + "-" + month
    const monthEnd = parseInt(month) === 12 ? "01" : "0" + (parseInt(month) + 1)
    const dateEnd = year + "-" + monthEnd
    const response = getIncomesMonth(dateStart, dateEnd, category, account)
    response.then((incomes) => {
        incomes.forEach(income => {
            const incomeJSON = income.data()
            incomeJSON.id = income.id
            updateTable(incomeJSON)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * 
 * @param {JSON} income 
 * @description Load table
 */
 function updateTable(income){
    const tr = document.createElement("TR")
    const tdName = document.createElement("TD")
    const tdDate = document.createElement("TD")
    const tdCategory = document.createElement("TD")
    const tdAccount = document.createElement("TD")
    const tdAmount = document.createElement("TD")
    const tdReceived = document.createElement("TD")
    const btnDelete = document.createElement("BUTTON")
    const btnUpdate = document.createElement("BUTTON")
    
    btnDelete.innerText = "Delete"
    btnDelete.classList.add("btn-table")
    btnUpdate.innerText = "Change"
    btnUpdate.classList.add("btn-table")

    tdName.innerText = income.name 
    tdDate.innerText = income.date
    tdCategory.innerText = income.category
    tdAccount.innerText = typeof income.account === "string" ? income.account : income.account.name
    let currencySymbol = ""
    if(income.account.currency === "BRL"){
        currencySymbol = "R$ "
    }else if(income.account.currency === "EUR"){
        currencySymbol = "€ "
    }else if(income.account.currency === "USD"){
        currencySymbol = "$ "
    }
    
    tdAmount.innerText = currencySymbol + income.amount
    tr.appendChild(tdName)
    tr.appendChild(tdDate)
    tr.appendChild(tdCategory)
    tr.appendChild(tdAccount)
    tr.appendChild(tdAmount)
    tr.appendChild(tdReceived)
    tr.appendChild(btnUpdate)
    tr.appendChild(btnDelete)
    
    if(income.received === "N"){
        btnReceive(tdReceived, income)
    }else{
        btnReceived(tdReceived, income)
    }

    tableIncomes.appendChild(tr)

    btnUpdate.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }
        receivedNewIncome.classList.add("hidden-class")
        btnRegister.classList.add("hidden-class")
        btnCancel.classList.remove("hidden-class")
        nameNewIncome.value = income.name
        dateNewIncome.value = income.date
        categoryNewIncome.value = income.category
        accountNewIncome.value = income.account.id + "--" + income.account.currency
        amountNewIncome.value = income.amount
        receivedNewIncome.value = income.received
        nameNewIncome.focus()

        const btnIncomesUpdate = document.createElement("BUTTON")
        btnIncomesUpdate.innerText = "Update"
        divNewRegister.appendChild(btnIncomesUpdate)
        
        btnIncomesUpdate.addEventListener("click", () => {
            income = getIncomeJson(income.id)
            const incomeUpdate = getIncomeJson()
            getIncome(income.id)
            .then(incomeDB => {

                if((income.account.name != incomeDB.data().account.name
                    || income.amount != incomeDB.data().amount) && 
                    incomeDB.data().received === "Y"){
                    alert("Can not change an account from a received income.\n Give back the income to change an account!")
                    
                }else{
                    updateIncome(income.id, incomeUpdate)
                    tdName.innerText = income.name 
                    tdDate.innerText = income.date
                    tdCategory.innerText = income.category
                    tdAccount.innerText = income.account.name
                    
                    let symbolCurrency = ""
    
                    if(income.account.currency === "BRL"){
                        symbolCurrency = "R$ "
                    }else if(income.account.currency === "EUR"){
                        symbolCurrency = "€ "
                    }else if(income.account.currency === "USD"){
                        symbolCurrency = "$ "
                    }        
                    tdAmount.innerText = symbolCurrency + income.amount
                    
                    cancel(btnIncomesUpdate)
                }
            }).catch(error => {
                alert(error.mesage)
            })
        })

        btnCancel.addEventListener("click", () => {
            cancel(btnIncomesUpdate)
        })
    })

    btnDelete.addEventListener("click", () => {
        if(income.received === "S"){
            debitIncome(income)
        }
        deleteIncome(income.id)
        tr.remove()
    })

}

/**
 * @description To receive income
 * @param {String} tdReceived 
 * @param {JSON} income 
 */
 function btnReceive(tdReceived, income){
    const btnReceive = document.createElement("BUTTON")
    btnReceive.classList.add("btn-table")
    btnReceive.classList.add("btn-pay")
    btnReceive.innerText = "Receive"
    for (child of tdReceived.children){
        child.remove()
    }
    
    tdReceived.appendChild(btnReceive)
    btnReceive.addEventListener("click", () => {
        income.received = "Y"
        creditIncome(income)
        receiveOrGiveBackIncome(income.id, income.received)
        btnReceived(tdReceived, income)
    })
}

/**
 * @description Give back income
 * @param {String} tdReceived 
 * @param {Json} income 
 */
 function btnReceived(tdReceived, income){
    const btnReceived = document.createElement("BUTTON")
    btnReceived.classList.add("btn-table")
    btnReceived.innerText = "Received"
    for (child of tdReceived.children){
        child.remove();
    }
    
    tdReceived.appendChild(btnReceived)
    btnReceived.addEventListener("click", () => {
        income.received = "N"
        debitIncome(income)
        receiveOrGiveBackIncome(income.id, income.received)
        btnReceive(tdReceived, income)
    })
}

/**
 * 
 * @param {String} id 
 * @returns Income JSON
 */
 function getIncomeJson(id){
    const accountValue = accountNewIncome.value.split("--")
    const incomeJson = {"name": nameNewIncome.value,
                        "date": dateNewIncome.value,
                        "category": categoryNewIncome.value,
                        "account": {
                            "id": accountValue[0],
                            "name": accountNewIncome.selectedOptions[0].innerText,
                            "currency": accountValue[1]
                        },
                        "amount": amountNewIncome.value,
                        "received": receivedNewIncome.value
                    }

    if(id !== undefined){
        incomeJson.id = id
        return incomeJson
    }
    return incomeJson
        
 }

/**
 * @description Button click to register income
 */
btnRegister.addEventListener("click", () => {
    registerIncome()
})

/**
 * @description Register income
 */
 function registerIncome(){
    const incomeJSON = getIncomeJson()
    createIncome(incomeJSON)
    .then((income) => {
        incomeJSON.id = income.id
        if(receivedNewIncome.value === "Y"){
            creditIncome(incomeJSON)
        }
        cleanRegister()
        if(dateNewIncome.value.includes(dateFilter.value)){
            updateTable(incomeJSON)
        }
    }).catch(error => {
        console.log(error.message)
    })
}

/**
 * @description Debit amount from income
 * @param {Json} incomeJSON 
 */
 function debitIncome(incomeJSON){
    getAccount(incomeJSON.account.id)
    .then(account => {
        const newBalance = account.data().balance - incomeJSON.amount
        updateBalanceAccount(account.id, newBalance)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Credit amount from income.
 * @param {Json} incomeJSON 
 */
 function creditIncome(incomeJSON){
    getAccount(incomeJSON.account.id)
    .then(account => {
        const newBalance = parseFloat(account.data().balance) + parseFloat(incomeJSON.amount)
        updateBalanceAccount(account.id, newBalance)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Clean values
 */
 function cleanRegister(){
    nameNewIncome.value = ""
    dateNewIncome.innerText = ""
    categoryNewIncome.value = ""
    accountNewIncome.value = ""
    amountNewIncome.value = ""
    receivedNewIncome.value = "N"   
}

/**
 * @description Cancel operation
 * @param {BUTTON} btnUpdateIncomes 
 */
 function cancel(btnUpdateIncomes){
    receivedNewIncome.classList.remove("hidden-class")
    const tableButtons = document.querySelectorAll("table button")
    btnRegister.classList.remove("hidden-class")
    btnUpdateIncomes.remove()
    btnCancel.classList.add("hidden-class")
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
    cleanRegister()
}

verifyUser()