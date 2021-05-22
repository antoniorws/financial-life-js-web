function verifyUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            init()
        } else {
            window.location.href = "../index.html"
        }
    });
}

/**
 * @description Inicia os métodos para a tela
 */
function init(){
    document.querySelector("#nav-home").classList.add("main")
}

verifyUser()