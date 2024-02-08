<?php

session_start();

if (isset($_SESSION["USUARIO"]) && $_SESSION["USUARIO"] != "")
    echo json_encode(["code" => 1, "nome" => $_SESSION["NOME"]]);
else
    echo json_encode(["code" => 0]);