/**
 * 
 * @param {String} uid 
 * @param {JSON} conta 
 * @returns Uma promise com a criação da conta
 */
function criarConta(uid, conta){
    return firestore.collection("users/" + uid + "/contas").add(conta)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} idConta 
 * @description exclui uma conta
 */
function excluirConta(uid, idConta){
    firestore.doc("users/" + uid + "/contas/" + idConta).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} conta 
 * @description Atualiza uma conta
 */
function atualizaConta(uid, idConta, conta){
    firestore.doc("users/" + uid + "/contas/" + idConta).set(conta)
}

/**
 * 
 * @param {String} uid 
 * @returns Todas as contas do usuário
 */
function getContas(uid){
    return firestore.collection("users/" + uid + "/contas").get()   
}