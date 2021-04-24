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
    getAllDespesas()
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
            updateTable(despesaJSON)
        });
    }).catch(error =>{
        alert(error.message);
    })
}

/**
 * 
 * @param {JSON} despesa 
 * @description Carrega a table
 */
 function updateTable(despesa){
    const tr = document.createElement("TR")
    const tdId = document.createElement("TD")
    const tdNome = document.createElement("TD")
    const tdData = document.createElement("TD")
    const tdCategoria = document.createElement("TD")
    const tdConta = document.createElement("TD")
    const tdValor = document.createElement("TD")
    const tdEfetivada = document.createElement("TD")
    const btnExcluir = document.createElement("BUTTON")
    const btnAtualizar = document.createElement("BUTTON")
    const btnPagar = document.createElement("BUTTON")
    
    btnExcluir.innerText = "Exluir"
    btnExcluir.classList.add("btn-table")
    btnAtualizar.innerText = "Alterar"
    btnAtualizar.classList.add("btn-table")
    btnPagar.classList.add("btn-table")
    btnPagar.innerText = "Pagar"

    tdId.className = despesa.id
    tdNome.className = despesa.id
    tdId.innerText = despesa.id
    tdNome.innerText = despesa.nome 
    tdData.innerText = despesa.data
    tdCategoria.innerText = despesa.categoria
    tdConta.innerText = despesa.conta
    tdValor.innerText = despesa.valor
    tdEfetivada.innerText = despesa.efetivada

    tr.appendChild(tdId)
    tr.appendChild(tdNome)
    tr.appendChild(tdData)
    tr.appendChild(tdCategoria)
    tr.appendChild(tdConta)
    tr.appendChild(tdValor)
    tr.appendChild(tdEfetivada)
    tr.appendChild(btnAtualizar)
    tr.appendChild(btnExcluir)
    tr.appendChild(btnPagar)

    tableDespesas.appendChild(tr)
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
        if(efetivadaNovaDespesa.value === 'S'){
            getConta(firebase.auth().currentUser.uid, despesaJSON.conta.id)
            .then(conta =>{
                const novoSaldo = conta.data().saldo - despesaJSON.valor
                atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
            }).catch(error =>{
                console.log(error.message)
            })
        }
        limparCadastro()
        despesaJSON.conta = despesaJSON.conta.nome
        updateTable(despesaJSON)
    }).catch(error => {
        alert(error.message)
    })
    
})

function limparCadastro(){
    nomeNovaDespesa.value = ""
    dateNovaDespesa.innerText = ""
    categoriaNovaDespesa.value = ""
    contaNovaDespesa.value = ""
    valorNovaDespesa.value = ""
    efetivadaNovaDespesa.value = "N"
}

//MAIN

verificaUser()