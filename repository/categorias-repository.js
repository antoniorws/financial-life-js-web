//----Métodos em comum----------

/**
 * 
 * @param {String} uid 
 * @param {String} uiCategoria 
 * @param {String} categoria
 * 
 * @description exclui a categoria de despesa ou de receita 
 *  de acordo com os parâmetros passados. 
 */
function excluirCategoria(uid, uiCategoria, categoria){
    firestore.doc("users/" + uid + categoria + uiCategoria).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} uiCategoria 
 * @param {String} nome 
 * @description Atualiza a categoria de despesa ou de receita de acordo 
 * com os parâmetros passados.
 */
 function atualizaCategoria(uid, uiCategoria, nome, categoria){
    firestore.doc("users/" + uid + categoria + uiCategoria).set({"nome": nome})
}

//------Categoria de despesa------------

/**
 * 
 * @param {String} uid 
 * @param {String} nome 
 * @returns Uma promise com a criação da categoria de despesa
 */
function criarCategoriaDeDespesa(uid, nome){
    return firestore.collection("users/" + uid + "/categoria_despesa").add({"nome": nome})
}

/**
 * 
 * @param {String} uid 
 * @returns Promise com a lista de todas as categorias de despesa.
 */
function getCategoriasDeDespesa(uid){
    return firestore.collection("users/" + uid + "/categoria_despesa").get()
}

//------Categoria de Receita-----------

/**
 * 
 * @param {String} uid 
 * @param {String} nome 
 * @returns Uma promise com a criação da categoria de receita
 */
function criarCategoriaDeReceita(uid, nome){
    return firestore.collection("users/" + uid + "/categoria_receita")
    .add({
        "nome": nome
    })
}

/**
 * 
 * @param {String} uid 
 * @returns Promise with all of incomes categories list.
 */
function getIncomeCategories(uid){
    return firestore.collection("users/" + uid + "/income_category").get()
}