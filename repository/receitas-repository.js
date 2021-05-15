/**
 * 
 * @param {String} uid  
 * @param {JSON} income 
 * @returns A promise with the income created
 */
 function createIncome(uid, income){
    return firestore.collection("users/" + uid + "/incomes").add(income)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} idIncome
 * @description delete a income
 */
function deleteIncome(uid, idIncome){
    firestore.doc("users/" + uid + "/incomes/" + idIncome).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} idIncome
 * @param {JSON} income 
 * @description Update income
 */
function updateIncome(uid, idIncome, income){
    firestore.doc("users/" + uid + "/incomes/" + idIncome).set(income)
}

/**
 * 
 * @param {String} uid 
 * @param {String} idReceita
 * @param {string} received 
 * @description Update account
 */
function receiveOrGiveBackIncome(uid, idReceita, received){
    firestore.doc("users/" + uid + "/incomes/" + idReceita)
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
 * @param {String} uid 
 * @param {String} yearMonthStart 
 * @param {String} yearMonthEnd 
 * @param {String} category 
 * @param {String} account 
 * @returns Incomes by use
 */
function getIncomesMonth(uid, yearMonthStart, yearMonthEnd, category, account){
    let research = firestore.collection("users/" + uid + "/incomes")
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
 * @param {string} uid 
 * @param {string} idIncome 
 */
function getIncome(uid, idIncome){
    return firestore.doc("users/" + uid + "/incomes/" + idIncome).get()
}