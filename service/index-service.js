const registerButton = document.querySelector("#registerButton");
const loginButton = document.querySelector("#loginButton");
const inputName = document.querySelector("#inputName");
const inputEmail = document.querySelector("#inputEmail");
const inputPassword = document.querySelector("#inputPassword");
const labelMessage = document.querySelector("#message-index");

registerButton.addEventListener("click", ()=>{
    const name = inputName.value;
    if(name != null && name.trim() != ""){
        createUser(inputEmail.value, inputPassword.value, inputName.value)
    }else{
        alert("Fill the field (name)!");
        inputName.focus();
    }
})

loginButton.addEventListener("click", ()=>{
    login(inputEmail.value, inputPassword.value)
})