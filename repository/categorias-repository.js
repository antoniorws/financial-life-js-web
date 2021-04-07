function criarCategoriaDeDespesa(uid, nome){
    firestore.collection("users/" + uid + "/categoria_despesa")
    .add({
        nome: nome
    }).then(()=>{
        console.log("Despesa salva com sucesso!");
    }).catch(error =>{
        console.log(error.message);
    })
}

function criarCategoriaDeReceita(uid, nome){
    firestore.collection("users/" + uid + "/categoria_receita")
    .add({
        nome: nome
    }).then(()=>{
        console.log("Despesa salva com sucesso!");
    }).catch(error =>{
        console.log(error.message);
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