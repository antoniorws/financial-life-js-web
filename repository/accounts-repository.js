/**
 * 
 * @param {String} uid 
 * @param {JSON} account 
 * @returns A promisse with account created
 */
function createAccount(uid, account){
    return firestore.collection("users/" + uid + "/accounts").add(account)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} idAccount 
 * @description delete account
 */
function deleteAccount(uid, idAccount){
    firestore.doc("users/" + uid + "/accounts/" + idAccount).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} idAccount
 * @param {JSON} account 
 * @description Update account
 */
function updateAccount(uid, idAccount, account){
    firestore.doc("users/" + uid + "/accounts/" + idAccount).set(account)
}

/**
 * 
 * @param {String} uid 
 * @param {String} idAccount
 * @param {float} balance 
 * @description Update balance
 */
 function updateBalanceAccount(uid, idAccount, balance){
    firestore.doc("users/" + uid + "/accounts/" + idAccount)
    .update({
        "balance": balance
    }).then(() =>{
        console.log("Account updated!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 * 
 * @param {String} uid 
 * @returns All of the accounts from user
 */
function getAccounts(uid){
    return firestore.collection("users/" + uid + "/accounts").get()   
}

/**
 * 
 * @param {String} uid 
 * @returns One account
 */
 function getAccount(uid, idAccount){
    return firestore.doc("users/" + uid + "/accounts/" + idAccount).get()   
}