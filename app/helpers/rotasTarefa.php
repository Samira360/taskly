<?php


require "../classes/Tarefa.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        buscaDadosTarefa();
        break;
    case 'POST':
        adicionaTarefa();
        break;
    case 'PUT':
        altualizaTarefa();
        break;
    default:
        apagaTarefa();
        break;
}

function apagaTarefa()
{
    if (isset($_GET['idTar'])) {

        $tarefa = new Tarefa();

        $retorno = $tarefa->apagaTarefa($_GET['idTar']);

        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Tarefa apagada com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);
    }
}


function buscaDadosTarefa()
{
    if (isset($_GET["idColl"]) && $_GET["idColl"] != "" || isset($_GET["idTar"]) && $_GET["idTar"] != "") {

        $tarefa = new Tarefa();

        if (isset($_GET['idTar'])) {
            $dados = $tarefa->buscarTarefaPorId($_GET['idTar']);
        } else {
            $dados = $tarefa->listarTarefas($_GET["idColl"]);
        }

        echo json_encode($dados);
    } else {
        header("Location: ../../index.html");
        exit;
    }
}

function altualizaTarefa()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['status']) && $data["status"] !== "" && $data["idTar"] !== "" || !empty($data["titulo"]) && !empty($data["priori"]) && !empty($data["idTar"])) {

        $tarefa = new Tarefa();

        if (isset($data['status'])) {
            $retorno = $tarefa->atualizaEstado($data["status"], $data["idTar"]);
        } else {
            $titulo = $data["titulo"];
            $prioridade = $data["priori"];
            $dt = $data["dt"];
            $desc = $data['desc'];
            $idTar = $data['idTar'];

            $retorno = $tarefa->atualizarTarefa($titulo, $prioridade, $dt, $desc, $idTar);
        }


        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Tarefa atualizada com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Erro ao arualizar tarefa"]);

    } else {
        echo json_encode(["code" => "3", "message" => "Por favor, preencha todos os campos obrigatórios antes de prosseguir."]);
    }
}


function adicionaTarefa()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["titulo"]) && !empty($data["priori"]) && !empty($data["idColl"])) {
        $titulo = $data["titulo"];
        $prioridade = $data["priori"];
        $dt = $data["dt"];
        $desc = $data["desc"];
        $coll = $data['idColl'];


        $user = new Tarefa();

        $retorno = $user->criarTarefa($titulo, $prioridade, $dt, $desc, 0, $coll);

        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Tarefa inserida com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);

    } else {
        echo json_encode(["code" => "3", "message" => "Por favor, preencha todos os campos obrigatórios antes de prosseguir."]);
    }
}