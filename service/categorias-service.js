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
            const tr = document.createElement("TR")
            const tdId = document.createElement("TD")
            const tdNome = document.createElement("TD")
            const btnCategoriaExcluir = document.createElement("BUTTON")
            const btnCategoriaAtualizar = document.createElement("BUTTON")
            btnCategoriaExcluir.innerText = "Exluir"
            btnCategoriaAtualizar.innerText = "Alterar"
            tdId.className = tipoDespesa.id
            tdNome.className = tipoDespesa.id
            tdId.innerText = tipoDespesa.id
            tdNome.innerText = tipoDespesa.data().nome 
            tr.appendChild(tdId)
            tr.appendChild(tdNome)
            tr.appendChild(btnCategoriaAtualizar)
            tr.appendChild(btnCategoriaExcluir)
            tableDespesas.appendChild(tr)

            btnCategoriaAtualizar.addEventListener("click", () =>{
                //TODO atualizar categoria
            })

            btnCategoriaExcluir.addEventListener("click", () => {
                //TODO excluir categoria
            })
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
            const tr = document.createElement("TR")
            const tdId = document.createElement("TD")
            const tdNome = document.createElement("TD")
            tdId.className = tipoReceita.id
            tdNome.className = tipoReceita.id
            tdId.innerText = tipoReceita.id
            tdNome.innerText = tipoReceita.data().nome 
            tr.appendChild(tdId)
            tr.appendChild(tdNome)
            tableReceitas.appendChild(tr)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

btnCadastrarDespesa.addEventListener("click", () => {
    criarCategoriaDeDespesa(firebase.auth().currentUser.uid, textDespesa.value)
    carregaCategoriasDespesas()
    textDespesa.innerText = ""
})

btnCadastrarReceita.addEventListener("click", () => {
    criarCategoriaDeReceita(firebase.auth().currentUser.uid, textReceita.value)
    carregaCategoriasReceitas()
    textReceita.innerText = ""
})


verificaUser(); 