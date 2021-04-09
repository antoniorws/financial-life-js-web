const btnCadastrarReceita = document.querySelector("#cadastrarReceita")
const btnCadastrarDespesa = document.querySelector('#cadastrarDespesa')
const textReceita = document.querySelector("#novaCategoriaReceita")
const textDespesa = document.querySelector("#novaCategoriaDespesa")
const tableDespesas = document.querySelector("#table-despesas")
const tableReceitas = document.querySelector("#table-receitas")

function verificaUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Usuário logado')
            console.log(carregaCategoriasDespesas())
            carregaCategoriasReceitas()
        } else {
            console.log('Usuário não logado')
        }
    });
}

function carregaCategoriasDespesas(){
    while(tableDespesas.childNodes.length > 2){
        tableDespesas.removeChild(tableDespesas.lastChild);
    }
    const uid = firebase.auth().currentUser.uid
    firestore.collection("users/" + uid + "/categoria_despesa")
    .get()
    .then((tiposDeDespesas) => {
        tiposDeDespesas.forEach(tipoDespesa => {
            updateTable(tipoDespesa.id, tipoDespesa.data().nome, tableDespesas)
            
        });
    }).catch(error =>{
        console.log(error.message);
    })

}

function carregaCategoriasReceitas(){
    while(tableReceitas.childNodes.length > 2){
        tableReceitas.removeChild(tableReceitas.lastChild);
    }
    const response = getCategoriasDeReceita(firebase.auth().currentUser.uid)
    response.then((tiposDeReceitas) => {
        tiposDeReceitas.forEach(tipoReceita => {
            updateTable(tipoReceita.id, tipoReceita.data().nome, tableReceitas)
            
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

btnCadastrarDespesa.addEventListener("click", () => {
    criarCategoriaDeDespesa(firebase.auth().currentUser.uid, textDespesa.value)
    .then((despesaCategory) => {
        updateTable(despesaCategory.id, textDespesa.value, tableDespesas)

    }).catch(error => {
        alert(error.message)
    })
    textDespesa.innerText = ""
})

btnCadastrarReceita.addEventListener("click", () => {
    criarCategoriaDeReceita(firebase.auth().currentUser.uid, textReceita.value)
    .then((receitaCategory) => {
        updateTable(receitaCategory.id, textReceita.value, tableReceitas)

    }).catch(error => {
        alert(error.message)
    })
    textReceita.innerText = ""
})

function updateTable(idMovimentacao, nomeMovimentacao, table){
    const tr = document.createElement("TR")
    const tdId = document.createElement("TD")
    const tdNome = document.createElement("TD")
    const btnCategoriaExcluir = document.createElement("BUTTON")
    const btnCategoriaAtualizar = document.createElement("BUTTON")
    btnCategoriaExcluir.innerText = "Exluir"
    btnCategoriaAtualizar.innerText = "Alterar"
    tdId.className = idMovimentacao
    tdNome.className = idMovimentacao
    tdId.innerText = idMovimentacao
    tdNome.innerText = nomeMovimentacao 
    tr.appendChild(tdId)
    tr.appendChild(tdNome)
    tr.appendChild(btnCategoriaAtualizar)
    tr.appendChild(btnCategoriaExcluir)
    table.appendChild(tr)

    btnCategoriaAtualizar.addEventListener("click", () => {
        let nomeAlterado = prompt("Digite o novo nome da categoria:", "");
        if (nomeAlterado != null && nomeAlterado != "") {
            tdNome.innerText = nomeAlterado;
            atualizaCategoriaDeDespesa(firebase.auth().currentUser.uid, idMovimentacao, nomeAlterado)
        } 
    })

    btnCategoriaExcluir.addEventListener("click", () => {
        excluirCategoriaDeDespesa(firebase.auth().currentUser.uid, idMovimentacao)
        tr.remove()
    })
}

verificaUser(); 