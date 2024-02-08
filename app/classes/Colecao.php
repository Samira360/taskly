<?php

class Colecao
{
    private $conexao;
    private $id;
    
    public function __construct()
    {
        try {
            $this->conexao = new PDO("mysql:host=127.0.0.1;dbname=taskly", "root", "");
            $this->conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Erro de conexão com o banco de dados: " . $e->getMessage());
        }
    }

    public function criarColecao($titulo, $categoria, $user)
    {
        try {
            $sql = "INSERT INTO colecao (COLTITULO, COLCATEGORIA, COLUSUARIO) VALUES (:titulo, :categoria, :user)";
            $stmt = $this->conexao->prepare($sql); 
           
            $stmt->bindParam(":titulo", $titulo); 
            $stmt->bindParam(":categoria", $categoria);
            $stmt->bindValue(":user", $user);
            
            $status = $stmt->execute();

            if($status == 1)
                $response = ["code" => 1];
            
            return json_encode($response);

        } catch (PDOException $e) {
            return json_encode(["code" => $e->getCode(), "message" => "Erro ao criar coleção: ". $e->getMessage()]);
        }
    }

    public function listarColecao($id)
    {
        try {
            $sql = "SELECT COL.*, CATCOR FROM colecao COL LEFT JOIN categoria on COLCATEGORIA = CATCODIGO WHERE COLUSUARIO = :id"; //"SELECT * FROM colecao WHERE COLUSUARIO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);

            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $result;
        } catch (PDOException $e) {
            die("Erro ao listar coleções: " . $e->getMessage());
        }
    }
    
    public function buscarColecaoPorId($idColl, $idUser)
    {
        try {
            $sql = "SELECT * FROM colecao WHERE COLCODIGO = :idcoll AND COLUSUARIO = :iduser";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":idcoll", $idColl);
            $stmt->bindParam(":iduser", $idUser);
            $stmt->execute(); //execute e guarda o resultado da execução na variavel, pega a informação e guarda na stmt
            return $stmt->fetch(PDO::FETCH_ASSOC); //fetch é pra quando vem apenas uma linha do banco de dados,  vai pegar a informação que vem do banco de tranformar em array
            //por padrão o fetch tras 2 tipos de array para cada dado, tanto com index tanto com o nome
            // [0] -> 1 || [id] -> 1
            //para economizar memoria, usamos PDO::FETCH_ASSOC, ele vai trazer apenas o array associativo ,,, [id] -> 1
        } catch (PDOException $e) {
            die("Erro ao buscar coleção por ID: " . $e->getMessage());
        }
    }
    
    public function atualizarColecao($titulo, $tipo, $idColl, $idUser)
    {
        try {
            $sql = "UPDATE colecao SET COLTITULO = :titulo, COLCATEGORIA = :categoria WHERE COLCODIGO = :idcoll AND COLUSUARIO = :iduser";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":titulo", $titulo);
            $stmt->bindParam(":categoria", $tipo);
            $stmt->bindParam(":idcoll", $idColl);
            $stmt->bindParam(":iduser", $idUser);
            $response = $stmt->execute();

            if($response == 1){
                $response = ["code" => 1];
            }else{
                $response = ["code" => 0];
            }

            return json_encode($response);
        } catch (PDOException $e) {
            die("Erro ao atualizar coleção: " . $e->getMessage());
        }
    }
    
    public function apagaColecao($idColl)
    {
        try {
            $this->conexao->beginTransaction();

            $sql = "DELETE FROM tarefa WHERE TARCOLECAO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $idColl);
            $result = $stmt->execute();

            if($result == 1){
                $sql = "DELETE FROM colecao WHERE COLCODIGO = :id";
                $stmt = $this->conexao->prepare($sql);
                $stmt->bindParam(":id", $idColl);
                $result = $stmt->execute();

            }else{
                $result = 0;
                $this->conexao->rollBack();
            }

            if($result == 1){
                $result = ["code" => 1];
                $this->conexao->commit();
            }else{
                $result = ["code" => 0];
            }

            return json_encode($result);  
                      
        } catch (PDOException $e) {
            die("Erro ao deletar coleção: " . $e->getMessage());
        }
    }

}