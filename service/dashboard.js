function verificaUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Usuário logado')
        } else {
            console.log('Usuário não logado')
        }
    });
}

verificaUser()