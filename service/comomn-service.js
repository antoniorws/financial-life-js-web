const getOut = document.querySelector("#nav-getout")
var userGlobal = null

getOut.addEventListener("click", () => {
    getOutFunction()   
})

/**
 * get out
 */
function getOutFunction(){
    firebase.auth().signOut().then(() => {
        console.log("User logout");   
        userGlobal = null
    }).catch((error) => {
        console.log(error.message);
    });
}