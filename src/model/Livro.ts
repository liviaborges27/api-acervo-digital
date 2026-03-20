// Importa o tipo LivroDTO, que define a estrutura de dados de um livro (objeto simples, sem métodos)
import type LivroDTO from "../dto/LivroDTO.js";
// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel.js";

// Cria uma instância do DatabaseModel e acessa o pool de conexões com o banco de dados
// O "pool" gerencia múltiplas conexões simultâneas de forma eficiente
const database = new DatabaseModel().pool;

// Define a classe Livro, que representa um livro no sistema de biblioteca
class Livro {
    // Atributo privado: ID único do livro no banco de dados (começa em 0, pois ainda não foi salvo)
    private id_livro: number = 0;
    // Atributo privado: Título do livro
    private titulo: string;
    // Atributo privado: Nome do autor do livro
    private autor: string;
    // Atributo privado: Nome da editora responsável pela publicação
    private editora: string;
    // Atributo privado: Ano em que o livro foi publicado (string para suportar formatos como "2024")
    private ano_publicacao: string;
    // Atributo privado: Código ISBN — identificador único internacional de livros
    private isbn: string;
    // Atributo privado: Quantidade total de exemplares do livro no acervo
    private quant_total: number;
    // Atributo privado: Quantidade de exemplares disponíveis para empréstimo no momento
    private quant_disponivel: number;
    // Atributo privado: Valor pago para adquirir o livro
    private valor_aquisicao: number;
    // Atributo privado: Indica se o livro está disponível ou emprestado (começa como "Disponível")
    private status_livro_emprestado: string = "Disponível";
    // Atributo privado: Indica se o livro está ativo no sistema (false = ainda não persistido no banco)
    private status_livro: boolean = false;

    // Construtor: chamado automaticamente ao criar um novo objeto Livro
    constructor(
        _titulo: string,           // Título do livro — obrigatório
        _autor: string,            // Autor do livro — obrigatório
        _editora: string,          // Editora do livro — obrigatório
        _ano_publicacao: string,   // Ano de publicação — obrigatório
        _isbn: string,             // ISBN do livro — obrigatório
        _quant_total: number,      // Quantidade total de exemplares — obrigatório
        _quant_disponivel: number, // Quantidade disponível para empréstimo — obrigatório
        _quant_aquisicao: number,  // Quantidade adquirida (recebido, mas não usado no construtor — ver abaixo)
        _valor_aquisicao: number   // Valor de aquisição — obrigatório
    ) {
        // Atribui os valores recebidos aos atributos internos da classe
        this.titulo = _titulo;
        this.autor = _autor;
        this.editora = _editora;
        this.ano_publicacao = _ano_publicacao;
        this.isbn = _isbn;
        this.quant_total = _quant_total;
        this.quant_disponivel = _quant_disponivel;
        this.valor_aquisicao = _valor_aquisicao;
        // ⚠️ Atenção: o parâmetro "_quant_aquisicao" é recebido mas nunca atribuído a nenhum atributo
        // Isso provavelmente é um esquecimento no código original
    }

    // ==================== GETTERS E SETTERS ====================
    // Métodos públicos para acessar e modificar os atributos privados com segurança

    // Getter: retorna o ID do livro
    public getIdLivro(): number {
        return this.id_livro;
    }
    // Setter: define um novo valor para o ID do livro
    public setIdLivro(value: number) {
        this.id_livro = value;
    }

    // Getter: retorna o título do livro
    public getTitulo(): string {
        return this.titulo;
    }
    // Setter: define um novo título para o livro
    public setTitulo(value: string) {
        this.titulo = value;
    }

    // Getter: retorna o nome do autor do livro
    public getAutor(): string {
        return this.autor;
    }
    // Setter: define um novo autor para o livro
    public setAutor(value: string) {
        this.autor = value;
    }

    // Getter: retorna o nome da editora do livro
    public getEditora(): string {
        return this.editora;
    }
    // Setter: define uma nova editora para o livro
    public setEditora(value: string) {
        this.editora = value;
    }

