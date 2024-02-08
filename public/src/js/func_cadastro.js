const c = (e) => document.querySelector(e);
const cs = (e) => document.querySelectorAll(e);
var pontos = 0

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



c("#formCadastro").addEventListener("submit", (e) => {
    e.preventDefault();
});

c("#btnCadastrar").addEventListener("click", fnCadastra)

function fnCadastra() {
    let nome = c("#txtNome")
    let email = c("#txtEmail")
    let senha = c("#txtSenha")
    let confirm = c("#txtConfirm")

    if (nome.value == "" || email.value == "" || senha.value == "" || confirm.value == "") {
        fnMsg("Por favor, preencha todos os campos obrigatórios antes de prosseguir.")
    } else if (confirm.value != senha.value) {
        fnMsg("Senhas não conferem.")
    } else if (pontos !== 25) {
        fnMsg("Senha não é forte o suficiente!")
        fnDica()
        c('.pass-dica').classList.add("treme")
        setTimeout(function () {
            fnDica()
            c('.pass-dica').classList.remove("treme")
        }, 3000);
    } else {
        let dados = {
            nome: nome.value,
            email: email.value,
            senha: senha.value,
            tipo: "cadastro"
        }

        fetch("http://localhost/telasihc/app/helpers/rotaLoginCad.php", {
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
                console.error('Ocorreu um erro:', error);
            });
    }
}

c("#voltar").addEventListener("click", ()=>{
    window.location.href = "../index.html"
})

c('.dica').addEventListener('click', fnDica)

function fnDica(){
    c('.msg-dica').classList.toggle("open")
}

c('#txtSenha').addEventListener('keyup', fnStatusPass)


function fnTrataRetorno(retorno) {

    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnLimpaTxt()
        setTimeout(function () {
            window.location.href = "./principal.html"
        }, 500); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    } else {
        fnMsg(retorno["message"])
    }
}

function fnMsg(msg, clss = "error") {
    let msgErro = c("#msg")

    msgErro.innerHTML = msg

    if (clss == "success") {
        msgErro.classList.remove("error")
        msgErro.classList.add("success")
        setTimeout(function () {
            msgErro.classList.remove("success")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    } else {
        msgErro.classList.remove("success")
        msgErro.classList.add("error")
        setTimeout(function () {
            msgErro.classList.remove("error")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)
    }
}


function fnLimpaTxt() {
    c("#txtNome").value = ""
    c("#txtEmail").value = ""
    c("#txtSenha").value = ""
    c("#txtConfirm").value = ""
}

function fnStatusPass(e) {
    pontos = 0;

    let icon = c('#icon-correct').innerHTML;
    icon.id = "";

    const min = /[a-z]/;
    const mai = /[A-Z]/;
    const num = /[0-9]/;
    const esp = /\W|_/;

    let div1 = c('#fraca');
    let div2 = c('#media');
    let div3 = c('#forte');

    let oEig = c('#eig');
    let oNum = c('#num');
    let oMin = c('#min');
    let oMai = c('#mai');
    let oEsp = c('#esp');

    oEig.innerHTML = "6 caracteres;";
    oNum.innerHTML = "1 número;";
    oMin.innerHTML = "1 letra minúscula;";
    oMai.innerHTML = "1 letra maiúscula;";
    oEsp.innerHTML = "1 caracter especial.";

    div1.style.backgroundColor = "red";

    if (e.currentTarget.value.length >= 6) {
        pontos += 5;
        oEig.innerHTML += icon
    }

    if (min.test(e.currentTarget.value)) {
        pontos += 5;
        oMin.innerHTML += icon
    }

    if (mai.test(e.currentTarget.value)) {
        pontos += 5;
        oMai.innerHTML += icon
    }

    if (num.test(e.currentTarget.value)) {
        pontos += 5;
        oNum.innerHTML += icon
    }

    if (esp.test(e.currentTarget.value)) {
        pontos += 5;
        oEsp.innerHTML += icon
    }


    if (pontos == 0) {
        div1.style.width = "0";
        div2.style.width = "0";
        div3.style.width = "0";
    }

    if (pontos == 5) {
        div1.style.width = "20%";
        div2.style.width = "0";
        div3.style.width = "0";
    }

    if (pontos == 10) {
        div1.style.width = "33%";
        div2.style.width = "7%";
        div3.style.width = "0";
    }

    if (pontos == 15) {
        div1.style.width = "33%";
        div2.style.width = "27%";
        div3.style.width = "0";
    }

    if (pontos == 20) {
        div1.style.width = "33%";
        div2.style.width = "33%";
        div3.style.width = "14%";
    }

    if (pontos == 25) {
        div1.style.width = "33%";
        div2.style.width = "33%";
        div3.style.width = "34%";
    }
}