const btnCadastrar = document.querySelector("#cadastrarDespesa")
const tableDespesas = document.querySelector("#tableDespesas")
//Nova despesa
const nomeNovaDespesa = document.querySelector("#nomeNovaDespesa")
const dateNovaDespesa = document.querySelector("#dateNovaDespesa")
const categoriaNovaDespesa = document.querySelector("#categoriaNovaDespesa")
const contaNovaDespesa = document.querySelector("#contaNovaDespesa")
const valorNovaDespesa = document.querySelector("#valorNovaDespesa")
const efetivadaNovaDespesa = document.querySelector("#efetivadaNovaDespesa")
//filtro
const categoriaFiltro = document.querySelector("#categoriaFiltro")
const contaFiltro = document.querySelector("#contaFiltro")

/**
 * @description Verifica se existe usuário.
 */
 function verificaUser(){
    firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
            init()
        } else {
            console.log('Usuário não logado')
        }
    });
}

function init(){
    document.querySelector("#nav-despesas").classList.add("principal")
    preencheComboCategorias()
    preencheComboContas()
}

function preencheComboCategorias(){
    const response = getCategoriasDeDespesa(firebase.auth().currentUser.uid)
    response.then(tiposDeDespesas => {
        tiposDeDespesas.forEach(tipoDespesa => {
            const option = document.createElement("option")
            option.value = tipoDespesa.data().nome
            option.innerText = tipoDespesa.data().nome
            categoriaNovaDespesa.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = tipoDespesa.data().nome
            categoriaFiltro.appendChild(optionFiltro)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

function preencheComboContas(){
    const response = getContas(firebase.auth().currentUser.uid)
    response.then(contas => {
        contas.forEach(conta => {
            const option = document.createElement("option")
            option.value = conta.id
            option.innerText = conta.data().nome
            contaNovaDespesa.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = conta.data().nome
            contaFiltro.appendChild(optionFiltro)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Carrega todas as despesas do usuário na table de despesas
 */
 function getAllDespesas(){
    while(tableDespesas.childNodes.length > 2){
        tableDespesas.removeChild(tableDespesas.lastChild);
    }
    const response = getDespesas(firebase.auth().currentUser.uid)
    response.then((despesas) => {
        despesas.forEach(despesa => {
            const despesaJSON = {
                "id": despesa.id,
                "nome": despesa.data().nome,
                "data": despesa.data().data,
                "categoria": despesa.data().categoria,
                "conta": despesa.data().conta.nome,
                "valor": despesa.data().valor,
                "efetivada": despesa.data().efetivada === "S" ? "Sim" : "Não"
            }
            //TODO
            //updateTable(despesaJSON)
        });
    }).catch(error =>{
        alert(error.message);
    })
}

btnCadastrar.addEventListener("click", () => {
    const despesaJSON = {
        "nome": nomeNovaDespesa.value,
        "data": dateNovaDespesa.value,
        "categoria": categoriaNovaDespesa.value,
        "conta": {
            "id": contaNovaDespesa.value,
            "nome": contaNovaDespesa.selectedOptions[0].innerText
        },
        "valor": valorNovaDespesa.value,
        "efetivada": efetivadaNovaDespesa.value
    }
    criarDespesa(firebase.auth().currentUser.uid, despesaJSON)
    .then((despesa) => {
        despesaJSON.id = despesa.id
        //updateTable(contaJSON)
    }).catch(error => {
        alert(error.message)
    })
    nomeNovaDespesa.value = ""
    dateNovaDespesa.innerText = ""
    categoriaNovaDespesa.value = ""
    contaNovaDespesa.value = ""
    valorNovaDespesa.value = ""
    efetivadaNovaDespesa.value = "N"
})

//MAIN

verificaUser()