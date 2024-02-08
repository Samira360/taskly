<?php

class Tarefa
{
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

    public function listarTarefas($id)
    {
        try {
            $sql = "SELECT * FROM tarefa WHERE TARCOLECAO = :id ";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);

            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;

        } catch (PDOException $e) {
            die("Erro ao listar usuários: " . $e->getMessage());
        }
    }

    public function criarTarefa($titulo, $prioridade, $data, $desc, $status, $col)
    {
        try {
            $sql = "INSERT INTO tarefa (TARTITULO, TARPRIORIDADE, TARDATA, TARDESC, TARCONCLUIDA, TARCOLECAO) VALUES (:titulo, :priori, :dt, :descr, :stts, :col )";
            $stmt = $this->conexao->prepare($sql);

            $stmt->bindParam(":titulo", $titulo);
            $stmt->bindParam(":priori", $prioridade);
            $stmt->bindParam(":dt", $data);
            $stmt->bindParam(":descr", $desc);
            $stmt->bindParam(":stts", $status);
            $stmt->bindParam(":col", $col);

            $status = $stmt->execute();

            if ($status == 1) {
                $response = ["code" => 1];
            } else {
                $response = ["code" => 0];
            }

            return json_encode($response);

        } catch (PDOException $e) {
            return json_encode(["code" => $e->getCode(), "message" => "Erro ao criar Tarefa: " . $e->getMessage()]);
        }
    }


    public function atualizaEstado($valor, $id)
    {
        try {
            $sql = "UPDATE tarefa SET TARCONCLUIDA = :valor WHERE TARCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":valor", $valor);
            $stmt->bindParam(":id", $id);

            $status = $stmt->execute();

            if ($status == 1) {
                $response = ["code" => 1];
            } else {
                $response = ["code" => 0];
            }

            return json_encode($response);

        } catch (PDOException $e) {
            return json_encode(["code" => $e->getCode(), "message" => "Erro ao atulizar Tarefa: " . $e->getMessage()]);
        }
    }


    public function buscarTarefaPorId($id)
    {
        try {
            $sql = "SELECT * FROM tarefa WHERE TARCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result;
        } catch (PDOException $e) {
            die("Erro ao buscar tarefa por ID: " . $e->getMessage());
        }
    }

    public function atualizarTarefa($titulo, $prioridade, $dt, $desc, $idTar)
    {
        try {
            $sql = "UPDATE tarefa SET TARTITULO = :titulo, TARPRIORIDADE = :prioridade, TARDATA = :dt, TARDESC = :descri WHERE TARCODIGO = :idTar";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":titulo", $titulo);
            $stmt->bindParam(":prioridade", $prioridade);
            $stmt->bindParam(":dt", $dt);
            $stmt->bindParam(":descri", $desc);
            $stmt->bindParam(":idTar", $idTar);
            $response = $stmt->execute();

            if ($response == 1) {
                $response = ["code" => 1];
            } else {
                $response = ["code" => 0];
            }

            return json_encode($response);
        } catch (PDOException $e) {
            die("Erro ao atualizar tarefa: " . $e->getMessage());
        }
    }

    public function apagaTarefa($idTar)
    {
        try {
            $sql = "DELETE FROM tarefa WHERE TARCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $idTar);
            $result = $stmt->execute();

            if ($result == 1) {
                $result = ["code" => 1];
            } else {
                $result = ["code" => 0];
            }

            return json_encode($result);

        } catch (PDOException $e) {
            die("Erro ao deletar usuário: " . $e->getMessage());
        }
    }
}