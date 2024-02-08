<?php

session_start();

require "../classes/Usuario.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        buscaDadosUsuario();
        break;
    case 'POST':
        atualizaUsuario();
        break;
    case 'PUT':
        altualizaUsuario();
        break;
    // default:
    //     apagaTarefa();
    //     break;
}


function altualizaUsuario()
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["nome"])) {
        $user = new Usuario();

        $retorno = $user->atualizaNomeUsuario($_SESSION["USUARIO"], $data["nome"]);

        if ($retorno["code"] == 1) {
            $nome = explode(" ", $data["nome"]);
            $_SESSION['NOME'] = $nome[0];
            echo json_encode(["code" => $retorno["code"], "message" => "Nome alterado com sucesso!"]);

        } else {
            echo json_encode(["code" => $retorno["code"], "message" => "Erro ao tentar alterar o nome"]);
        }
    }
}

function buscaDadosUsuario()
{
    if (isset($_SESSION['USUARIO'])) {

        $user = new Usuario();

        $dadosUser = $user->buscarUsuarioPorId($_SESSION['USUARIO']);
        $qtds = $user->qtdTarColUsuario($_SESSION['USUARIO']);

        echo json_encode(["dadosUser" => $dadosUser, "qtds" => $qtds]);

    } else {
        header("Location: ../../index.html");
        exit;
    }
}

function atualizaUsuario(){
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["senhaAntiga"]) && !empty($data["senhaNova"])) {

        $user = new Usuario();

        $retorno = $user->buscarUsuarioPorId($_SESSION["USUARIO"]);

        if (md5($data["senhaAntiga"]) == $retorno["USRSENHA"]) {
           
            $retorno = $user->atualizaSenhaUsuario($data["senhaNova"],$_SESSION["USUARIO"]);

            if($retorno["code"] == 1){
                echo json_encode(["code" => 1, "message" => "Senha alterada com sucesso!"]);
            }else{
                echo json_encode(["code" => 3, "message" => "Falha ao alterar senha!"]);
            }
        } else {
            echo json_encode(["code" => 2, "message" => "Senha atual está incorreta."]);
        }
    }
}

