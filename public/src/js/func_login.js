const c = (e) => document.querySelector(e)

// FAZ REQUISIÇÃO PARA VERIFICAR SE JA TEM USER LOGADO
fnReqVerificaUser()

function fnReqVerificaUser() {
    fetch("http://localhost/telasihc/app/helpers/rotaVerificaUser.php")
        .then(response => response.text())
        .then(text => {
            if (JSON.parse(text)["code"] == 1)
                window.location.href = "./principal.html"
        })
        .catch(error => {
            console.log('Ocorreu um erro:', error);
        });
}

c("#voltar").addEventListener("click", ()=>{
    window.location.href = "../index.html"
})


c("#formLogin").addEventListener("submit", (e)=>{
    e.preventDefault()
    console.log("rodei")
})

c("#btnLogin").addEventListener("click", fnLogin)

function fnLogin(){
    console.log("rodei2")
    let email = c("#txtEmail")
    let senha = c("#txtSenha")

    if(email.value == "" || senha.value == ""){
        fnMsg("Por favor, preencha todos os campos obrigatórios antes de prosseguir.")
    }else{
        let dados = {
            email: email.value,
            senha: senha.value,
            tipo: "login"
        }

        console.log("rodei3")

        fetch("http://localhost/telasihc/app/helpers/rotaLoginCad.php",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }).then(response => response.text())
            .then(text => {
                console.log(text)
                fnTrataRetorno(JSON.parse(text))
            })
            .catch(error => {
                console.log('Ocorreu um erro:', error);
            });
    }
}


function fnLimpaTxt(){
    c("#txtEmail").value = ""
    c("#txtSenha").value = ""
}

function fnTrataRetorno(retorno){

    if(retorno["code"] == "1"){
        fnMsg(retorno["message"], "success")
        fnLimpaTxt()
        setTimeout(function() {
            window.location.href = "./principal.html"
        }, 500); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    }else{
        fnMsg(retorno["message"])
    }
}

function fnMsg(msg, clss = "error"){
    let msgErro = c("#msg")
    
    msgErro.innerHTML = msg

    if(clss == "success"){
        msgErro.classList.remove("error")
        msgErro.classList.add("success")
        setTimeout(function() {
            msgErro.classList.remove("success")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    }else{
        msgErro.classList.remove("success")
        msgErro.classList.add("error")
        setTimeout(function() {
            msgErro.classList.remove("error")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    }
}


