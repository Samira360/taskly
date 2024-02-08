<?php


session_start();

if(isset($_SESSION["USUARIO"]) && $_SESSION["USUARIO"] != ""){

    session_destroy();

    echo json_encode(["code" => 1,"msg" => "Sessão fechada com sucesso! essa é a sessao "]);
}else{
    header("Location: ../../index.html");
    exit;
}