    // Getter: retorna o ano de publicação do livro
    public getAnoPublicacao(): string {
        return this.ano_publicacao;
    }
    // Setter: define um novo ano de publicação para o livro
    public setAnoPublicacao(value: string) {
        this.ano_publicacao = value;
    }

    // Getter: retorna o ISBN do livro
    public getIsbn(): string {
        return this.isbn;
    }
    // Setter: define um novo ISBN para o livro
    public setIsbn(value: string) {
        this.isbn = value;
    }

    // Getter: retorna a quantidade total de exemplares do livro
    public getQuantTotal(): number {
        return this.quant_total;
    }
    // Setter: define uma nova quantidade total de exemplares
    public setQuantTotal(value: number) {
        this.quant_total = value;
    }

    // Getter: retorna a quantidade de exemplares disponíveis para empréstimo
    public getQuantDisponivel(): number {
        return this.quant_disponivel;
    }
    // Setter: define uma nova quantidade de exemplares disponíveis
    public setQuantDisponivel(value: number) {
        this.quant_disponivel = value;
    }

    // Getter: retorna o valor de aquisição do livro
    public getValorAquisicao(): number {
        return this.valor_aquisicao;
    }
    // Setter: define um novo valor de aquisição para o livro
    public setValorAquisicao(value: number) {
        this.valor_aquisicao = value;
    }

    // Getter: retorna o status de empréstimo do livro (ex: "Disponível", "Emprestado")
    public getStatusLivroEmprestado(): string {
        return this.status_livro_emprestado;
    }
    // Setter: define um novo status de empréstimo para o livro
    public setStatusLivroEmprestado(value: string) {
        this.status_livro_emprestado = value;
    }

