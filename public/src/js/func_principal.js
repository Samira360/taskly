const c = (e) => document.querySelector(e)
const cs = (e) => document.querySelectorAll(e)

var idColl = 0;
var idTar = 0;
var nomeColl = "";
var AlterColl = false
let dadosTarefa;
var orderData = true
var orderPriori = false


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
            else {
                c("#nomeUser").innerHTML = JSON.parse(text)["nome"]
            }
        })
    .catch(error => {
        console.log('Ocorreu um erro:', error);
    });
}

// FAZ REQUISIÇÃO PARA BUSCAR AS CATEGORIAS E CARREGA NA PAGINA NO SECTION
fnReqCategoria()

function fnReqCategoria() {
    fetch("http://localhost/telasihc/app/helpers/rotasCategoria.php")
        .then(response => response.text())
        .then(text => {
            // console.log(text)
            fnCarregaCategoria(JSON.parse(text))
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

function fnCarregaCategoria(dados) {

    dados.forEach((e) => {
        let option = document.createElement("option");
        option.setAttribute("value", e["CATCODIGO"])
        option.innerHTML = e["CATNOME"]
        c("#txtCategoria").appendChild(option);
    })
}

// -----------------------------------------------------------------------




// FAZ REQUISIÇÃO PARA BUSCAR COLECÕES E CARREGA NA PAGINA ---------------------------------------

fnReqColecao()

function fnReqColecao(inicial = true) {
    fetch("http://localhost/telasihc/app/helpers/rotasColecao.php")
        .then(response => response.text())
        .then(text => {
            // console.log(text)
            fnPreparaColecaoInicial(JSON.parse(text), inicial)
        })
        .catch(error => {
            fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
        });
}



function fnPreparaColecaoInicial(dados, inicial) {

    if (dados.length !== 0) {

        fnCarregaDadosColecao(dados)

        if (inicial) {  //é a primeira requisição?
            c("#coll-itens").children[0].click(); // clica na primeira coleção pois é a requisição inicial

        } else {
            if (AlterColl) { // verifica se está em modo alterar, então coleção foi alterada, recupera ela e clica nela
                let listColl = cs('.collections-item');
                listColl.forEach((eColl) => {
                    if (eColl.id === idColl) {
                        eColl.click()
                    }
                })

                AlterColl = false
            } else { //a coleção foi adicionada então clica na ultima adicionada
                c("#coll-itens").lastElementChild.click() //clica na ultima coleção, pois foi a ultima inserida e não é inicial
            }

        }


    } else {
        c("#msgInicial").style.display = "block"
        c("#coll-itens").innerHTML = ""
        c('.main-tasks').style.display = "none"
    }

}


function fnCarregaDadosColecao(dados) {
    c("#coll-itens").innerHTML = ""
    c("#msgInicial").style.display = "none"

    dados.forEach((dado) => {

        let element = c('#colecao-modelo').cloneNode(true)
        element.style.display = "flex"
        element.querySelector(".item-icon").style.backgroundColor = dado["CATCOR"]
        element.querySelector(".item-icon img").src = "./src/img/" + dado["COLCATEGORIA"] + ".png"
        element.querySelector("p").innerHTML = dado["COLTITULO"]

        element.setAttribute("id", dado["COLCODIGO"])

        element.addEventListener("click", fnReqTarefaInicial)

        c("#coll-itens").appendChild(element);

    })
}

// --------------------------------------------------------------------



// -------------------- CARREGAMENTO DE TAREFAS NO GERAL ----------------

function fnReqTarefaInicial(e) {
    if (window.innerWidth < 535)
        fnFechaAside()

    idColl = e.currentTarget.id
    nomeColl = e.currentTarget.innerText

    fnFazReqTarefa() //idColl
}

function fnFazReqTarefa() { //idColl
    fetch("http://localhost/telasihc/app/helpers/rotasTarefa.php?idColl=" + idColl)
        .then(response => response.text())
        .then(text => {

            fnCarregaTarefa(JSON.parse(text))

        })
        .catch(error => {
            fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
        });
}

function fnCarregaTarefa(dados) {

    dadosTarefa = [...dados]

    let element = c('.main-tasks')
    element.style.display = "block"
    element.querySelector("#nomeColecao").innerHTML = nomeColl
    element.querySelector("#btnModalTask").setAttribute("coll", idColl)

    fnCarregaDadosTarefa(dados)

}

function fnCarregaDadosTarefa(dados) {

    if (dados.length == 0) {
        c(".coll-tasks").style.display = "none"
        c(".coll-tasks-concluidas").style.display = "none"
        c(".msgIncialTarefa").style.display = "block"
    } else {

        c(".coll-tasks").style.display = "block"
        c(".coll-tasks-concluidas").style.display = "block"
        c(".msgIncialTarefa").style.display = "none"
        let qtdConcluida = 0
        let qtdNConcluida = 0


        c(".coll-tasks .list-tasks").innerHTML = ""
        c(".coll-tasks-concluidas .list-tasks").innerHTML = ""


        // let dadosTarefaOrdenados = fnOrdernaTarefas(dados) //parei aqui

        fnOrdernaTarefas(dados).forEach((dado) => {
            let task = c('.task-body').cloneNode(true)

            task.style.display = "block"
            task.querySelector(".task-infos h3").innerHTML = dado["TARTITULO"]
            task.querySelector(".task-check").id = dado["TARCODIGO"]
            task.querySelector(".btnAlterTarefa").id = dado["TARCODIGO"]
            task.querySelector(".btnApagaTarefa").id = dado["TARCODIGO"]
            task.id = dado["TARCODIGO"]

            task.classList.remove("red")
            task.classList.remove("green")
            task.classList.remove("yellow")

            if (dado["TARPRIORIDADE"] === 1)
                task.classList.add("red")
            else if (dado["TARPRIORIDADE"] === 2)
                task.classList.add("yellow")
            else if (dado["TARPRIORIDADE"] === 3)
                task.classList.add("green")

            // console.log(dado["TARDESC"])
            if (dado["TARDESC"]) {
                task.querySelector(".task-body-descricao p").innerHTML = dado["TARDESC"]

                task.querySelector(".btnOpenDesc").style.display = "block"

                task.querySelector(".btnOpenDesc").addEventListener("click", () => {
                    // console.log(task)
                    task.querySelector(".task-body-descricao").classList.toggle("open")
                })

            } else {
                task.querySelector(".btnOpenDesc").style.display = "none"
            }



            if (dado["TARDATA"] == "0000-00-00") {
                task.querySelector(".task-infos-date").style.display = "none"
            } else {
                let oData = processaData(dado["TARDATA"])

                if (dado["TARCONCLUIDA"] === 1)
                    oData["data"] = oData["data"].replace(" (Atrasado)", "")
                task.querySelector(".task-infos-date p").innerHTML = oData["data"]
                task.querySelector(".task-infos-date p").style.color = oData["cor"]
                task.querySelector(".task-infos-date svg").style.fill = oData["cor"]
                task.querySelector(".task-infos-date").style.display = "flex"
            }


            if (dado["TARCONCLUIDA"] === 1) {
                qtdConcluida++;
                task.querySelector(".task-check").classList.add("checked")

                c(".coll-tasks-concluidas .list-tasks").appendChild(task)
            }
            else {
                qtdNConcluida++;
                task.querySelector(".task-check").classList.remove("checked")

                c(".coll-tasks .list-tasks").appendChild(task)

            }


            task.querySelector(".task-check").addEventListener("click", fnCheck)
            task.querySelector(".btnAlterTarefa").addEventListener("click", fnAlterTarefa)
            task.querySelector(".btnApagaTarefa").addEventListener("click", fnApagaTarefa)

        })

        c(".coll-tasks h3").innerHTML = "Tarefas - " + qtdNConcluida
        c(".coll-tasks-concluidas h3").innerHTML = "Tarefas completas - " + qtdConcluida
    }

}


// -----------------------------------------------------------------------------


// ---------- OPERAÇÃO DE EXCLUSÃO TAREFA E COLEÇÃO ---------------------

function fnApagaTarefa(e) {
    idTar = e.currentTarget.id

    c(".shadow-modal-comfirm #txtQual").value = "tarefa"
    c(".shadow-modal-comfirm p").innerHTML = "Deseja realmente excluir essa tarefa?"

    fnModalConfirm()

}

c("#btnApagaColecao").addEventListener("click", () => {
    // console.log("essa é a coll p apagar", idColl)
    fnMenuAlter();
    c(".shadow-modal-comfirm #txtQual").value = "colecao"
    c(".shadow-modal-comfirm p").innerHTML = "Deseja realmente excluir essa coleção?"

    fnModalConfirm()

})

c("#btnApagaObj").addEventListener("click", fnApagaObj)

function fnApagaObj() {
    let qual = c(".shadow-modal-comfirm #txtQual").value
    let fnTrataRetorno = ""
    // console.log("esse é o id da colecao", idColl)

    if (qual === "tarefa") {
        rota = "rotasTarefa.php?idTar=" + idTar
        fnTrataRetorno = (retorno) => fnTrataRetornoApagaTarefa(retorno)
    } else {
        rota = "rotasColecao.php?idColl=" + idColl
        fnTrataRetorno = (retorno) => fnTrataRetornoApagaColl(retorno)
    }

    fetch("http://localhost/telasihc/app/helpers/" + rota,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(text => {
            // console.log(text)
            fnTrataRetorno(JSON.parse(text))
        })
        .catch(error => {
            console.log('Ocorreu um erro:', error);
        });
}

function fnTrataRetornoApagaColl(retorno) {

    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnReqColecao(false)
        fnModalConfirm()

    } else {
        fnMsg(retorno["message"])
    }
}

function fnTrataRetornoApagaTarefa(retorno) {

    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnFazReqTarefa(idColl)
        fnModalConfirm()
    } else {
        fnMsg(retorno["message"])
    }
}


// --------------------------------------------------------------------



// ----------------------- OPERAÇÕES TAREFAS ----------------------



// ------------------------- ALTERA TAREFA ---------------------------

function fnAlterTarefa(e) {
    idTar = e.currentTarget.id

    // pega dados da tarefa clicada atual
    fetch("http://localhost/telasihc/app/helpers/rotasTarefa.php?idTar=" + idTar)
        .then(response => response.text())
        .then(text => {
            // console.log(text)

            fnCarregaTarefaModal(JSON.parse(text))
        })
        .catch(error => {
            fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
        });

}

function fnCarregaTarefaModal(dados) {
    c("#txtTar").value = dados["TARCODIGO"]
    c("#txtTituloTar").value = dados["TARTITULO"]
    c("#txtPrioridade").value = dados["TARPRIORIDADE"]
    c("#txtData").value = dados["TARDATA"]
    c("#txtDesc").value = dados["TARDESC"]
    c(".modal-task-form h1").innerHTML = "Altere a sua tarefa"
    c("#btnAddTarefa").innerHTML = "Alterar"

    fnModalTask()
}

// ------------------- ADICIONA TAREFA ----------------------

c("#formTarefa").addEventListener("submit", (e) => {
    e.preventDefault();
})

c("#btnAddTarefa").addEventListener("click", () => {

    let titulo = c("#txtTituloTar")
    let prioridade = c("#txtPrioridade")
    let data = c("#txtData")
    let desc = c("#txtDesc")
    let txtTar = c("#txtTar")

    if (titulo.value === "" || prioridade.value === 0) {
        fnMsg("Por favor, preencha todos os campos obrigatórios antes de prosseguir.")
    } else {
        let dados = {
            titulo: titulo.value,
            priori: prioridade.value,
            dt: data.value,
            desc: desc.value,
            idColl: idColl
        }

        if (txtTar.value !== "") {
            method = "PUT"
            dados.idTar = idTar
        }
        else method = "POST"

        fetch("http://localhost/telasihc/app/helpers/rotasTarefa.php", {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }).then(response => response.text())
            .then(text => {
                // console.log(text)
                fnTrataRetornoTar(JSON.parse(text))
            })
            .catch(error => {
                fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
            });

    }

})

function fnTrataRetornoTar(retorno) {
    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnLimpaTxtTar()
        fnModalTask()
        // fnRecarregaTarefa()
        fnFazReqTarefa()
    } else {
        fnMsg(retorno["message"])
    }
}

function fnLimpaTxtTar() {
    c("#txtTituloTar").value = ""
    c("#txtPrioridade").value = 3
    c("#txtData").value = ""
    c("#txtDesc").value = ""
    c("#txtTar").value = ""
    c(".modal-task-form h1").innerHTML = "Crie sua nova tarefa"
    c("#btnAddTarefa").innerHTML = "Criar"
}

function fnCheck(e) {
    let check = e.currentTarget
    idTar = check.id

    // console.log("estou no check")

    if (check.classList.contains("checked")) {

        check.classList.remove("checked")
        fnAlteraEstado(false)
    }
    else {
        check.classList.add("checked")
        fnAlteraEstado(true)
    }
}

function fnAlteraEstado(status) {

    // console.log("esse é o id tar atual", idTar)
    let dados = {
        status: status,
        idTar: idTar
    }

    fetch("http://localhost/telasihc/app/helpers/rotasTarefa.php", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    }).then(response => response.text())
        .then(text => {
            // console.log(text)
            // fnRecarregaTarefa()
            fnFazReqTarefa()
        })
        .catch(error => {
            fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
        });
}

