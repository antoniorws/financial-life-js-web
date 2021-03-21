function createUser(){
    firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value)
    .then((user) => {
        const uid = user.user.uid;
        const users = firestore.collection("users");
        users.doc(uid).set({
            email: inputEmail.value,
            nome : inputName.value
        })
        alert("Cadastro realizado com sucesso!");
    })
    .catch((error) => {
        labelMensagem.innerHTML = error.message;
    });
}

function login(){
    firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then(function(user) {
        const uid = user.user.uid;
        firestore.doc(`users/${uid}`).get().then(()=>{
            window.location.href = "./views/index-vida-financeira.html"
        })
    })
    .catch((error) => {
        labelMensagem.innerHTML = error.message;
    });
}

/*
function sair(){
    firebase.auth().signOut().then(() => {
        alert("User logout");   
    }).catch((error) => {
        console.log(error.message);
    });
}*/