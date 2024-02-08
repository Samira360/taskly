c = (e) => document.querySelector(e)
cs = (e) => document.querySelectorAll(e)
var pontos = 0

// Evitar cache ao voltar
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// FAZ REQUISIÇÃO PARA VERIFICAR SE JA TEM USER LOGADO
fnReqVerificaUser()

function fnReqVerificaUser() {
    fetch("http://localhost/telasihc/app/helpers/rotaVerificaUser.php")
        .then(response => response.text())
        .then(text => {
            if (JSON.parse(text)["code"] == 0)
                window.location.href = "../index.html"
        })
    .catch(error => {
        console.log('Ocorreu um erro:', error);
    });
}

// FAZ REQUISIÇÃO PARA BUSCAR USUARIO
fnReqUsuario()

function fnReqUsuario() {
    fetch("http://localhost/telasihc/app/helpers/rotasUsuario.php")
        .then(response => response.text())
        .then(text => {
            // console.log(text)
            fnCarregaUsuario(JSON.parse(text)["dadosUser"])
            fnCarregaQtds(JSON.parse(text)["qtds"])
        })
        .catch(error => {
            console.log('Ocorreu um erro:', error);
        });
}

function fnCarregaQtds(dados) {
    c("#colecoes").innerHTML = dados["total_colecoes"]
    c("#tarefas").innerHTML = dados["total_tarefas"]
    c("#concluidas").innerHTML = dados["total_concluidas"]
}

function fnCarregaUsuario(dados) {
    // console.log(dados)
    c(".data-name p").innerHTML = dados["USRNOME"]
    c(".data-email p").innerHTML = dados["USREMAIL"]
}


c("#btnAlter").addEventListener("click", () => {
    scroll(0, 0)
    let name = c("#divName").querySelector("p").innerHTML
    c("#divName").style.display = "none"
    c("#divAlter").style.display = "flex"
    c("#txtName").value = name
})

c("#btnClose").addEventListener("click", fechaAlterNome)

function fechaAlterNome() {
    c("#divName").style.display = "flex"
    c("#divAlter").style.display = "none"
}

c("#btnSave").addEventListener("click", () => {
    let nome = c("#txtName")

    let dados = {
        nome: nome.value
    }

    fetch("http://localhost/telasihc/app/helpers/rotasUsuario.php", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    }).then(response => response.text())
        .then(text => {
            // console.log(text)
            fnTrataRetorno(JSON.parse(text))
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
})


function fnTrataRetorno(retorno) {

    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnReqUsuario()
        fechaAlterNome()
    } else {
        fnMsg(retorno["message"])
    }
}

function fnMsg(msg, clss = "error") {
    let msgErro = c("#msgAviso")

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


c("#voltar").addEventListener("click", ()=>{
    window.location.href = "principal.html"
})

c("#btnSair").addEventListener("click", fnReqFechaSessao)

function fnReqFechaSessao() {
    fetch("http://localhost/telasihc/app/helpers/rotasFechaSessao.php")
        .then(response => response.text())
        .then(text => {
            if (JSON.parse(text)["code"] == 1) {
                window.location.href = "../index.html"
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}


c("#formAlterPass").addEventListener("submit", (e) => {
    e.preventDefault();
})

c("#btnAlterSenha").addEventListener("click", fnAlterSenha)

function fnAlterSenha() {
    let oldPass = c("#txtSenhaAntiga")
    let newPass = c("#txtSenhaNova")
    let confirm = c("#txtComfirm")

    console.log(oldPass.value, newPass.value)
    if (oldPass.value === "" && newPass.value === "") {
        fnMsg("Os campos de senha não podem estar vazios!")
    } else if (confirm.value !== newPass.value) {
        fnMsg("Senhas não conferem.")
    } else if (oldPass.value === newPass.value) {
        fnMsg("Sua senha nova deve ser diferente da anterior!")
    } else if (pontos !== 25) {
        fnMsg("Senha nova não é forte o suficiente!")
        fnDica()

        c('.pass-dica').classList.add("treme")
        setTimeout(function () {
            fnDica()
            c('.pass-dica').classList.remove("treme")
        }, 3000);

    } else {
        fnReqSenhaUsuario()
    }
}

c('.dica').addEventListener('click', fnDica)

function fnDica() {
    c('.msg-dica').classList.toggle("open")
}

function fnReqSenhaUsuario() {
    let oldPass = c("#txtSenhaAntiga")
    let newPass = c("#txtSenhaNova")

    let dados = {
        senhaAntiga: oldPass.value,
        senhaNova: newPass.value
    }

    fetch("http://localhost/telasihc/app/helpers/rotasUsuario.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    }).then(response => response.text())
        .then(text => {
            // console.log(text)
            fnTrataRetornoSenha(JSON.parse(text))
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

function fnTrataRetornoSenha(retorno) {
    if (retorno["code"] == 1) {
        fnMsg(retorno["message"], "success")
        fnLimpaTxt()
    } else {
        fnMsg(retorno["message"])
    }
}

function fnLimpaTxt() {
    c("#txtSenhaAntiga").value = ""
    c("#txtSenhaNova").value = ""
    c("#txtComfirm").value = ""
}


c('#txtSenhaNova').addEventListener('keyup', fnStatusPass)

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