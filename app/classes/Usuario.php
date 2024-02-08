<?php

class Usuario
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

    public function criarUsuario($nome, $email, $senha)
    {
        try {
            $sql = "INSERT INTO usuario (USRNOME, USREMAIL, USRSENHA) VALUES (:nome, :email, :senha)";
            $stmt = $this->conexao->prepare($sql);
            /*
                existe dois metodos:
                conexao->prepare() | uso quando na minha query tem valores para ser subtituidos (:valor1, :valor2), 
                no caso do prepare, atribuimos ele a uma variavel, pois usaremos as informações desse comando 
                e atraves dessa variavel vamos fazer a atribuição de valor
                conexao->query()   | uso quando não tenho nenhum valor para substituir
            */
            $stmt->bindParam(":nome", $nome);

            /**
             * exite o 'bindParam' que só aceita variavel e existe o 'bindValue' que aceita tanto variavel tanto texto, função e etc
             */
            $stmt->bindParam(":email", $email);
            $stmt->bindValue(":senha", md5($senha));

            $status = $stmt->execute();

            if ($status == 1) {
                $response = ["code" => 1];

                $this->setLastId($this->conexao->lastInsertId());
            } else {
                $response = ["code" => 0];
            }

            return json_encode($response);

        } catch (PDOException $e) {
            return json_encode(["code" => $e->getCode(), "message" => "Erro ao criar usuário: " . $e->getMessage()]);
        }
    }

    private function setLastId($id)
    {
        $this->id = $id;
    }

    public function getLastId()
    {
        return $this->id;
    }

    public function loginUsuario($email, $senha)
    {
        try {
            $sql = "SELECT USRCODIGO, USRNOME FROM usuario WHERE USREMAIL = :email AND USRSENHA = :senha  LIMIT 1";
            $stmt = $this->conexao->prepare($sql);

            $stmt->bindParam(":email", $email);
            $stmt->bindValue(":senha", md5($senha));
            $status = $stmt->execute();


            if ($status == 1) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                if (isset($usuario['USRCODIGO'])) {
                    $response = ["code" => 1, "id" => $usuario['USRCODIGO'], "nome" => $usuario['USRNOME']];
                } else {
                    $response = ["code" => 2];
                }
                
            }

            return json_encode($response);

        } catch (PDOException $e) {
            return json_encode(["code" => $e->getCode(), "message" => "Erro ao logar: " . $e->getMessage()]);
        }
    }

    public function buscarUsuarioPorId($id)
    {
        try {
            $sql = "SELECT * FROM usuario WHERE USRCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);
            $stmt->execute(); //execute e guarda o resultado da execução na variavel, pega a informação e guarda na stmt
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result; //fetch é pra quando vem apenas uma linha do banco de dados,  vai pegar a informação que vem do banco de tranformar em array
            //por padrão o fetch tras 2 tipos de array para cada dado, tanto com index tanto com o nome
            // [0] -> 1 || [id] -> 1
            //para economizar memoria, usamos PDO::FETCH_ASSOC, ele vai trazer apenas o array associativo ,,, [id] -> 1
            
        } catch (PDOException $e) {
            die("Erro ao buscar usuário por ID: " . $e->getMessage());
        }
    }

    
    public function atualizaNomeUsuario($id, $nome)
    {
        try {
            $sql = "UPDATE usuario SET USRNOME = :nome WHERE USRCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":nome", $nome);
            $stmt->bindParam(":id", $id);
            $retorno = $stmt->execute();

            if ($retorno == 1) {
                $response = ["code" => 1];
            } else {
                $response = ["code" => 0];
            }

            return $response;

        } catch (PDOException $e) {
            die("Erro ao atualizar usuário: " . $e->getMessage());
        }
    }

    public function atualizaSenhaUsuario($senha, $id)
    {
        try {
            $sql = "UPDATE usuario SET USRSENHA = :senha WHERE USRCODIGO = :id";
            $stmt = $this->conexao->prepare($sql);
            $stmt->bindValue(":senha", md5($senha));
            $stmt->bindParam(":id", $id);

            $retorno = $stmt->execute();

            if ($retorno == 1) {
                $response = ["code" => 1];
            } else {
                $response = ["code" => 0];
            }

            return $response;
            
        } catch (PDOException $e) {
            die("Erro ao atualizar usuário: " . $e->getMessage());
        }
    }
    
    public function qtdTarColUsuario($id)
    {
        try {
            $sql = "SELECT COUNT(DISTINCT c.colcodigo) AS total_colecoes, COUNT(t.tarcodigo) AS total_tarefas, SUM(t.TARCONCLUIDA) as total_concluidas 
            FROM usuario u 
            LEFT JOIN colecao c ON u.usrcodigo = c.colusuario 
            LEFT JOIN tarefa t ON c.colcodigo = t.tarcolecao 
            WHERE u.usrcodigo = :id";

            $stmt = $this->conexao->prepare($sql);
            $stmt->bindParam(":id", $id);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result;
        } catch (PDOException $e) {
            die("Erro ao listar usuários: " . $e->getMessage());
        }
    }

}