// function fnRecarregaTarefa() {

//     fetch("http://localhost/telasihc/app/helpers/rotasTarefa.php?idColl=" + idColl)
//         .then(response => response.text())
//         .then(text => {
//             fnCarregaDadosTarefa(JSON.parse(text))
//         })
//         .catch(error => {
//             fnMsg('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.', error)
//         });
// }

function fnMsg(msg, tipoMsg = "error") {
    let msgAviso = c("#msgAviso")

    msgAviso.innerHTML = msg

    if (tipoMsg == "success") {
        msgAviso.classList.remove("error")
        msgAviso.classList.add("success")

        setTimeout(function () {
            msgAviso.classList.remove("success")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)

    } else {
        msgAviso.classList.remove("success")
        msgAviso.classList.add("error")

        setTimeout(function () {
            msgAviso.classList.remove("error")
        }, 5000); // A mensagem de erro desaparecerá após 5 segundos (5000 milissegundos)

    }
}

//-------------------------------------------------------------------------------



// --------------------  OPERAÇÕES COLEÇÃO --------------------------------------------



// ------------------- ALTERA COLEÇÃO -------------------------------

c("#btnAlterColecao").addEventListener("click", () => {

    fnMenuAlter();

    fetch("http://localhost/telasihc/app/helpers/rotasColecao.php?idColl=" + idColl)
        .then(response => response.text())
        .then(text => {
            // console.log(text)    
            fnCarregaColecaoModal(JSON.parse(text))
        })
        .catch(error => {
            console.log('Ocorreu um erro:', error);
        });


})

function fnCarregaColecaoModal(dados) {
    c("#txtTitulo").value = dados["COLTITULO"]
    c("#txtCategoria").value = dados["COLCATEGORIA"]
    c("#txtIdColl").value = dados["COLCODIGO"]
    c(".modal-collection-form h1").innerHTML = "Altere a sua coleção"
    c("#btnAddCol").innerHTML = "Alterar"

    fnModalColl()
}


// -------- ADICIONA COLEÇÃO -----------------------------------

c("#formCol").addEventListener("submit", (e) => {
    e.preventDefault();
})

c("#btnAddCol").addEventListener("click", fnAddColecao)

function fnAddColecao() {
    let titulo = c("#txtTitulo")
    let categoria = c("#txtCategoria")
    let eIdColl = c("#txtIdColl")

    if (titulo.value == "" || categoria.value == "0") {
        fnMsg("Por favor, preencha todos os campos obrigatórios antes de prosseguir.")
    } else {
        let dados = {
            titulo: titulo.value,
            categoria: categoria.value
        }

        if (eIdColl.value !== "") {
            console.log("entreii")
            method = "PUT"
            dados.idColl = eIdColl.value
            idColl = eIdColl.value
            AlterColl = true
        }
        else method = "POST"

        fetch("http://localhost/telasihc/app/helpers/rotasColecao.php", {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }).then(response => response.text())
            .then(text => {
                // console.log(text)
                fnTrataRetornoColl(JSON.parse(text))
            })
            .catch(error => {
                console.error('Ocorreu um erro:', error);
            });

    }
}


function fnTrataRetornoColl(retorno) {

    if (retorno["code"] == "1") {
        fnMsg(retorno["message"], "success")
        fnLimpaTxtColl()
        fnReqColecao(false)

        fnModalColl()

    } else {
        fnMsg(retorno["message"])
    }
}


function fnLimpaTxtColl() {
    c("#txtIdColl").value = ""
    c("#txtTitulo").value = ""
    c("#txtCategoria").value = "0"
    c(".modal-collection-form h1").innerHTML = "Vamos criar uma <br/> coleção de tarefas"
}




//---------------------------------- FUNCIONALIDADES FRONT -----------

function processaData(data) {

    let result = {}
    let green = "#40ce45"
    let yellow = "#d1c629"
    let red = "#ce4040"

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    let partesData = data.split('-');
    let ano = parseInt(partesData[0]);
    let mes = parseInt(partesData[1]) - 1;
    let dia = parseInt(partesData[2]);

    const oData = new Date(ano, mes, dia);

    const diaDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

    let msPorDia = 24 * 60 * 60 * 1000;
    let diasDiferenca = Math.floor((oData - dataAtual) / msPorDia);

    if (diasDiferenca === -1) {

        result["data"] = 'Ontem (Atrasado)';
        result["cor"] = red;

        return result;
    } else if (diasDiferenca === 0) {

        result["data"] = 'Hoje';
        result["cor"] = yellow;

        return result;
    } else if (diasDiferenca === 1) {

        result["data"] = 'Amanhã';
        result["cor"] = green;

        return result;
    } else if (diasDiferenca <= 0) {

        let diaFormatado = String(dia).padStart(2, '0');
        let mesFormatado = String(mes + 1).padStart(2, '0');

        result["data"] = `${diaFormatado}-${mesFormatado}-${ano} (Atrasado)`;
        result["cor"] = diasDiferenca < 0 ? red : green;

        return result;

    } else if (diasDiferenca > 0 && diasDiferenca < 7) {

        result["data"] = diaDaSemana[oData.getDay()];
        result["cor"] = green;

        return result;
    } else {
        let diaFormatado = String(dia).padStart(2, '0');
        let mesFormatado = String(mes + 1).padStart(2, '0');

        result["data"] = `${diaFormatado}-${mesFormatado}-${ano}`;
        result["cor"] = diasDiferenca < 0 ? red : green;

        return result;
    }
}



// ---- SAIR ---------------

c("#btnSair").addEventListener("click", fnReqFechaSessao)

function fnReqFechaSessao() {
    fetch("http://localhost/telasihc/app/helpers/rotasFechaSessao.php")
        .then(response => response.text())
        .then(text => {
            // console.log(text)
            if (JSON.parse(text)["code"] == 1) {
                window.location.href = "../index.html"
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}





//FRONTT -----------------------------------------------------------------

function fnOrdernaTarefas(dds) {

    const ddsTar = [...dds];

    if (orderData && orderPriori) {
        // Ordenar por TARDATA e depois por TARPRIORIDADE com tratamento para "0000-00-00"
        return ddsTar.sort((a, b) => {
            // Tratar o caso especial "0000-00-00" para TARDATA
            if (a.TARDATA === "0000-00-00" && b.TARDATA !== "0000-00-00") {
                return 1; // Coloca a data "0000-00-00" após as outras
            } else if (a.TARDATA !== "0000-00-00" && b.TARDATA === "0000-00-00") {
                return -1; // Coloca a data "0000-00-00" antes das outras
            }

            // Se as datas são iguais, ordenar por TARPRIORIDADE
            if (a.TARDATA === b.TARDATA) {
                return a.TARPRIORIDADE - b.TARPRIORIDADE;
            }

            // Se não for o caso especial e as datas são diferentes, compara as datas normalmente
            return new Date(a.TARDATA) - new Date(b.TARDATA);
        });


    }
    else if (orderData) {
        // Ordenar por TARDATA com tratamento para "0000-00-00"
        return ddsTar.sort((a, b) => {
            // Tratar o caso especial "0000-00-00"
            if (a.TARDATA === "0000-00-00" && b.TARDATA !== "0000-00-00") {
                return 1; // Coloca a data "0000-00-00" após as outras
            } else if (a.TARDATA !== "0000-00-00" && b.TARDATA === "0000-00-00") {
                return -1; // Coloca a data "0000-00-00" antes das outras
            }

            // Se não for o caso especial, compara as datas normalmente
            return new Date(a.TARDATA) - new Date(b.TARDATA);
        });

    } else if (orderPriori) {
        // Ordenar por TARPRIORIDADE
        return ddsTar.sort((a, b) => a.TARPRIORIDADE - b.TARPRIORIDADE);
    } else {
        // Sem ordem
        return dadosTarefa

    }

}

c("#btnOrdenaData").addEventListener("click", (e) => {
    // e.currentTarget.classList.toggle("clicked")
    // orderData = !orderData

    if (e.currentTarget.classList.contains("clicked")) {
        e.currentTarget.classList.remove("clicked")
        orderData = false
    } else {
        e.currentTarget.classList.add("clicked")
        orderData = true
    }

    fnCarregaDadosTarefa(dadosTarefa)
})

c("#btnOrdenaPriori").addEventListener("click", (e) => {
    // e.currentTarget.classList.toggle("clicked")
    if (e.currentTarget.classList.contains("clicked")) {
        e.currentTarget.classList.remove("clicked")
        orderPriori = false
    } else {
        e.currentTarget.classList.add("clicked")
        orderPriori = true
    }

    fnCarregaDadosTarefa(dadosTarefa)
})


c("#dropDownAlter").addEventListener("click", () => {
    // cs(".drop-down-alter").forEach((item) => {
    // cs(".drop-down-alter")[0].classList.add("drop-down-alter--active");

    fnMenuAlter();

    setTimeout(function () {
        cs(".drop-down-alter")[0].classList.remove("drop-down-alter--active");
    }, 3000); // O menu vai fechar em 5 segudos

});

function fnMenuAlter() {
    cs(".drop-down-alter")[0].classList.toggle("drop-down-alter--active");
}

// cs(".drop-down-alter__button").forEach((btn)=>{
//     btn.addEventListener("click", () =>{

//     })
// })
// c("#dropDownAlter1").addEventListener("click", () => {
//     // cs(".drop-down-alter").forEach((item) => {
//     cs(".drop-down-alter")[0].classList.toggle("drop-down-alter--active");

//     setTimeout(function () {
//         cs(".drop-down-alter")[0].classList.remove("drop-down-alter--active");
//     }, 3000); // O menu vai fechar em 5 segudos

// });


c("#dropDown").addEventListener("click", () => {

    cs(".drop-down")[0].classList.add("drop-down--active");

    setTimeout(function () {
        cs(".drop-down")[0].classList.remove("drop-down--active");
    }, 3000); // O menu vai fechar em 5 segudos

});





//--------------------------------------------------------

c("#link-profile").addEventListener("click", () => {
    window.location.href = "./perfil.html"
})


cs('select').forEach((e) => {
    e.addEventListener('change', (e) => {
        if (e.target.value != '0')
            e.target.style.color = 'black'; // Cor padrão para as demais opções

    });
})


// abre e fecha aside (barra lateral)
c("#toggleBtn").addEventListener("click", fnAside);

function fnAside() {
    c(".sidebar").classList.toggle("open");
    c(".coll-icon").classList.toggle("close");
}

function fnFechaAside() {
    c(".sidebar").classList.remove("open");
    c(".coll-icon").classList.add("close");
}




function fnOpenDesc(task) {
    // let check = e.currentTarget
    console.log(task.currentTarget)
    c(".task-body-descricao").classList.toggle("open")
}

c("#btnCloseModalCofirm").addEventListener("click", fnModalConfirm)

function fnModalConfirm() {
    const bkcoll = c(".shadow-modal-comfirm")

    if (bkcoll.classList.contains("fade-in")) {
        // bkcoll.style.display = "none"
        bkcoll.classList.remove("fade-in")
        c("body").style.overflow = "auto"
        fnLimpaTxtTar()
        fnLimpaTxtColl()
    }
    else {
        // bkcoll.style.display = "flex"
        bkcoll.classList.add("fade-in")
        c("body").style.overflow = "hidden"
        scroll(0, 0)
    }
}

c("#btnModalColl").addEventListener("click", fnModalColl)
c(".close-modal-coll").addEventListener("click", fnModalColl)

function fnModalColl() {
    const bkcoll = c(".shadow-modal-coll")

    if (bkcoll.classList.contains("fade-in")) {
        // bkcoll.style.display = "none"
        bkcoll.classList.remove("fade-in")
        c("body").style.overflow = "auto"
        c(".modal-collection-form h1").innerHTML = "Vamos criar uma <br />coleção de tarefas"
        c("#btnAddCol").innerHTML = "Criar"
        fnLimpaTxtColl()
    }
    else {
        // bkcoll.style.display = "flex"
        bkcoll.classList.add("fade-in")
        c("body").style.overflow = "hidden"
        scroll(0, 0)
    }
}

c("#btnModalTask").addEventListener("click", fnModalTask)

c(".close-modal-task").addEventListener("click", fnModalTask)

function fnModalTask() {

    const bkcoll = c(".shadow-modal-task")

    if (bkcoll.classList.contains("fade-in")) {
        // bkcoll.style.display = "none"
        bkcoll.classList.remove("fade-in")
        c("body").style.overflow = "auto"
        fnLimpaTxtTar()
    }
    else {
        // bkcoll.style.display = "flex"
        bkcoll.classList.add("fade-in")
        c("#txtColl").value = idColl
        c("body").style.overflow = "hidden"
        scroll(0, 0)
    }
}