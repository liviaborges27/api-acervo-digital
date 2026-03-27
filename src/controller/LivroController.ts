import Livro from "../model/Livro.js";
import { type Request, type Response } from "express";
import type LivroDTO from "../dto/LivroDTO.js";

/**
 * Controller responsável por gerenciar as requisições de Livros.
 * Centraliza a lógica de validação de entrada e formatação de resposta.
 */
class LivroController extends Livro {

    /**
     * Recupera todos os livros ativos.
     */
    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaDeLivros = await Livro.listarLivros();
            return res.status(200).json(listaDeLivros);
        } catch (error) {
            console.error(`[ERRO: LISTAR LIVROS]: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao recuperar a lista de livros." });
        }
    }

    /**
     * Busca um livro específico pelo ID.
     */
    static async livro(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = Number(req.params.id);

            if (isNaN(idLivro)) {
                return res.status(400).json({ mensagem: "ID inválido. Deve ser um número." });
            }

            const livro = await Livro.listarLivro(idLivro);

            if (!livro) {
                return res.status(404).json({ mensagem: "Livro não encontrado." });
            }

            return res.status(200).json(livro);
        } catch (error) {
            console.error(`[ERRO: BUSCAR LIVRO]: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao buscar informações do livro." });
        }
    }

    /**
     * Realiza o cadastro de um novo livro.
     */
    static async cadastrar(req: Request, res: Response): Promise<Response> {
        try {
            const { titulo, autor, editora, ano_publicacao, isbn, quant_total, quant_disponivel, quant_aquisicao, valor_aquisicao }: LivroDTO = req.body;

            // Validação simples de campos obrigatórios
            if (!titulo || !autor || !isbn) {
                return res.status(400).json({ mensagem: "Título, Autor e ISBN são obrigatórios." });
            }

            const novoLivro = new Livro(
                titulo,
                autor,
                editora,
                (ano_publicacao ?? 0).toString(),
                isbn,
                quant_total,
                quant_disponivel,
                quant_aquisicao,
                valor_aquisicao ?? 0
            );

            const result = await Livro.cadastrarLivro(novoLivro);

            if (result) {
                // Status 201 é o correto para criação de recursos
                return res.status(201).json({ mensagem: "Livro cadastrado com sucesso." });
            }

            return res.status(422).json({ mensagem: "Não foi possível processar o cadastro do livro." });
        } catch (error) {
            console.error(`[ERRO: CADASTRAR LIVRO]: ${error}`);
            return res.status(500).json({ mensagem: "Erro interno ao cadastrar livro." });
        }
    }

    /**
     * Remove (desativa) um livro pelo ID.
     */
    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = Number(req.params.id);

            if (isNaN(idLivro)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const result = await Livro.removerLivro(idLivro);

            if (result) {
                // Ajustado para 200, pois 201 é criação
                return res.status(200).json({ mensagem: "Livro removido com sucesso." });
            }

            return res.status(404).json({ mensagem: "Livro não encontrado para exclusão." });
        } catch (error) {
            console.error(`[ERRO: REMOVER LIVRO]: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao remover o livro." });
        }
    }

    /**
     * Atualiza os dados de um livro existente.
     */
    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idLivro = Number(req.params.id);
            const dados: LivroDTO = req.body;

            if (isNaN(idLivro)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const livro = new Livro(
                dados.titulo,
                dados.autor,
                dados.editora,
                (dados.ano_publicacao ?? 0).toString(),
                dados.isbn,
                dados.quant_total,
                dados.quant_disponivel,
                dados.quant_aquisicao,
                dados.valor_aquisicao ?? 0
            );
            livro.setIdLivro(idLivro);

            const sucesso = await Livro.atualizarLivro(livro);

            if (sucesso) {
                return res.status(200).json({ mensagem: "Livro atualizado com sucesso!" });
            }

            return res.status(404).json({ mensagem: "Livro não encontrado para atualização." });
        } catch (error) {
            console.error(`[ERRO: ATUALIZAR LIVRO]: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar o livro." });
        }
    }
}

export default LivroController;