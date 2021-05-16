function createUser(email, password, name){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
        const uid = user.user.uid;
        const users = firestore.collection("users");
        users.doc(uid).set({
            email: email,
            name : name
        })
        alert("Register done with sucess!");
    })
    .catch((error) => {
        labelMessage.innerHTML = error.message;
    });
}

function login(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        const uid = user.user.uid;
        firestore.doc(`users/${uid}`).get().then(()=>{
            window.location.href = "./views/dashboard.html"
        })
    })
    .catch((error) => {
        labelMessage.innerHTML = error.message;
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