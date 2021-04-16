function verificaUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            init()
        } else {
            console.log('Usuário não logado')
        }
    });
}

/**
 * @description Inicia os métodos para a tela
 */
function init(){
    document.querySelector("#nav-home").classList.add("principal")
}

verificaUser()