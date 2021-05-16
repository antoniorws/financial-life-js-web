/**
 * 
 * @param {String} uid 
 * @param {String} categoryId 
 * @param {String} categoryName
 * 
 * @description Delete category from expense or income. 
 */
function deleteCategory(uid, categoryId, categoryName){
    firestore.doc("users/" + uid + categoryName + categoryId).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} categoryId 
 * @param {String} name 
 * @description Update category from expense or income.
 */
 function updateCategory(uid, categoryId, name, categoria){
    firestore.doc("users/" + uid + categoria + categoryId).set({"name": name})
}

//------Expense Category------------

/**
 * 
 * @param {String} uid 
 * @param {String} name 
 * @returns A promise with category expense create.
 */
function createExpenseCategory(uid, name){
    return firestore.collection("users/" + uid + "/expense_category").add({"nome": name})
}

/**
 * 
 * @param {String} uid 
 * @returns Promise with all of the categories expenses. 
 */
function getCategoriesExpense(uid){
    return firestore.collection("users/" + uid + "/expense_category").get()
}

//------Income Category-----------

/**
 * 
 * @param {String} uid 
 * @param {String} name 
 * @returns A promise with category income create.
 */
function createIncomeCategory(uid, name){
    return firestore.collection("users/" + uid + "/income_category").add({"name": name})
}

/**
 * 
 * @param {String} uid 
 * @returns Promise with all of the categories incomes. 
 */
function getIncomesExpense(uid){
    return firestore.collection("users/" + uid + "/income_category").get()
}