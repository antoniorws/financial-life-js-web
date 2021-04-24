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
 * @param {String} idConta
 * @param {JSON} conta 
 * @description Atualiza uma conta
 */
function atualizaConta(uid, idConta, conta){
    firestore.doc("users/" + uid + "/contas/" + idConta).set(conta)
}

/**
 * 
 * @param {String} uid 
 * @param {String} idConta
 * @param {float} saldo 
 * @description Atualiza uma conta
 */
 function atualizaSaldoConta(uid, idConta, saldo){
    firestore.doc("users/" + uid + "/contas/" + idConta)
    .update({
        "saldo": saldo
    }).then(() =>{
        console.log("Conta atualizada com sucesso!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 * 
 * @param {String} uid 
 * @returns Todas as contas do usuário
 */
function getContas(uid){
    return firestore.collection("users/" + uid + "/contas").get()   
}

/**
 * 
 * @param {String} uid 
 * @returns Uma conta
 */
 function getConta(uid, idConta){
    return firestore.doc("users/" + uid + "/contas/" + idConta).get()   
}