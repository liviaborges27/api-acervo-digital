// Importa a classe Aluno do model — é daqui que vêm os métodos de acesso ao banco de dados
import Aluno from "../model/Aluno.js";
// Importa os tipos Request e Response do Express — representam a requisição e a resposta HTTP
// "type" indica que é uma importação apenas de tipo (só existe em tempo de compilação, não gera código JS)
import { type Request, type Response } from "express";
// Importa o tipo AlunoDTO para tipar os dados recebidos do front-end
import type AlunoDTO from "../dto/AlunoDTO.js";

// Define a classe AlunoController que HERDA da classe Aluno
// Isso permite que o controller acesse diretamente os métodos estáticos do model (listarAlunos, cadastrarAluno, etc.)
// A arquitetura MVC separa responsabilidades: o Model cuida do banco, o Controller cuida das requisições HTTP
class AlunoController extends Aluno {

    /**
     * Lista todos os alunos.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de alunos em formato JSON.
     */
    // Método estático e assíncrono — recebe a requisição HTTP e devolve a resposta com todos os alunos
    static async todos(req: Request, res: Response) {
        try {
            // Chama o método herdado do model Aluno para buscar todos os alunos ativos no banco
            const listaDeAlunos = await Aluno.listarAlunos();
            // Retorna a lista em formato JSON com status HTTP 200 (OK — requisição bem-sucedida)
            res.status(200).json(listaDeAlunos);
             if (!listaDeAlunos) {
            console.warn(`[todos] Nenhum dado retornado pelo model.`);
            res.status(500).json({ mensagem: "Erro ao recuperar a lista de alunos." });
            return;
        }
        } catch (error) {
            // Se ocorrer qualquer erro, exibe os detalhes no console do servidor para facilitar o debug
             console.error(`Erro ao acessar método herdado: ${error}`);
            // Retorna uma mensagem de erro em JSON com status HTTP 500 (Internal Server Error)
            res.status(500).json("Erro ao recuperar as informações do aluno.");
        }
    }

    /**
     * Retorna informações de um aluno
     * @param req Objeto de requisição HTTP
     * @param res Objeto de resposta HTTP.
     * @returns Informações de aluno em formato JSON.
     */
    // Método que busca um único aluno com base no ID informado na URL (ex: GET /aluno/5)
    static async aluno(req: Request, res: Response) {
    try {
        // 1. Validação de Entrada: Convertendo e verificando se o ID é um número válido.
        // O uso do Number() é mais rigoroso que parseInt() para evitar "123xyz" virar 123.
        const idAluno = Number(req.params.id);

        if (isNaN(idAluno)) {
            return res.status(400).json({ mensagem: "O ID fornecido é inválido. Deve ser um número." });
        }

        // 2. Performance e Busca: Chamada ao Model.
        // Dica de performance: Certifique-se que a coluna 'id' no banco possui um ÍNDICE.
        const aluno = await Aluno.listarAluno(idAluno);

        // 3. Verificação de Existência: Se o banco retornar null/undefined, 
        // o status correto é 404 (Not Found), não 200.
        if (!aluno) {
            return res.status(404).json({ mensagem: "Aluno não encontrado." });
        }

        // 4. Resposta de Sucesso: Retornamos o objeto de forma clara.
        return res.status(200).json(aluno);

    } catch (error) {
        // 5. Tratamento de Erro: Logamos o erro internamente para depuração,
        // mas não expomos detalhes sensíveis do banco para o cliente.
        console.error(`[ERRO NO CONTROLLER ALUNO]: ${error}`);
        
        return res.status(500).json({ 
            mensagem: "Erro interno ao recuperar as informações do aluno.",
            erro: process.env.NODE_ENV === 'development' ? error : {} 
        });
    }
}

