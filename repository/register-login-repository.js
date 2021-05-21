/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 */
function createUser(email, password, name){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
        const uidCreated = user.user.uid;
        const users = firestore.collection("users");
        users.doc(uidCreated).set({
            email: email,
            name : name
        })
        alert("Register done with sucess!");
    })
    .catch((error) => {
        labelMessage.innerHTML = error.message;
    });
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
function login(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        firestore.doc(`users/${user.user.uid}`)
        .get()
        .then(()=>{
            window.location.href = "./views/dashboard.html"
        })
    })
    .catch((error) => {
        labelMessage.innerHTML = error.message;
    });
}