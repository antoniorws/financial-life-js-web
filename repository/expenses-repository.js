/**
 * 
 * @param {String} uid  
 * @param {JSON} expense 
 * @returns Promisse with expense created
 */
 function createExpense(uid, expense){
    return firestore.collection("users/" + uid + "/expenses").add(expense)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} expenseID
 * @description delete expense
 */
function deleteExpense(uid, expenseID){
    firestore.doc("users/" + uid + "/expenses/" + expenseID).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} expenseID
 * @param {JSON} expense 
 * @description Update expense
 */
function updateExpense(uid, expenseID, expense){
    firestore.doc("users/" + uid + "/expenses/" + expenseID).set(expense)
}

/**
 * 
 * @param {String} uid 
 * @param {String} yearMonthStart 
 * @param {String} yearMonthEnd 
 * @param {String} category 
 * @param {String} account 
 * @returns User expenses
 */
function getMonthlyExpense(uid, yearMonthStart, yearMonthEnd, category, account){
    let research = firestore.collection("users/" + uid + "/expenses")
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
 * @param {String} uid 
 * @param {String} expenseID
 * @param {String} payed 
 * @description Update account
 */
 function receiveOrGiveBackExpense(uid, expenseID, payed){
    firestore.doc("users/" + uid + "/expenses/" + expenseID)
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
 * @param {string} uid 
 * @param {string} expenseID 
 */
 function getDespesa(uid, expenseID){
    return firestore.doc("users/" + uid + "/expenses/" + expenseID).get()
}