    // Getter: retorna se o livro está ativo no sistema (true) ou removido logicamente (false)
    public getStatusLivro(): boolean {
        return this.status_livro;
    }
    // Setter: define o status de atividade do livro no sistema
    public setStatusLivro(value: boolean) {
        this.status_livro = value;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================
    // Métodos "static" pertencem à classe, não ao objeto — são chamados como Livro.listarLivros()

    /**
     * Retorna uma lista com todos os livros cadastrados no banco de dados
     * 
     * @returns Lista com todos os livros cadastrados no banco de dados
     */
    // Método assíncrono que busca todos os livros ativos e retorna uma lista de LivroDTO ou null
    /**
 * Lista todos os livros com status ativo no sistema.
 *
 * @returns Promise com array de LivroDTO em caso de sucesso, ou null em caso de erro.
 *
 * Boas práticas aplicadas:
 * - Tipagem explícita e segura
 * - Query parametrizada (resistente a SQL Injection)
 * - Mapeamento funcional com map() ao invés de forEach + push
 * - Log de erro estruturado com console.error
 * - Seleção explícita de colunas ao invés de SELECT *
 */
static async listarLivros(): Promise<Array<LivroDTO> | null> {
    try {
        // ✅ MELHORIA 1 — Colunas explícitas ao invés de SELECT *
        // Usar SELECT * traz todas as colunas, mesmo as desnecessárias.
        // Listar as colunas garante que você controla exatamente o que vem do banco,
        // evita quebras se novas colunas forem adicionadas e melhora a performance.
        const querySelectLivro = `
            SELECT
                id_livro,
                titulo,
                autor,
                editora,
                ano_publicacao,
                isbn,
                quant_total,
                quant_disponivel,
                quant_aquisicao,
                valor_aquisicao,
                status_livro_emprestado,
                status_livro
            FROM Livro
            WHERE status_livro = TRUE;
        `;

        // Executa a query no banco de dados e aguarda o resultado
        const respostaBD = await database.query(querySelectLivro);

        // ✅ MELHORIA 2 — Verificação antecipada (Early Return)
        // Se não houver linhas retornadas, retorna imediatamente um array vazio.
        // Evita processamento desnecessário e torna a intenção do código mais clara.
        if (!respostaBD.rows || respostaBD.rows.length === 0) {
            return [];
        }

        // ✅ MELHORIA 3 — map() ao invés de forEach + push
        // O método map() é a forma idiomática (padrão da linguagem) de transformar
        // uma lista em outra. É mais legível, funcional e elimina a necessidade de
        // criar uma variável auxiliar vazia antes do try.
        const listaDeLivros: Array<LivroDTO> = respostaBD.rows.map((livro) => {
            // Monta o objeto LivroDTO com os dados da linha atual.
            // LivroDTO é um objeto simples de dados (sem métodos), ideal para
            // transferência de informações entre camadas da aplicação (Model → Controller → Client).
            const livroDTO: LivroDTO = {
                id_livro: livro.id_livro,
                titulo: livro.titulo,
                autor: livro.autor,
                editora: livro.editora,
                ano_publicacao: livro.ano_publicacao,
                isbn: livro.isbn,
                quant_total: livro.quant_total,
                quant_disponivel: livro.quant_disponivel,
                quant_aquisicao: livro.quant_aquisicao,
                valor_aquisicao: livro.valor_aquisicao,
                status_livro_emprestado: livro.status_livro_emprestado,
                status_livro: livro.status_livro,
            };

            return livroDTO;
        });

        // Retorna a lista populada com todos os livros ativos encontrados
        return listaDeLivros;

    } catch (error) {
        // ✅ MELHORIA 4 — console.error ao invés de console.log para erros
        // console.error envia a mensagem para o fluxo de erro padrão (stderr),
        // separando erros de logs informativos. Isso facilita o monitoramento
        // e a integração com ferramentas de observabilidade (ex: Datadog, Sentry).
        console.error(`[LivroModel] Erro ao listar livros: ${error}`);

        // Retorna null para indicar que houve uma falha na consulta
        return null;
    }
}
    /**
     * Retorna as informações de um livro informado pelo ID
     * 
     * @param id_livro Identificador único do livro
     * @returns Objeto com informações do livro
     */
    // Recebe o ID do livro e retorna um único LivroDTO ou null
    /**
 * Busca um livro específico pelo seu ID no banco de dados.
 *
 * @param id_livro - ID numérico do livro a ser buscado
 * @returns Promise com LivroDTO em caso de sucesso, ou null se não encontrado / erro
 *
 * Boas práticas aplicadas:
 * - Colunas explícitas ao invés de SELECT *
 * - Verificação de existência antes de acessar rows[0]
 * - Desestruturação para eliminar repetição de código
 * - Log de erro estruturado com prefixo de contexto
 */
static async listarLivro(id_livro: number): Promise<LivroDTO | null> {
    try {
        // ✅ MELHORIA 1 — Colunas explícitas ao invés de SELECT *
        // Selecionar apenas as colunas necessárias evita tráfego desnecessário de dados
        // entre o banco e a aplicação, e protege contra quebras quando o schema é alterado.
        // O "$1" é um placeholder que o banco substitui pelo valor real — isso impede SQL Injection.
        const querySelectLivro = `
            SELECT
                id_livro,
                titulo,
                autor,
                editora,
                ano_publicacao,
                isbn,
                quant_total,
                quant_disponivel,
                quant_aquisicao,
                valor_aquisicao,
                status_livro_emprestado,
                status_livro
            FROM livro
            WHERE id_livro = $1
              AND status_livro = TRUE;
        `;

        // Executa a query passando o id_livro como parâmetro (substitui o $1)
        const respostaBD = await database.query(querySelectLivro, [id_livro]);

        // ✅ MELHORIA 2 — Verificação de existência antes de acessar rows[0]
        // Sem essa checagem, se nenhum livro for encontrado, respostaBD.rows[0] será
        // undefined — e tentar acessar rows[0].titulo causaria um TypeError em runtime.
        // Retornar null aqui é a forma correta de sinalizar "livro não encontrado".
        if (!respostaBD.rows || respostaBD.rows.length === 0) {
            return null;
        }

        // ✅ MELHORIA 3 — Desestruturação do resultado
        // Ao invés de repetir respostaBD.rows[0] em cada campo do DTO,
        // extraímos o registro em uma variável própria.
        // Isso elimina repetição, reduz chance de erro de digitação e melhora a leitura.
        const livro = respostaBD.rows[0];

        // Monta o objeto LivroDTO com os dados da linha retornada pelo banco.
        // LivroDTO é um objeto simples de dados (sem métodos), ideal para
        // transferir informações entre as camadas da aplicação (Model → Controller → Client).
        const livroDTO: LivroDTO = {
            id_livro:                   livro.id_livro,
            titulo:                     livro.titulo,
            autor:                      livro.autor,
            editora:                    livro.editora,
            ano_publicacao:             livro.ano_publicacao,
            isbn:                       livro.isbn,
            quant_total:                livro.quant_total,
            quant_disponivel:           livro.quant_disponivel,
            quant_aquisicao:            livro.quant_aquisicao,
            valor_aquisicao:            livro.valor_aquisicao,
            status_livro_emprestado:    livro.status_livro_emprestado,
            status_livro:               livro.status_livro,
        };

        // Retorna o DTO preenchido com os dados do livro encontrado
        return livroDTO;

    } catch (error) {
        // ✅ MELHORIA 4 — Log de erro estruturado com contexto
        // Adicionar "[LivroModel]" e o ID consultado facilita rastrear a origem do problema
        // ao analisar logs em produção — especialmente em APIs com múltiplos modelos e rotas.
        console.error(`[LivroModel] Erro ao buscar livro ID ${id_livro}: ${error}`);
        return null;
    }
}
    /**
     * Cadastra um novo livro no banco de dados
     * @param livro Objeto Livro contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    // Recebe um objeto Livro completo e tenta inseri-lo no banco de dados
    static async cadastrarLivro(livro: Livro): Promise<boolean> {
    try {
        // ✅ MELHORIA 1 — Validação de entrada antes de acessar o banco (Fail Fast)
        // Verificar os dados obrigatórios ANTES de montar a query evita enviar uma
        // requisição mal formada ao banco. "Fail fast" significa: falhe o quanto antes,
        // com uma mensagem clara — isso torna o debug muito mais rápido.
        if (!livro.getTitulo() || !livro.getAutor() || !livro.getEditora()) {
            console.error(`[LivroModel] Cadastro rejeitado: campos obrigatórios ausentes.`);
            return false;
        }

        // Query SQL de inserção com placeholders ($1 a $9), um para cada campo.
        // "RETURNING id_livro" instrui o banco a retornar o ID gerado automaticamente
        // após o INSERT — isso nos permite confirmar e logar o novo registro.
        const queryInsertLivro = `
            INSERT INTO Livro (
                titulo,
                autor,
                editora,
                ano_publicacao,
                isbn,
                quant_total,
                quant_disponivel,
                valor_aquisicao,
                status_livro_emprestado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_livro;
        `;

        // ✅ MELHORIA 2 — Normalização de texto centralizada com helper
        // No código original, .toUpperCase() era chamado individualmente em cada campo.
        // Criar um helper local evita repetição e garante que a regra de negócio
        // (texto em maiúsculas) fique em um único lugar — fácil de alterar no futuro.
        // O .trim() remove espaços acidentais no início e no fim da string.
        const normalizar = (valor: string): string => valor.trim().toUpperCase();

        // ✅ MELHORIA 3 — Proteção de campos numéricos com Number()
        // No original, getQuantTotal() e outros retornam números diretamente — mas se
        // um valor vier como string (ex: vindo de um formulário), a query falharia.
        // Number() garante a conversão segura para o tipo correto antes de enviar ao banco.
        const valores = [
            normalizar(livro.getTitulo()),              // $1 — Título normalizado
            normalizar(livro.getAutor()),               // $2 — Autor normalizado
            normalizar(livro.getEditora()),             // $3 — Editora normalizada
            normalizar(livro.getAnoPublicacao()),       // $4 — Ano de publicação normalizado
            normalizar(livro.getIsbn()),                // $5 — ISBN normalizado
            Number(livro.getQuantTotal()),              // $6 — Quantidade total (numérico)
            Number(livro.getQuantDisponivel()),         // $7 — Quantidade disponível (numérico)
            Number(livro.getValorAquisicao()),          // $8 — Valor de aquisição (numérico)
            normalizar(livro.getStatusLivroEmprestado()) // $9 — Status normalizado
        ];

        // Executa a query passando o array de valores — o banco substitui $1..$9 pelos
        // valores do array na ordem em que foram declarados
        const resultado = await database.query(queryInsertLivro, valores);

        // ✅ MELHORIA 4 — Verificação e log estruturado do resultado
        // result.rows.length > 0 confirma que o banco executou o INSERT e devolveu o ID.
        // Se por algum motivo o INSERT não gerar retorno, capturamos isso com o else.
        if (resultado.rows.length > 0) {
            // Log informativo com contexto: qual modelo, qual operação, qual ID foi gerado
            console.log(`[LivroModel] Livro cadastrado com sucesso. ID: ${resultado.rows[0].id_livro}`);
            return true;
        }

        // Caso o banco não retorne nenhuma linha, o INSERT falhou silenciosamente
        console.warn(`[LivroModel] INSERT executado, mas nenhum ID foi retornado.`);
        return false;

    } catch (error) {
        // Log de erro com prefixo de contexto para facilitar rastreamento em produção
        console.error(`[LivroModel] Erro ao cadastrar livro: ${error}`);
        return false;
    }
}

    /**
     * Remove um livro do banco de dados
     * @param id_livro ID do livro a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
    */
    // Realiza uma remoção lógica: não apaga o registro, apenas muda o status para FALSE
    static async removerLivro(id_livro: number): Promise<boolean> {
    try {
        // ✅ MELHORIA 1 — Validação de entrada antes de qualquer operação
        // Se o ID recebido não for um número válido, rejeitamos imediatamente.
        // Isso evita uma consulta desnecessária ao banco com um valor inútil.
        if (!id_livro || isNaN(id_livro)) {
            console.warn(`[LivroModel] Remoção rejeitada: ID inválido recebido (${id_livro})`);
            return false;
        }

        // Busca o livro no banco antes de tentar remover, para verificar se ele existe e está ativo.
        // Reutilizamos o método listarLivro() já existente — sem duplicar a query de SELECT.
        const livro: LivroDTO | null = await LivroModel.listarLivro(id_livro);

        // Se o livro não existir ou já estiver inativo, não há nada a remover
        if (!livro || !livro.status_livro) {
            console.warn(`[LivroModel] Remoção ignorada: livro ID ${id_livro} não encontrado ou já inativo.`);
            return false;
        }

        // ✅ MELHORIA 2 — Uso de transação para garantir consistência dos dados
        // Os dois UPDATEs (empréstimos + livro) precisam acontecer juntos ou não acontecer.
        // Sem transação, se o segundo UPDATE falhar, os empréstimos já teriam sido desativados,
        // deixando o banco em estado inconsistente.
        //
        // BEGIN    → inicia a transação (agrupa as operações)
        // COMMIT   → confirma todas as operações se tudo correu bem
        // ROLLBACK → desfaz tudo se algo falhar (feito automaticamente no catch)
        await database.query('BEGIN');

        // Desativa todos os empréstimos vinculados a este livro.
        // Um livro removido não pode manter empréstimos ativos no sistema.
        const queryDesativarEmprestimos = `
            UPDATE emprestimo
               SET status_emprestimo_registro = FALSE
             WHERE id_livro = $1;
        `;
        await database.query(queryDesativarEmprestimos, [id_livro]);

        // Desativa o próprio livro (remoção lógica).
        // O registro permanece no banco para preservar histórico — apenas o status muda.
        const queryDesativarLivro = `
            UPDATE livro
               SET status_livro = FALSE
             WHERE id_livro = $1;
        `;
        const resultado = await database.query(queryDesativarLivro, [id_livro]);

        // Confirma a transação — ambos os UPDATEs foram executados com sucesso
        await database.query('COMMIT');

        // ✅ MELHORIA 3 — Comparação estrita === ao invés de !=
        // O operador != faz coerção de tipo (ex: "0" != 0 é false), o que pode
        // gerar comportamentos inesperados. O === / !== compara valor E tipo,
        // sendo mais seguro e explícito.
        //
        // rowCount retorna o número de linhas afetadas pelo UPDATE.
        // Se for maior que 0, o livro foi desativado com sucesso.
        const foiRemovido = (resultado.rowCount ?? 0) > 0;

        if (foiRemovido) {
            console.log(`[LivroModel] Livro ID ${id_livro} removido com sucesso.`);
        } else {
            console.warn(`[LivroModel] UPDATE executado, mas nenhuma linha foi afetada para o ID ${id_livro}.`);
        }

        return foiRemovido;

    } catch (error) {
        // ✅ MELHORIA 4 — ROLLBACK no catch para desfazer operações parciais
        // Se qualquer erro ocorrer após o BEGIN, precisamos desfazer as operações
        // já executadas dentro da transação para não deixar o banco inconsistente.
        await database.query('ROLLBACK');

        // console.error ao invés de console.log — erros devem ir para stderr
        console.error(`[LivroModel] Erro ao remover livro ID ${id_livro}: ${error}`);
        return false;
    }
}
    /**
     * Atualiza os dados de um livro no banco de dados.
     * @param livro Objeto do tipo Livro com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    // Recebe um objeto Livro com os dados atualizados e os salva no banco
    static async atualizarLivro(livro: Livro): Promise<boolean> {
        try {
            // Antes de atualizar, verifica se o livro existe e está ativo no banco
            const livroConsulta: LivroDTO | null = await this.listarLivro(livro.id_livro);

            // Só prossegue com a atualização se o livro existir e estiver ativo
            if (livroConsulta && livroConsulta.status_livro) {
                // Query SQL de atualização com 10 placeholders ($1 a $10)
                // O $10 no WHERE garante que apenas o livro com o ID correto seja atualizado
                const queryAtualizarLivro = `UPDATE Livro SET 
                                titulo = $1, 
                                autor = $2,
                                editora = $3, 
                                ano_publicacao = $4,
                                isbn = $5, 
                                quant_total = $6,
                                quant_disponivel = $7,
                                valor_aquisicao = $8,
                                status_livro_emprestado = $9
                             WHERE id_livro = $10`;

                // Organiza os novos valores em um array na mesma ordem dos placeholders
                const valores = [
                    livro.getTitulo().toUpperCase(),               // $1 — Título em maiúsculas
                    livro.getAutor().toUpperCase(),                // $2 — Autor em maiúsculas
                    livro.getEditora().toUpperCase(),              // $3 — Editora em maiúsculas
                    livro.getAnoPublicacao().toUpperCase(),        // $4 — Ano de publicação em maiúsculas
                    livro.getIsbn().toUpperCase(),                 // $5 — ISBN em maiúsculas
                    livro.getQuantTotal(),                         // $6 — Quantidade total (número)
                    livro.getQuantDisponivel(),                    // $7 — Quantidade disponível (número)
                    livro.getValorAquisicao(),                     // $8 — Valor de aquisição (número)
                    livro.getStatusLivroEmprestado().toUpperCase(), // $9 — Status em maiúsculas
                    livro.getIdLivro()                             // $10 — ID do livro (usado no WHERE)
                ];

                // Executa a query de atualização e armazena o resultado
                const respostaBD = await database.query(queryAtualizarLivro, valores);

                // Se rowCount for diferente de 0, a atualização funcionou — retorna true
                if (respostaBD.rowCount != 0) {
                    return true;
                }
            }

            // Se o livro não existe, está inativo, ou o UPDATE não afetou nenhuma linha, retorna false
            return false;

        } catch (error) {
            // Exibe o erro no console e retorna false em caso de exceção
            console.log(`Erro na consulta: ${error}`);
            return false;
        }
    }

}

// Exporta a classe Livro para que possa ser importada e usada em outros arquivos do projeto
export default Livro;