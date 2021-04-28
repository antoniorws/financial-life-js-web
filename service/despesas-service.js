const btnCadastrar = document.querySelector("#cadastrarDespesa")
const btnCancelar = document.querySelector("#cancelaAtualizacao")
const tableDespesas = document.querySelector("#tableDespesas")
//Nova despesa
const divNovosDados = document.querySelector("#div-novos-dados")
const nomeNovaDespesa = document.querySelector("#nomeNovaDespesa")
const dateNovaDespesa = document.querySelector("#dateNovaDespesa")
const categoriaNovaDespesa = document.querySelector("#categoriaNovaDespesa")
const contaNovaDespesa = document.querySelector("#contaNovaDespesa")
const valorNovaDespesa = document.querySelector("#valorNovaDespesa")
const efetivadaNovaDespesa = document.querySelector("#efetivadaNovaDespesa")
//filtro
const categoriaFiltro = document.querySelector("#categoriaFiltro")
const contaFiltro = document.querySelector("#contaFiltro")
const dateFiltro = document.querySelector("#dateDespesaFiltro")

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

/**
 * @description Inicia os metódos para a página
 */
function init(){
    document.querySelector("#nav-despesas").classList.add("principal")
    preencheComboCategorias()
    preencheComboContas()
    preencheDataAtual()
    getAllDespesas()
}

function preencheDataAtual(){
    const dataHoje = new Date();
    dateNovaDespesa.value = dataHoje.getFullYear() + "-0" + (dataHoje.getMonth() + 1) + "-" + dataHoje.getDate()
    dateFiltro.value = dataHoje.getFullYear() + "-0" + (dataHoje.getMonth() + 1)
}

/**
 * @description Preenche os combos de categorias
 */
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

/**
 * @description Preeche os combos de contas
 */
function preencheComboContas(){
    const response = getContas(firebase.auth().currentUser.uid)
    response.then(contas => {
        contas.forEach(conta => {
            const option = document.createElement("option")
            option.value = conta.id + "--"+conta.data().moeda
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
            const despesaJSON = despesa.data()
            despesaJSON.id = despesa.id
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
    const tdNome = document.createElement("TD")
    const tdData = document.createElement("TD")
    const tdCategoria = document.createElement("TD")
    const tdConta = document.createElement("TD")
    const tdValor = document.createElement("TD")
    const tdEfetivada = document.createElement("TD")
    const btnExcluir = document.createElement("BUTTON")
    const btnAtualizar = document.createElement("BUTTON")
    
    btnExcluir.innerText = "Exluir"
    btnExcluir.classList.add("btn-table")
    btnAtualizar.innerText = "Alterar"
    btnAtualizar.classList.add("btn-table")

    tdNome.innerText = despesa.nome 
    tdData.innerText = despesa.data
    tdCategoria.innerText = despesa.categoria
    tdConta.innerText = typeof despesa.conta === "string" ? despesa.conta : despesa.conta.nome
    let simboloMoeda = ""
    if(despesa.conta.moeda != undefined && despesa.conta.moeda != null){
        if(despesa.conta.moeda === "BRL"){
            simboloMoeda = "R$ "
        }else if(despesa.conta.moeda === "EUR"){
            simboloMoeda = "€ "
        }else if(despesa.conta.moeda === "USD"){
            simboloMoeda = "$ "
        }
    }

    tdValor.innerText = simboloMoeda + despesa.valor
    tr.appendChild(tdNome)
    tr.appendChild(tdData)
    tr.appendChild(tdCategoria)
    tr.appendChild(tdConta)
    tr.appendChild(tdValor)
    tr.appendChild(tdEfetivada)
    tr.appendChild(btnAtualizar)
    tr.appendChild(btnExcluir)
    
    if(despesa.efetivada === "N"){
        const btnPagar = document.createElement("BUTTON")
        btnPagar.classList.add("btn-table")
        btnPagar.innerText = "Pagar"
        tdEfetivada.appendChild(btnPagar)
    }else{
        tdEfetivada.innerText = "Efetivada"
    }

    tableDespesas.appendChild(tr)

    btnAtualizar.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }
        efetivadaNovaDespesa.classList.add("hidden-class")
        btnCadastrar.classList.add("hidden-class")
        btnCancelar.classList.remove("hidden-class")
        nomeNovaDespesa.value = despesa.nome
        dateNovaDespesa.value = despesa.data
        categoriaNovaDespesa.value = despesa.categoria
        contaNovaDespesa.value = despesa.conta.id
        valorNovaDespesa.value = despesa.valor
        efetivadaNovaDespesa.value = despesa.efetivada
        nomeNovaDespesa.focus()

        const btnAtualizarContas = document.createElement("BUTTON")
        btnAtualizarContas.innerText = "Atualizar"
        divNovosDados.appendChild(btnAtualizarContas)
        btnAtualizarContas.addEventListener("click", () => {
             
            const despesaJSON = getDespesaJson()
            atualizaDespesa(firebase.auth().currentUser.uid, despesa.id, despesaJSON)
            //TODO validar despesa efetivada
            //TODO realizar set na tabela html
            cancelar(btnAtualizarContas)
            
        })

        btnCancelar.addEventListener("click", () => {
            cancelar(btnAtualizarContas)
        })
    })

 }

function getDespesaJson(){
    const contaValue = contaNovaDespesa.value.split("--")
    return {
        "nome": nomeNovaDespesa.value,
        "data": dateNovaDespesa.value,
        "categoria": categoriaNovaDespesa.value,
        "conta": {
            "id": contaValue[0],
            "nome": contaNovaDespesa.selectedOptions[0].innerText,
            "moeda": contaValue[1]
        },
        "valor": valorNovaDespesa.value,
        "efetivada": efetivadaNovaDespesa.value
    }
 }

 /**
  * @description Click do botão para cadastrar despesa
  */
btnCadastrar.addEventListener("click", () => {
    const despesaJSON = getDespesaJson()
    criarDespesa(firebase.auth().currentUser.uid, despesaJSON)
    .then((despesa) => {
        despesaJSON.id = despesa.id
        if(efetivadaNovaDespesa.value === "S"){
            getConta(firebase.auth().currentUser.uid, despesaJSON.conta.id)
            .then(conta => {
                const novoSaldo = conta.data().saldo - despesaJSON.valor
                atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
            }).catch(error =>{
                console.log(error.message)
            })
        }
        limparCadastro()
        updateTable(despesaJSON)
    }).catch(error => {
        alert(error.message)
    })
    
})

/**
 * @description limpa os valores da parte de cadastro
 */
function limparCadastro(){
    nomeNovaDespesa.value = ""
    dateNovaDespesa.innerText = ""
    categoriaNovaDespesa.value = ""
    contaNovaDespesa.value = ""
    valorNovaDespesa.value = ""
    efetivadaNovaDespesa.value = "N"
    
}

function cancelar(btnAtualizarContas){
    efetivadaNovaDespesa.classList.remove("hidden-class")
    const tableButtons = document.querySelectorAll("table button")
    btnCadastrar.classList.remove("hidden-class")
    btnAtualizarContas.remove()
    btnCancelar.classList.add("hidden-class")
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
    limparCadastro()
}

//MAIN

verificaUser()