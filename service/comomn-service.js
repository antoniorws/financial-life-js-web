const getOut = document.querySelector("#nav-getout")

getOut.addEventListener("click", () => {
    getOutFunction()   
})

/**
 * get out
 */
function getOutFunction(){
    firebase.auth().signOut().then(() => {
        console.log("User logout");
        /**
         * TODO - go to some screen
         */   
    }).catch((error) => {
        console.log(error.message);
    });
}