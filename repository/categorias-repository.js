function criarCategoriaDeDespesa(uid, nome){
    return firestore.collection("users/" + uid + "/categoria_despesa")
    .add({
        "nome": nome
    })
}

function excluirCategoriaDeDespesa(uid, uiCategoria){
    firestore.doc("users/" + uid + "/categoria_despesa/" + uiCategoria).delete()
}

function excluirCategoriaDeReceita(uid, uiCategoria){
    firestore.doc("users/" + uid + "/categoria_receita/" + uiCategoria).delete()
}

function atualizaCategoriaDeDespesa(uid, uiCategoria, nome){
    firestore.doc("users/" + uid + "/categoria_despesa/" + uiCategoria)
    .set({"nome": nome})
}

function atualizaCategoriaDeReceita(uid, uiCategoria, nome){
    firestore.doc("users/" + uid + "/categoria_receita/" + uiCategoria)
    .set({"nome": nome})
}

function criarCategoriaDeReceita(uid, nome){
    return firestore.collection("users/" + uid + "/categoria_receita")
    .add({
        "nome": nome
    })
}

function getCategoriasDeReceita(uid){
    return firestore.collection("users/" + uid + "/categoria_receita").get()
    
}

function excluirCategoriasDeDespesas(id, uid){
    firestore.doc("users/" + uid + "/categoria_despesa/" + id)
    .delete()
    .then(()=>{
        console.log("Categoria excluída com sucesso!")
    }).catch(error =>{
        console.log(error.message);
    })
}

function excluirCategoriasDeReceitas(id, uid){
    firestore.doc("users/" + uid + "/categoria_receita/" + id)
    .delete()
    .then(()=>{
        console.log("Categoria excluída com sucesso!")
    }).catch(error =>{
        console.log(error.message);
    })
}