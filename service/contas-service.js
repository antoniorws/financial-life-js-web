const btnCadastrar = document.querySelector("#cadastrarContas")
const nomeNovaConta = document.querySelector("#nomeNovaConta")
const tipoContaNovaConta = document.querySelector("#tipoConta")
const moedaNovaConta = document.querySelector("#moeda")
const tableContas = document.querySelector("#tableContas")
const divNovosDados = document.querySelector("#div-novos-dados")
const btnCancelar = document.querySelector("#cancelaAtualizacao")

/**
 * @description Verifica se existe usuário.
 */
function verificaUser(){
    firebase.auth().onAuthStateChanged( (user) => {
        if (user) {
            getAllContas()
        } else {
            console.log('Usuário não logado')
        }
    });
}

/**
 * @description Carrega todas as contas do usuário na table de contas
 */
function getAllContas(){
    while(tableContas.childNodes.length > 2){
        tableContas.removeChild(tableContas.lastChild);
    }
    const response = getContas(firebase.auth().currentUser.uid)
    response.then((contas) => {
        contas.forEach(conta => {
            const contaJSON = {
                "id": conta.id,
                "nome": conta.data().nome,
                "tipoConta": conta.data().tipoConta,
                "moeda": conta.data().moeda
            }
            updateTable(contaJSON)
        });
    }).catch(error =>{
        alert(error.message);
    })
}

/**
 * 
 * @param {JSON} conta 
 * @description Carrega a table
 */
function updateTable(conta){
    const tr = document.createElement("TR")
    const tdId = document.createElement("TD")
    const tdNome = document.createElement("TD")
    const tdTipoConta = document.createElement("TD")
    const tdMoeda = document.createElement("TD")
    const btnExcluir = document.createElement("BUTTON")
    const btnAtualizar = document.createElement("BUTTON")
    btnExcluir.innerText = "Exluir"
    btnAtualizar.innerText = "Alterar"
    tdId.className = conta.id
    tdNome.className = conta.id
    tdId.innerText = conta.id
    tdNome.innerText = conta.nome 
    tdTipoConta.innerText = conta.tipoConta
    tdMoeda.innerText = conta.moeda
    tr.appendChild(tdId)
    tr.appendChild(tdNome)
    tr.appendChild(tdTipoConta)
    tr.appendChild(tdMoeda)
    tr.appendChild(btnAtualizar)
    tr.appendChild(btnExcluir)
    tableContas.appendChild(tr)

    btnAtualizar.addEventListener("click", () => {
        const tableButtons = document.querySelectorAll("table button")
        for(var i = 0; i < tableButtons.length; i++){
            tableButtons[i].classList.add("disabled-button")
        }

        btnCadastrar.classList.add("hidden-class")
        btnCancelar.classList.remove("hidden-class")
        nomeNovaConta.value = conta.nome
        tipoContaNovaConta.value = conta.tipoConta
        moedaNovaConta.value = conta.moeda
        nomeNovaConta.focus()

        const btnAtualizarContas = document.createElement("BUTTON")
        btnAtualizarContas.innerText = "Atualizar"
        divNovosDados.appendChild(btnAtualizarContas)
        btnAtualizarContas.addEventListener("click", () => {
            const contaJSON = {
                "nome": nomeNovaConta.value,
                "tipoConta": tipoContaNovaConta.value,
                "moeda": moedaNovaConta.value
            }
            atualizaConta(firebase.auth().currentUser.uid, conta.id, contaJSON)
            tdNome.innerText = nomeNovaConta.value
            tdMoeda.innerText = moedaNovaConta.value
            tdTipoConta.innerText = tipoContaNovaConta.value
            cancelar(btnAtualizarContas)
            
        })

        btnCancelar.addEventListener("click", () => {
            cancelar(btnAtualizarContas)
        })
    })

    btnExcluir.addEventListener("click", () => {
        const response = confirm(`Deseja excluir a conta ${conta.nome} e suas movimentações?`);
        if (response == true){
            tr.remove()
            excluirConta(firebase.auth().currentUser.uid, conta.id)
        }
    })
}

btnCadastrar.addEventListener("click", () => {
    const contaJSON = {
        "nome": nomeNovaConta.value,
        "tipoConta": tipoContaNovaConta.value,
        "moeda": moedaNovaConta.value
    }
    criarConta(firebase.auth().currentUser.uid, contaJSON)
    .then((conta) => {
        contaJSON.id = conta.id
        updateTable(contaJSON)
    }).catch(error => {
        alert(error.message)
    })
    nomeNovaConta.innerText = ""
})

function cancelar(btnAtualizarContas){
    const tableButtons = document.querySelectorAll("table button")
    btnCadastrar.classList.remove("hidden-class")
    btnAtualizarContas.remove()
    btnCancelar.classList.add("hidden-class")
    nomeNovaConta.value = ""
    tipoContaNovaConta.value = "CC"
    moedaNovaConta.value = "BRL"
    for(var i = 0; i < tableButtons.length; i++){
        tableButtons[i].classList.remove("disabled-button")
    }
}

verificaUser(); 