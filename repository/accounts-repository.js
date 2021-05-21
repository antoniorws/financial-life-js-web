/**
 * 
 * @param {JSON} account 
 * @returns A promisse with account created
 */
function createAccount(account){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/accounts").add(account)
}

/**
 * 
 * @param {JSON} idAccount 
 * @description delete account
 */
function deleteAccount(idAccount){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/accounts/" + idAccount).delete()
}

/**
 * 
 * @param {String} idAccount
 * @param {JSON} account 
 * @description Update account
 */
function updateAccount(idAccount, account){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/accounts/" + idAccount).set(account)
}

/**
 * 
 * @param {String} idAccount
 * @param {float} balance 
 * @description Update balance
 */
 function updateBalanceAccount(idAccount, balance){
    firestore.doc("users/" + firebase.auth().currentUser.uid + "/accounts/" + idAccount)
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
 * @returns All of the accounts from user
 */
function getAccounts(){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/accounts").get()   
}

/**
 * @param idAccount
 * @returns One account
 */
 function getAccount(idAccount){
    return firestore.doc("users/" + firebase.auth().currentUser.uid + "/accounts/" + idAccount).get()   
}