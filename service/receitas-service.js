const btnCadastrar = document.querySelector("#cadastrarReceita")
const btnCancelar = document.querySelector("#cancelaAtualizacao")
const tableReceitas = document.querySelector("#tableReceitas")
//Nova receita
const divNovosDados = document.querySelector("#div-novos-dados")
const nomeNovaReceita = document.querySelector("#nomeNovaReceita")
const dateNovaReceita = document.querySelector("#dateNovaReceita")
const categoriaNovaReceita = document.querySelector("#categoriaNovaReceita")
const contaNovaReceita = document.querySelector("#contaNovaReceita")
const valorNovaReceita = document.querySelector("#valorNovaReceita")
const recebidaNovaReceita = document.querySelector("#recebidaNovaReceita")
//filtro
const categoriaFiltro = document.querySelector("#categoriaFiltro")
const contaFiltro = document.querySelector("#contaFiltro")
const dateFiltro = document.querySelector("#dateReceitaFiltro")

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
    document.querySelector("#nav-receitas").classList.add("principal")
    preencheComboCategorias()
    preencheComboContas()
    preencheDataAtual(dia, mes, ano)
    getAllReceitasMes(mes, ano, "", "")
}

/**
 * 
 * @param {string} dia 
 * @param {string} mes 
 * @param {string} ano 
 * @description Preenche com a data atual
 */
function preencheDataAtual(dia, mes, ano){
    dateNovaReceita.value = ano + "-" + mes + "-" + dia
    dateFiltro.value = ano + "-" + mes
}

