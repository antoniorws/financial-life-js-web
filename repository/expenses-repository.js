/**
 * 
 * @param {JSON} expense 
 * @returns Promisse with expense created
 */
 function createExpense(expense){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/expenses").add(expense)
}

/**
 * 
 * @param {JSON} expenseID
 * @description delete expense
 */
function deleteExpense( expenseID){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/expenses/" + expenseID).delete()
}

/**
 * 
 * @param {String} expenseID
 * @param {JSON} expense 
 * @description Update expense
 */
function updateExpense(expenseID, expense){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/expenses/" + expenseID).set(expense)
}

/**
 * 
 * @param {String} yearMonthStart 
 * @param {String} yearMonthEnd 
 * @param {String} category 
 * @param {String} account 
 * @returns User expenses
 */
function getMonthlyExpense(yearMonthStart, yearMonthEnd, category, account){
    let research = firestore.collection("users/" + firebase.auth().currentUser.uid + "/expenses")
                                .where("date", ">=", yearMonthStart + "-01")
                                .where("date", "<", yearMonthEnd + "-01") 
    if(category != ""){
        research = research.where("category", "==", category)            
    }
    if(account != ""){
        research = research.where("account.name", "==", account)            
    }
    return research.get()
}

/**
 * 
 * @param {String} expenseID
 * @param {String} payed 
 * @description Update account
 */
 function receiveOrGiveBackExpense( expenseID, payed){
    firestore.doc("users/" +  firebase.auth().currentUser.uid+ "/expenses/" + expenseID)
    .update({
        "payed": payed
    }).then(() =>{
        console.log("Expense updated!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 *  
 * @param {string} expenseID 
 */
 function getDespesa( expenseID){
    return firestore.doc("users/" + firebase.auth().currentUser.uid + "/expenses/" + expenseID).get()
}
