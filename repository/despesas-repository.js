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
 * @param {String} anoMesStart 
 * @param {String} anoMesEnd 
 * @param {String} categoria 
 * @param {String} conta 
 * @returns despesas do usuário
 */
function getDespesasMes(uid, anoMesStart, anoMesEnd, categoria, conta){
    let research = firestore.collection("users/" + uid + "/despesas")
                                .where("data", ">=", anoMesStart + "-01")
                                .where("data", "<", anoMesEnd + "-01") 
    if(categoria != ""){
        research = research.where("categoria", "==", categoria)            
    }
    if(conta != ""){
        research = research.where("conta.nome", "==", conta)            
    }
    return research.get()
}

/**
 * 
 * @param {String} uid 
 * @param {String} idDespesa
 * @param {String} efetivada 
 * @description Atualiza uma conta
 */
 function receberDevolverDespesa(uid, idDespesa, efetivada){
    firestore.doc("users/" + uid + "/despesas/" + idDespesa)
    .update({
        "efetivada": efetivada
    }).then(() =>{
        console.log("Despesa atualizada com sucesso!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 * 
 * @param {string} uid 
 * @param {string} idDespesa 
 */
 function getDespesa(uid, idDespesa){
    return firestore.doc("users/" + uid + "/despesas/" + idDespesa).get()
}