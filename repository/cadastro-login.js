//VARIÁVEIS
const cadastrarButton = document.querySelector("#cadastrarButton");
const entrarButton = document.querySelector("#entrarButton");
const inputName = document.querySelector("#inputName");
const inputEmail = document.querySelector("#inputEmail");
const inputPassword = document.querySelector("#inputPassword");
const labelMensagem = document.querySelector("#mensagem-index");
//MÉTODOS
cadastrarButton.addEventListener("click", ()=>{
    firebase.auth().createUserWithEmailAndPassword(inputEmail.value, inputPassword.value)
    .then((user) => {
        const uid = user.user.uid;
        const users = firestore.collection("users");
        users.doc(uid).set({
            email: inputEmail.value,
            nome : inputName.value
        })
        alert("Conta criada com sucesso!");
    })
    .catch((error) => {
        labelMensagem.innerHTML = error.message;
    });
})

entrarButton.addEventListener("click", ()=>{
    firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then(function(user) {
        const uid = user.user.uid;
        firestore.doc(`users/${uid}`).get().then(()=>{
        })
    })
    .catch((error) => {
        alert(error.message);
    });
})

/*
sairButton.addEventListener("click", ()=>{
    firebase.auth().signOut().then(() => {
        alert("User logout");   
    }).catch((error) => {
        console.log(error.message);
    });
})*/