<?php

require "../classes/Categoria.php";

$categoria = new Categoria();

$dados = $categoria->listarCategoria();

echo json_encode($dados);


