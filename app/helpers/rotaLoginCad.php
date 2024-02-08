<?php

session_start();

require "../classes/Usuario.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        loginORcad();
        break;
    case 'GET':
        verifica();
        break;
}

function verifica(){
    header("Location: ../../index.html");
    exit;
}


// verifica se é login ou cadastro

function loginORcad()
{
    $data = json_decode(file_get_contents("php://input"), true);

    
    if ($data['tipo'] == "cadastro") {
        cadastra($data);
    } else {
        login($data);
    }

}


function login($data)
{
    $email = $data["email"];
    $senha = $data["senha"];

    $user = new Usuario();

    $retorno = $user->loginUsuario($email, $senha);

    $retorno = json_decode($retorno, true);

    if ($retorno["code"] == 1) {
        $_SESSION['USUARIO'] = $retorno["id"];
        $nome = explode(" ", $retorno["nome"]);
        $_SESSION['NOME'] = $nome[0];
        echo json_encode(["code" => $retorno["code"], "message" => "Logado!"]);

    } else if ($retorno["code"] == "2") {
        $_SESSION['USUARIO'] = -1;
        unset($_SESSION['NOME']);
        echo json_encode(["code" => $retorno["code"], "message" => "Usuário ou senha inválidos"]);
    } else {
        $_SESSION['USUARIO'] = -1;
        unset($_SESSION['NOME']);
        echo json_encode(["code" => $retorno["code"], "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);

    }

}

function cadastra($data)
{

    $nome = $data["nome"];
    $email = $data["email"];
    $senha = $data["senha"];

    $user = new Usuario();

    $retorno = $user->criarUsuario($nome, $email, $senha);

    $retorno = json_decode($retorno, true);

    if ($retorno["code"] == 1) {
        $_SESSION['USUARIO'] = $user->getLastId();
        $_SESSION['NOME'] = $nome;
        echo json_encode(["code" => "1", "message" => "Seu cadastro foi concluído com sucesso!"]);
    } else if ($retorno["code"] == "23000")
        echo json_encode(["code" => "23000", "message" => "O e-mail fornecido já está em uso. Por favor, insira um e-mail diferente."]);
    else
        echo json_encode(["code" => "2", "message" => "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde."]);


}