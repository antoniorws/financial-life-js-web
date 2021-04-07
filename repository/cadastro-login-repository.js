function createUser(email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
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

function login(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        const uid = user.user.uid;
        firestore.doc(`users/${uid}`).get().then(()=>{
            window.location.href = "./views/index-vida-financeira.html"
        })
    })
    .catch((error) => {
        labelMensagem.innerHTML = error.message;
    });
}

function sair(){
    firebase.auth().signOut().then(() => {
        console.log("User logout");
        /**
         * TODO - go to some screen
         */   
    }).catch((error) => {
        console.log(error.message);
    });
}