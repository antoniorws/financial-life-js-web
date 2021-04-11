const btnCadastrarReceita = document.querySelector("#cadastrarReceita")
const btnCadastrarDespesa = document.querySelector('#cadastrarDespesa')
const textReceita = document.querySelector("#novaCategoriaReceita")
const textDespesa = document.querySelector("#novaCategoriaDespesa")
const tableDespesas = document.querySelector("#table-despesas")
const tableReceitas = document.querySelector("#table-receitas")

/**
 * @description Verifica se existe usuário.
 */
function verificaUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            carregaCategoriasReceitas()
            carregaCategoriasDespesas()
        } else {
            console.log('Usuário não logado')
        }
    });
}

function carregaCategoriasDespesas(){
    while(tableDespesas.childNodes.length > 2){
        tableDespesas.removeChild(tableDespesas.lastChild);
    }
    const response = getCategoriasDeDespesa(firebase.auth().currentUser.uid)
    response.then((tiposDeDespesas) => {
        tiposDeDespesas.forEach(tipoDespesa => {
            updateTable(tipoDespesa.id, tipoDespesa.data().nome, tableDespesas, "/categoria_despesa/")
            
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
            updateTable(tipoReceita.id, tipoReceita.data().nome, tableReceitas, "/categoria_receita/")
            
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

btnCadastrarDespesa.addEventListener("click", () => {
    criarCategoriaDeDespesa(firebase.auth().currentUser.uid, textDespesa.value)
    .then((despesaCategory) => {
        updateTable(despesaCategory.id, textDespesa.value, tableDespesas, "/categoria_despesa/")

    }).catch(error => {
        alert(error.message)
    })
    textDespesa.innerText = ""
})

btnCadastrarReceita.addEventListener("click", () => {
    criarCategoriaDeReceita(firebase.auth().currentUser.uid, textReceita.value)
    .then((receitaCategory) => {
        updateTable(receitaCategory.id, textReceita.value, tableReceitas, "/categoria_receita/")

    }).catch(error => {
        alert(error.message)
    })
    textReceita.innerText = ""
})

function updateTable(idMovimentacao, nomeMovimentacao, table, categoria){
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
            atualizaCategoria(firebase.auth().currentUser.uid, idMovimentacao, nomeAlterado, categoria)
        } 
    })

    btnCategoriaExcluir.addEventListener("click", () => {
        excluirCategoria(firebase.auth().currentUser.uid, idMovimentacao, categoria)
        tr.remove()
    })
}

verificaUser(); 