const btnCadastrar = document.querySelector("#cadastrarReceita")
const btnCancelar = document.querySelector("#cancelaAtualizacao")
const tableReceitas = document.querySelector("#tableReceitas")
//Nova despesa
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
    //getAllDespesasMes(mes, ano, "", "")
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

verificaUser()