/**
 * @description Preenche os combos de categorias
 */
 function preencheComboCategorias(){
    const response = getCategoriasDeReceita(firebase.auth().currentUser.uid)
    response.then(tiposDeReceitas => {
        tiposDeReceitas.forEach(tipoReceita => {
            const option = document.createElement("option")
            option.value = tipoReceita.data().nome
            option.innerText = tipoReceita.data().nome
            categoriaNovaReceita.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = tipoReceita.data().nome
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
            contaNovaReceita.appendChild(option)
            const optionFiltro = document.createElement("option")
            optionFiltro.innerText = conta.data().nome
            contaFiltro.appendChild(optionFiltro)
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
    getAllReceitasMes(dateFiltroSplit[1], dateFiltroSplit[0], categoriaFiltro.value, contaFiltro.value)
}

/**
 * @description Carrega todas as receitas do usuário na table de receitas
 */
 function getAllReceitasMes(mes, ano, categoria, conta){
    while(tableReceitas.childNodes.length > 2){
        tableReceitas.removeChild(tableReceitas.lastChild);
    }
    const dataStart = ano + "-" + mes
    const mesEnd = parseInt(mes) === 12 ? "01" : "0" + (parseInt(mes) + 1)
    const dataEnd = ano + "-" + mesEnd
    const response = getReceitasMes(firebase.auth().currentUser.uid, dataStart, dataEnd, categoria, conta)
    response.then((receitas) => {
        receitas.forEach(receita => {
            const receitaJSON = receita.data()
            receitaJSON.id = receita.id
            updateTable(receitaJSON)
        });
    }).catch(error =>{
        console.log(error.message);
    })
}

/**
 * 
 * @param {JSON} receita 
 * @description Carrega a table
 */
 function updateTable(receita){
    const tr = document.createElement("TR")
    const tdNome = document.createElement("TD")
    const tdData = document.createElement("TD")
    const tdCategoria = document.createElement("TD")
    const tdConta = document.createElement("TD")
    const tdValor = document.createElement("TD")
    const tdRecebida = document.createElement("TD")
    const btnExcluir = document.createElement("BUTTON")
    const btnAtualizar = document.createElement("BUTTON")
    
    btnExcluir.innerText = "Exluir"
    btnExcluir.classList.add("btn-table")
    btnAtualizar.innerText = "Alterar"
    btnAtualizar.classList.add("btn-table")

    tdNome.innerText = receita.nome 
    tdData.innerText = receita.data
    tdCategoria.innerText = receita.categoria
    tdConta.innerText = typeof receita.conta === "string" ? receita.conta : receita.conta.nome
    let simboloMoeda = ""
    if(receita.conta.moeda === "BRL"){
        simboloMoeda = "R$ "
    }else if(receita.conta.moeda === "EUR"){
        simboloMoeda = "€ "
    }else if(receita.conta.moeda === "USD"){
        simboloMoeda = "$ "
    }
    
    tdValor.innerText = simboloMoeda + receita.valor
    tr.appendChild(tdNome)
    tr.appendChild(tdData)
    tr.appendChild(tdCategoria)
    tr.appendChild(tdConta)
    tr.appendChild(tdValor)
    tr.appendChild(tdRecebida)
    tr.appendChild(btnAtualizar)
    tr.appendChild(btnExcluir)
    
    if(receita.recebida === "N"){
        btnReceber(tdRecebida, receita)
    }else{
        btnRecebida(tdRecebida, receita)
    }

    tableReceitas.appendChild(tr)

    btnAtualizar.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }
        recebidaNovaReceita.classList.add("hidden-class")
        btnCadastrar.classList.add("hidden-class")
        btnCancelar.classList.remove("hidden-class")
        nomeNovaReceita.value = receita.nome
        dateNovaReceita.value = receita.data
        categoriaNovaReceita.value = receita.categoria
        contaNovaReceita.value = receita.conta.id + "--" + receita.conta.moeda
        valorNovaReceita.value = receita.valor
        recebidaNovaReceita.value = receita.recebida
        nomeNovaReceita.focus()

        const btnAtualizarReceitas = document.createElement("BUTTON")
        btnAtualizarReceitas.innerText = "Atualizar"
        divNovosDados.appendChild(btnAtualizarReceitas)
        
        btnAtualizarReceitas.addEventListener("click", () => {
            receita = getReceitaJson(receita.id)
            if(receita.conta.nome != tdConta.innerText && 
                receita.recebida === "S"){
                alert("Não possível alterar a conta de uma receita já recebida.\n Devolva a receita para alterar a conta!")
                
            }else{
                atualizaReceita(firebase.auth().currentUser.uid, receita.id, receita)
                tdNome.innerText = receita.nome 
                tdData.innerText = receita.data
                tdCategoria.innerText = receita.categoria
                tdConta.innerText = receita.conta.nome
                
                let simboloMoeda = ""

                if(receita.conta.moeda === "BRL"){
                    simboloMoeda = "R$ "
                }else if(receita.conta.moeda === "EUR"){
                    simboloMoeda = "€ "
                }else if(receita.conta.moeda === "USD"){
                    simboloMoeda = "$ "
                }        
                tdValor.innerText = simboloMoeda + receita.valor
                
                cancelar(btnAtualizarReceitas)
            }
        })

        btnCancelar.addEventListener("click", () => {
            cancelar(btnAtualizarReceitas)
        })
    })

    btnExcluir.addEventListener("click", () => {
        if(receita.recebida === "S"){
            debitarReceita(receita)
        }
        excluirReceita(firebase.auth().currentUser.uid, receita.id)
        tr.remove()
    })

}

/**
 * @description Receber receita
 * @param {String} tdRecebida 
 * @param {JSON} receita 
 */
 function btnReceber(tdRecebida, receita){
    const btnReceber = document.createElement("BUTTON")
    btnReceber.classList.add("btn-table")
    btnReceber.classList.add("btn-pagar")
    btnReceber.innerText = "Receber"
    for (child of tdRecebida.children){
        child.remove();
    }
    
    tdRecebida.appendChild(btnReceber)
    btnReceber.addEventListener("click", () => {
        receita.recebida = "S"
        creditarReceita(receita)
        atualizaReceita(firebase.auth().currentUser.uid, receita.id, receita)
        btnRecebida(tdRecebida, receita)
    })
}

/**
 * @description Devolver receita
 * @param {String} tdRecebida 
 * @param {Json} receita 
 */
 function btnRecebida(tdRecebida, receita){
    const btnRecebida = document.createElement("BUTTON")
    btnRecebida.classList.add("btn-table")
    btnRecebida.innerText = "Recebida"
    for (child of tdRecebida.children){
        child.remove();
    }
    
    tdRecebida.appendChild(btnRecebida)
    btnRecebida.addEventListener("click", () => {
        receita.recebida = "N"
        debitarReceita(receita)
        atualizaReceita(firebase.auth().currentUser.uid, receita.id, receita)
        btnReceber(tdRecebida, receita)
    })
}

/**
 * 
 * @param {String} id 
 * @returns Json de Receita
 */
 function getReceitaJson(id){
    const contaValue = contaNovaReceita.value.split("--")
    const receitaJson = {"nome": nomeNovaReceita.value,
                        "data": dateNovaReceita.value,
                        "categoria": categoriaNovaReceita.value,
                        "conta": {
                            "id": contaValue[0],
                            "nome": contaNovaReceita.selectedOptions[0].innerText,
                            "moeda": contaValue[1]
                        },
                        "valor": valorNovaReceita.value,
                        "recebida": recebidaNovaReceita.value
                    }

    if(id !== undefined){
        receitaJson.id = id
        return receitaJson
    }
    return receitaJson
        
 }

/**
 * @description Click do botão para cadastrar receita
 */
btnCadastrar.addEventListener("click", () => {
    cadastrarReceita()
})

/**
 * @description Cadastrar receita
 */
 function cadastrarReceita(){
    const receitaJSON = getReceitaJson()
    criarReceita(firebase.auth().currentUser.uid, receitaJSON)
    .then((receita) => {
        receitaJSON.id = receita.id
        if(recebidaNovaReceita.value === "S"){
            creditarReceita(receitaJSON)
        }
        limparCadastro()
        if(dateNovaReceita.value.includes(dateFiltro.value)){
            updateTable(receitaJSON)
        }
    }).catch(error => {
        console.log(error.message)
    })
}

/**
 * @description Debita o valor da receita do total da conta
 * @param {Json} receitaJSON 
 */
 function debitarReceita(receitaJSON){
    getConta(firebase.auth().currentUser.uid, receitaJSON.conta.id)
    .then(conta => {
        const novoSaldo = conta.data().saldo - receitaJSON.valor
        atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description Credita o valor da Receita do total da conta
 * @param {Json} receitaJSON 
 */
 function creditarReceita(receitaJSON){
    getConta(firebase.auth().currentUser.uid, receitaJSON.conta.id)
    .then(conta => {
        const novoSaldo = parseFloat(conta.data().saldo) + parseFloat(receitaJSON.valor)
        atualizaSaldoConta(firebase.auth().currentUser.uid, conta.id, novoSaldo)
    }).catch(error =>{
        console.log(error.message)
    })
}

/**
 * @description limpa os valores da parte de cadastro
 */
 function limparCadastro(){
    nomeNovaReceita.value = ""
    dateNovaReceita.innerText = ""
    categoriaNovaReceita.value = ""
    contaNovaReceita.value = ""
    valorNovaReceita.value = ""
    recebidaNovaReceita.value = "N"   
}

/**
 * @description Cancela operação
 * @param {BUTTON} btnAtualizarReceitas 
 */
 function cancelar(btnAtualizarReceitas){
    recebidaNovaReceita.classList.remove("hidden-class")
    const tableButtons = document.querySelectorAll("table button")
    btnCadastrar.classList.remove("hidden-class")
    btnAtualizarReceitas.remove()
    btnCancelar.classList.add("hidden-class")
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
    limparCadastro()
}

verificaUser()