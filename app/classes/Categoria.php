<?php

class Categoria{
    private $conexao;

    public function __construct()
    {
        try {
            $this->conexao = new PDO("mysql:host=127.0.0.1;dbname=taskly", "root", "");
            $this->conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Erro de conexão com o banco de dados: " . $e->getMessage());
        }
    }

    public function listarCategoria()
    {
        try {
            $sql = "SELECT * FROM categoria";
            $stmt = $this->conexao->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC); //fetchAll é pra quando vem varias linhas no banco de dados, vai pegar a informação que vem do banco de tranformar em array

            return $result;

        } catch (PDOException $e) {
            die("Erro ao listar usuários: " . $e->getMessage());
        }
    }
}