<?php

session_start();

require "../classes/Colecao.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'PUT':
        alteraColecao();
        break;
    case 'POST':
        adicionaColecao();
        break;
    case 'GET':
        buscaDadosColecao();
        break;
    default:
        apagaColecao();
        break;
}


function apagaColecao()
{

    if (isset($_GET['idColl'])) {

        $colecao = new Colecao();

        $retorno = $colecao->apagaColecao($_GET['idColl']);

        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Coleção apagada com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);
    }
}


function alteraColecao()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["titulo"]) && !empty($data["categoria"]) && !empty($data["idColl"])) {
        $titulo = $data["titulo"];
        $categoria = $data["categoria"];
        $idColl = $data["idColl"];
        $idUser = $_SESSION['USUARIO'];


        $user = new Colecao();

        $retorno = $user->atualizarColecao($titulo, $categoria, $idColl, $idUser);

        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Coleção alterada com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);

    } else {
        echo json_encode(["code" => "3", "message" => "Por favor, preencha todos os campos obrigatórios antes de prosseguir."]);
    }
}



function buscaDadosColecao()
{
    $colecao = new Colecao();

    if (isset($_GET['idColl'])) {
        $dados = $colecao->buscarColecaoPorId($_GET['idColl'], $_SESSION['USUARIO']);
    } else {
        $dados = $colecao->listarColecao($_SESSION['USUARIO']);
    }
    // foreach($dados as $key){ 
    //     echo ($key["COLTITULO"]."\n");
    // }

    echo json_encode($dados);

}



function adicionaColecao()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["titulo"]) && !empty($data["categoria"])) {
        $titulo = $data["titulo"];
        $categoria = $data["categoria"];
        $id = $_SESSION['USUARIO'];


        $user = new Colecao();

        $retorno = $user->criarColecao($titulo, $categoria, $id);

        $retorno = json_decode($retorno, true);

        if ($retorno["code"] == 1) {
            echo json_encode(["code" => "1", "message" => "Coleção inserida com sucesso!"]);
        } else
            echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);

    } else {
        echo json_encode(["code" => "3", "message" => "Por favor, preencha todos os campos obrigatórios antes de prosseguir."]);
    }
}