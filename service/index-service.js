const cadastrarButton = document.querySelector("#cadastrarButton");
const entrarButton = document.querySelector("#entrarButton");
const inputName = document.querySelector("#inputName");
const inputEmail = document.querySelector("#inputEmail");
const inputPassword = document.querySelector("#inputPassword");
const labelMensagem = document.querySelector("#mensagem-index");

cadastrarButton.addEventListener("click", ()=>{
    const name = inputName.value;
    if(name != null && name.trim() != ""){
        createUser(inputEmail.value, inputPassword.value, inputName.value)
    }else{
        alert("Preencha o campo Nome!");
        inputName.focus();
    }
})

entrarButton.addEventListener("click", ()=>{
    login(inputEmail.value, inputPassword.value)
})