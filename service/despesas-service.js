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
    const dataHoje = new Date();
    const dia = dataHoje.getDate().toString.length === 2 ? dataHoje.getDate() : "0" + dataHoje.getDate()
    const mes = (dataHoje.getMonth() + 1).toString.length === 2 ? (dataHoje.getMonth() + 1) : "0" + (dataHoje.getMonth() + 1)
    const ano = dataHoje.getFullYear()
    document.querySelector("#nav-despesas").classList.add("principal")
    preencheComboCategorias()
    preencheComboContas()
    preencheDataAtual(dia, mes, ano)
    getAllDespesasMes(mes, ano, "", "")
}

/**
 * 
 * @param {string} dia 
 * @param {string} mes 
 * @param {string} ano 
 * @description preenche data atual 
 */
function preencheDataAtual(dia, mes, ano){
    dateNovaDespesa.value = ano + "-" + mes + "-" + dia
    dateFiltro.value = ano + "-" + mes
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
 function getAllDespesasMes(mes, ano, categoria, conta){
    while(tableDespesas.childNodes.length > 2){
        tableDespesas.removeChild(tableDespesas.lastChild);
    }
    const dataStart = ano + "-" + mes
    const mesEnd = parseInt(mes) === 12 ? "01" : "0" + (parseInt(mes) + 1)
    const dataEnd = ano + "-" + mesEnd
    const response = getDespesasMes(firebase.auth().currentUser.uid, dataStart, dataEnd, categoria, conta)
    response.then((despesas) => {
        despesas.forEach(despesa => {
            const despesaJSON = despesa.data()
            despesaJSON.id = despesa.id
            updateTable(despesaJSON)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * @description Filtro por mês de acordo com o dateFiltro
 */
dateFiltro.addEventListener("change", () => {
    filtroPesquisa()
})

/**
 * @description Filtro por categoria
 */
categoriaFiltro.addEventListener("change", () => {
    filtroPesquisa()
})

/**
 * @description Filtro por conta
 */
contaFiltro.addEventListener("change", () => {
    filtroPesquisa()
})

/**
 * @description Filtrar
 */
function filtroPesquisa(){
    const dateFiltroSplit = dateFiltro.value.split("-")
    getAllDespesasMes(dateFiltroSplit[1], dateFiltroSplit[0], categoriaFiltro.value, contaFiltro.value)
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
    if(despesa.conta.moeda === "BRL"){
        simboloMoeda = "R$ "
    }else if(despesa.conta.moeda === "EUR"){
        simboloMoeda = "€ "
    }else if(despesa.conta.moeda === "USD"){
        simboloMoeda = "$ "
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
        btnPagar(tdEfetivada, despesa)
    }else{
        btnEfetivada(tdEfetivada, despesa)
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
        contaNovaDespesa.value = despesa.conta.id + "--" + despesa.conta.moeda
        valorNovaDespesa.value = despesa.valor
        efetivadaNovaDespesa.value = despesa.efetivada
        nomeNovaDespesa.focus()

        const btnAtualizarDespesas = document.createElement("BUTTON")
        btnAtualizarDespesas.innerText = "Atualizar"
        divNovosDados.appendChild(btnAtualizarDespesas)
        
        btnAtualizarDespesas.addEventListener("click", () => {
            despesa = getDespesaJson(despesa.id)
            if(despesa.conta.nome == tdConta.innerText &&
                despesa.efetivada === "N"){
                atualizaDespesa(firebase.auth().currentUser.uid, despesa.id, despesa)
                tdNome.innerText = despesa.nome 
                tdData.innerText = despesa.data
                tdCategoria.innerText = despesa.categoria
                tdConta.innerText = despesa.conta.nome
                
                let simboloMoeda = ""

                if(despesa.conta.moeda === "BRL"){
                    simboloMoeda = "R$ "
                }else if(despesa.conta.moeda === "EUR"){
                    simboloMoeda = "€ "
                }else if(despesa.conta.moeda === "USD"){
                    simboloMoeda = "$ "
                }        
                tdValor.innerText = simboloMoeda + despesa.valor
                
                cancelar(btnAtualizarDespesas)
            }else{
                alert("Não possível alterar a conta de uma despesa já paga.\n Devolva a despesa para alterar a conta!")
            }
        })

        btnCancelar.addEventListener("click", () => {
            cancelar(btnAtualizarDespesas)
        })
    })

    btnExcluir.addEventListener("click", () => {
        if(despesa.efetivada === "S"){
            creditarDespesa(despesa)
        }
        excluirDespesa(firebase.auth().currentUser.uid, despesa.id)
        tr.remove()
    })

}

/**
 * @description Pagar despesa
 * @param {String} tdEfetivada 
 * @param {JSON} despesa 
 */
function btnPagar(tdEfetivada, despesa){
    const btnPagar = document.createElement("BUTTON")
    btnPagar.classList.add("btn-table")
    btnPagar.classList.add("btn-pagar")
    btnPagar.innerText = "Pagar"
    for (child of tdEfetivada.children){
        child.remove();
    }
    tdEfetivada.appendChild(btnPagar)
    btnPagar.addEventListener("click", () => {
        despesa.efetivada = "S"
        debitarDespesa(despesa)
        atualizaDespesa(firebase.auth().currentUser.uid, despesa.id, despesa)
        btnEfetivada(tdEfetivada, despesa)
    })
}

/**
 * @description Reembolsar despesa paga
 * @param {String} tdEfetivada 
 * @param {Json} despesa 
 */
function btnEfetivada(tdEfetivada, despesa){
    const btnEfetivada = document.createElement("BUTTON")
    btnEfetivada.classList.add("btn-table")
    btnEfetivada.innerText = "Efetivada"
    for (child of tdEfetivada.children){
        child.remove();
    }
    tdEfetivada.appendChild(btnEfetivada)
    btnEfetivada.addEventListener("click", () => {
        despesa.efetivada = "N"
        creditarDespesa(despesa)
        atualizaDespesa(firebase.auth().currentUser.uid, despesa.id, despesa)
        btnPagar(tdEfetivada, despesa)
    })
}

/**
 * 
 * @param {String} id 
 * @returns Json de Despesa
 */
function getDespesaJson(id){
    const contaValue = contaNovaDespesa.value.split("--")
    const despesaJson = {"nome": nomeNovaDespesa.value,
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

    if(id !== undefined){
        despesaJson.id = id
        return despesaJson
    }
    return despesaJson
        
 }

/**
 * @description Click do botão para cadastrar despesa
 */
btnCadastrar.addEventListener("click", () => {
    cadastrarDespesa()
})

/**
 * @description Cadastrar despesa
 */
function cadastrarDespesa(){
    const despesaJSON = getDespesaJson()
    criarDespesa(firebase.auth().currentUser.uid, despesaJSON)
    .then((despesa) => {
        despesaJSON.id = despesa.id
        if(efetivadaNovaDespesa.value === "S"){
            debitarDespesa(despesaJSON)
        }
        limparCadastro()
        if(dateNovaDespesa.value.includes(dateFiltro.value)){
            updateTable(despesaJSON)
        }
    }).catch(error => {
        console.log(error.message)
    })
}

/**
 * @description Debita o valor da despesa do total da conta
 * @param {Json} despesaJSON 
 */
function debitarDespesa(despesaJSON){
    getConta(firebase.auth().currentUser.uid, despesaJSON.conta.id)
    .then(conta => {
        const novoSaldo = conta.data().saldo - despesaJSON.valor
        atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Credita o valor da despesa do total da conta
 * @param {Json} despesaJSON 
 */
 function creditarDespesa(despesaJSON){
    getConta(firebase.auth().currentUser.uid, despesaJSON.conta.id)
    .then(conta => {
        const novoSaldo = parseFloat(conta.data().saldo) + parseFloat(despesaJSON.valor)
        atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
    }).catch(error =>{
        console.log(error.message)
    })
}

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

/**
 * @description Cancela operação
 * @param {BUTTON} btnAtualizarDespesas 
 */
function cancelar(btnAtualizarDespesas){
    efetivadaNovaDespesa.classList.remove("hidden-class")
    const tableButtons = document.querySelectorAll("table button")
    btnCadastrar.classList.remove("hidden-class")
    btnAtualizarDespesas.remove()
    btnCancelar.classList.add("hidden-class")
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
    limparCadastro()
}

//MAIN

verificaUser()