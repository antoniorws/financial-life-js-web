/**
 * 
 * @param {String} categoryId 
 * @param {String} categoryName
 * 
 * @description Delete category from expense or income. 
 */
function deleteCategory(categoryId, categoryName){
    firestore.doc("users/" + firebase.auth().currentUser.uid + categoryName + categoryId).delete()
}

/**
 * 
 * @param {String} categoryId 
 * @param {String} name 
 * @description Update category from expense or income.
 */
 function updateCategory(categoryId, name, categoria){
    firestore.doc("users/" + firebase.auth().currentUser.uid + categoria + categoryId).set({"name": name})
}

//------Expense Category------------

/**
 * 
 * @param {String} name 
 * @returns A promise with category expense create.
 */
function createExpenseCategory(name){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/expense_category").add({"name": name})
}

/**
 * 
 * @returns Promise with all of the categories expenses. 
 */
function getCategoriesExpense(){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/expense_category").get()
}

//------Income Category-----------

/**
 * 
 * @returns Promise with all of the categories incomes. 
 */
function getIncomeCategories(){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/income_category").get()
}

/**
 * 
 * @param {String} name 
 * @returns A promise with income category created.
 */
 function createIncomeCategory(name){
    return firestore.collection("users/" + firebase.auth().currentUser.uid + "/income_category").add({"name": name})
}