    /**
      * Cadastra um novo aluno.
      * @param req Objeto de requisição HTTP com os dados do aluno.
      * @param res Objeto de resposta HTTP.
      * @returns Mensagem de sucesso ou erro em formato JSON.
      */
    // Método que recebe os dados do front-end e cria um novo aluno no banco de dados
    static async cadastrar(req: Request, res: Response) {
    try {
        // 1. Desestruturação e Tipagem: Extraímos apenas o necessário do body.
        // Isso evita que campos maliciosos ou desnecessários entrem na lógica.
        const { nome, sobrenome, data_nascimento, endereco, email, celular }: AlunoDTO = req.body;

        // 2. Validação de Campos Obrigatórios: Importante para evitar erros de "null constraint" no banco.
        if (!nome || !sobrenome) {
            return res.status(400).json({ 
                mensagem: "Campos obrigatórios (nome e sobrenome) não foram preenchidos." 
            });
        }

        // 3. Instanciação com Valores Padrão: 
        // Usamos uma abordagem limpa para tratar valores opcionais.
        const novoAluno = new Aluno(
            nome,
            sobrenome,
            data_nascimento ? new Date(data_nascimento) : new Date("1900-01-01"),
            endereco ?? '',
            email ?? '',
            celular
        );

        // 4. Persistência: Chamada ao Model.
        const result = await Aluno.cadastrarAluno(novoAluno);

        // 5. Resposta Semântica: 
        // Se o recurso foi criado, retornamos 201 (Created).
        if (result) {
            return res.status(201).json({ mensagem: "Aluno cadastrado com sucesso!" });
        }

        // Caso o banco retorne false por algum motivo de regra de negócio interna.
        return res.status(422).json({ mensagem: "Não foi possível processar o cadastro do aluno." });

    } catch (error) {
        // 6. Log Profissional: console.error para rastreamento em ferramentas de monitoramento.
        console.error(`[ERRO NO CADASTRO DE ALUNO]: ${error}`);
        
        return res.status(500).json({ 
            mensagem: "Erro interno ao processar o cadastro.",
            detalhes: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
}

    /**
     * Remove um aluno.
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    // Método que recebe um ID pela URL e realiza a remoção lógica do aluno no banco
    // "Promise<Response>" indica que este método sempre retorna uma resposta HTTP ao final
  static async remover(req: Request, res: Response): Promise<Response> {
    try {
        // 1. Validação de Entrada: Convertendo e verificando a validade do ID.
        // O Number() evita problemas com strings alfanuméricas que o parseInt aceitaria.
        const idAluno = Number(req.params.id);

        if (isNaN(idAluno)) {
            return res.status(400).json({ mensagem: "ID inválido. A remoção requer um identificador numérico." });
        }

        // 2. Execução da Remoção: 
        // Aqui o Model deve tratar se a remoção é física (DELETE) ou lógica (UPDATE status = inativo).
        const result = await Aluno.removerAluno(idAluno);

        // 3. Verificação de Sucesso:
        if (result) {
            // Ajustado para status 200 (OK), mais adequado semanticamente para exclusão com resposta JSON.
            return res.status(200).json({ mensagem: "Aluno removido com sucesso." });
        }

        // 4. Caso o ID não exista no banco:
        // O status 404 indica que o recurso que se tentou deletar não foi encontrado.
        return res.status(404).json({ mensagem: "Aluno não encontrado ou já removido." });

    } catch (error) {
        // 5. Log e Tratamento de Erros:
        // console.error ajuda na filtragem de logs em produção.
        console.error(`[ERRO NA REMOÇÃO DE ALUNO]: ${error}`);
        
        return res.status(500).json({ 
            mensagem: "Erro interno ao processar a remoção do aluno." 
        });
    }
}

    /**
     * Método para atualizar o cadastro de um aluno.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    // Método que recebe os novos dados do front-end e atualiza o cadastro do aluno no banco
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            // Lê o corpo da requisição e tipifica como AlunoDTO
            // O front-end envia os dados atualizados no corpo da requisição
            const dadosRecebidos: AlunoDTO = req.body;

            // Cria um novo objeto Aluno com os dados atualizados recebidos do front-end
            // Mesma lógica do método cadastrar — usa "??" para garantir valores padrão nos campos opcionais
            const aluno = new Aluno(
                dadosRecebidos.nome,
                dadosRecebidos.sobrenome,
                dadosRecebidos.data_nascimento ?? new Date("1900-01-01"),
                dadosRecebidos.endereco ?? '',
                dadosRecebidos.email ?? '',
                dadosRecebidos.celular
            );

            // Define o ID do aluno no objeto criado, lendo o parâmetro "id" da URL
            // Isso é necessário para que o model saiba QUAL aluno deve ser atualizado no banco
            // Exemplo de URL: PUT /aluno/7  →  setIdAluno(7)
            const idAluno = parseInt(req.params.id as string);
            if (isNaN(idAluno)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }
            aluno.setIdAluno(idAluno);

            // Chama o método do model para atualizar os dados do aluno no banco de dados
            const result = await Aluno.atualizarAluno(aluno);

            // Verifica o retorno do model: true = atualização bem-sucedida, false = falha
            if (result) {
                // Retorna mensagem de sucesso com status HTTP 200 (OK)
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                // Retorna mensagem de erro com status HTTP 500 se o banco não conseguiu atualizar
                return res.status(500).json({ mensagem: 'Não foi possível atualizar o aluno no banco de dados.' });
            }
        } catch (error) {
            // Registra o erro nos logs do servidor
            console.error(`Erro ao atualizar aluno: ${error}`);
            // Retorna mensagem de erro com status HTTP 500 em caso de exceção inesperada
            return res.status(500).json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

// Exporta a classe AlunoController para que possa ser importada e usada nas rotas da aplicação
export default AlunoController;