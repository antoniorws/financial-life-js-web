/**
 *  
 * @param {JSON} income 
 * @returns A promise with the income created
 */
 function createIncome(income){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/incomes").add(income)
}

/**
 * 
 * @param {JSON} idIncome
 * @description delete a income
 */
function deleteIncome(idIncome){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/incomes/" + idIncome).delete()
}

/**
 *  
 * @param {String} idIncome
 * @param {JSON} income 
 * @description Update income
 */
function updateIncome(idIncome, income){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/incomes/" + idIncome).set(income)
}

/**
 * 
 * @param {String} idReceita
 * @param {string} received 
 * @description Update account
 */
function receiveOrGiveBackIncome(idReceita, received){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/incomes/" + idReceita)
    .update({
        "received": received
    }).then(() =>{
        console.log("Income update with success!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 * 
 * @param {String} yearMonthStart 
 * @param {String} yearMonthEnd 
 * @param {String} category 
 * @param {String} account 
 * @returns Incomes by use
 */
function getIncomesMonth(yearMonthStart, yearMonthEnd, category, account){
    let research = firestore.collection("users/" + firebase.auth().currentUser.uid + "/incomes")
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
 * @param {string} idIncome 
 */
function getIncome(idIncome){
    return firestore.doc("users/" + firebase.auth().currentUser.uid + "/incomes/" + idIncome).get()
}