/**
 * 
 * @param {String} uid  
 * @param {JSON} despesa 
 * @returns Uma promise com a criação da despesa
 */
 function criarDespesa(uid, despesa){
    return firestore.collection("users/" + uid + "/despesas").add(despesa)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} idDespesa
 * @description exclui uma despesa
 */
function excluirDespesa(uid, idDespesa){
    firestore.doc("users/" + uid + "/despesas/" + idDespesa).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} idDespesa
 * @param {JSON} despesa 
 * @description Atualiza uma despesa
 */
function atualizaDespesa(uid, idDespesa, despesa){
    firestore.doc("users/" + uid + "/despesas/" + idDespesa).set(despesa)
}

/**
 * 
 * @param {String} uid 
 * @returns Todas as despesas do usuário
 */
function getDespesasMes(uid, anoMesStart, anoMesEnd){
    return firestore.collection("users/" + uid + "/despesas").where("data", ">=", anoMesStart + "-01").where("data", "<", anoMesEnd + "-01").get()   
}