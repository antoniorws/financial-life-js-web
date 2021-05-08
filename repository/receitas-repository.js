/**
 * 
 * @param {String} uid  
 * @param {JSON} receita 
 * @returns Uma promise com a criação da receita
 */
 function criarReceita(uid, receita){
    return firestore.collection("users/" + uid + "/receitas").add(receita)
}

/**
 * 
 * @param {String} uid 
 * @param {JSON} idReceita
 * @description exclui uma receita
 */
function excluirReceita(uid, idReceita){
    firestore.doc("users/" + uid + "/receitas/" + idReceita).delete()
}

/**
 * 
 * @param {String} uid 
 * @param {String} idReceita
 * @param {JSON} receita 
 * @description Atualiza uma receita
 */
function atualizaReceita(uid, idReceita, receita){
    firestore.doc("users/" + uid + "/receitas/" + idReceita).set(receita)
}

/**
 * 
 * @param {String} uid 
 * @param {String} idReceita
 * @param {string} recebida 
 * @description Atualiza uma conta
 */
function receberDevolverReceita(uid, idReceita, recebida){
    firestore.doc("users/" + uid + "/receitas/" + idReceita)
    .update({
        "recebida": recebida
    }).then(() =>{
        console.log("Receita atualizada com sucesso!")
    }).catch(error =>{
        console.log(error.mesage)
    })
}

/**
 * 
 * @param {String} uid 
 * @param {String} anoMesStart 
 * @param {String} anoMesEnd 
 * @param {String} categoria 
 * @param {String} conta 
 * @returns receitas do usuário
 */
function getReceitasMes(uid, anoMesStart, anoMesEnd, categoria, conta){
    let research = firestore.collection("users/" + uid + "/receitas")
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
 * @param {string} uid 
 * @param {string} idReceita 
 */
function getReceita(uid, idReceita){
    return firestore.doc("users/" + uid + "/receitas/" + idReceita).get()
}