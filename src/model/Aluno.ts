// Importa o tipo AlunoDTO, que define a "forma" dos dados de um aluno (como um molde/contrato)
import type AlunoDTO from "../dto/AlunoDTO.js";
// Importa a classe DatabaseModel, responsável por gerenciar a conexão com o banco de dados
import { DatabaseModel } from "./DatabaseModel.js";

// Cria uma instância do DatabaseModel e acessa o pool de conexões com o banco de dados
// O "pool" é um conjunto de conexões reutilizáveis, mais eficiente que abrir/fechar uma por vez
const database = new DatabaseModel().pool;

// Define a classe Aluno, que representa um aluno no sistema
class Aluno {

    // Atributo privado: ID único do aluno no banco de dados (começa em 0, pois ainda não foi salvo)
    private id_aluno: number = 0;
    // Atributo privado: Registro Acadêmico do aluno (começa vazio)
    private ra: string = "";
    // Atributo privado: Primeiro nome do aluno
    private nome: string;
    // Atributo privado: Sobrenome do aluno
    private sobrenome: string;
    // Atributo privado: Data de nascimento do aluno
    private data_nascimento: Date;
    // Atributo privado: Endereço residencial do aluno
    private endereco: string;
    // Atributo privado: E-mail do aluno
    private email: string;
    // Atributo privado: Número de celular do aluno
    private celular: string;
    // Atributo privado: Status do aluno (true = ativo, false = inativo/removido)
    private status_aluno: boolean = true;

    // Construtor: método especial chamado automaticamente ao criar um novo objeto Aluno
    // Os parâmetros com "_" na frente são uma convenção para diferenciar dos atributos da classe
    constructor(
        _nome: string,           // Nome obrigatório
        _sobrenome: string,      // Sobrenome obrigatório
        _data_nascimento: Date,  // Data de nascimento obrigatória
        _endereco: string,       // Endereço obrigatório
        _email: string,          // E-mail obrigatório
        _celular?: string        // Celular opcional (o "?" indica que pode ser omitido)
    ) {
        // Atribui o valor recebido ao atributo interno da classe
        this.nome = _nome;
        this.sobrenome = _sobrenome;
        this.data_nascimento = _data_nascimento;
        this.endereco = _endereco;
        this.email = _email;
        // Se _celular foi informado, usa esse valor; senão, usa string vazia ("")
        // O operador "??" é chamado de "nullish coalescing" — retorna o lado direito se o esquerdo for null/undefined
        this.celular = _celular ?? "";
    }

    // ==================== GETTERS E SETTERS ====================
    // Getters e setters são métodos públicos que permitem ler/alterar atributos privados com segurança

    // Getter: retorna o ID do aluno
    public getIdAluno(): number {
        return this.id_aluno;
    }

    // Setter: define um novo valor para o ID do aluno
    public setIdAluno(id_aluno: number): void {
        this.id_aluno = id_aluno;
    }

    // Getter: retorna o RA do aluno
    public getRa(): string {
        return this.ra;
    }

    // Setter: define um novo valor para o RA do aluno
    public setRa(ra: string): void {
        this.ra = ra;
    }

    // Getter: retorna o nome do aluno
    public getNome(): string {
        return this.nome;
    }

    // Setter: define um novo valor para o nome do aluno
    public setNome(nome: string): void {
        this.nome = nome;
    }

    // Getter: retorna o sobrenome do aluno
    public getSobrenome(): string {
        return this.sobrenome;
    }

    // Setter: define um novo valor para o sobrenome do aluno
    public setSobrenome(sobrenome: string): void {
        this.sobrenome = sobrenome;
    }

    // Getter: retorna a data de nascimento do aluno
    public getDataNascimento(): Date {
        return this.data_nascimento;
    }

    // Setter: define uma nova data de nascimento para o aluno
    public setDataNascimento(data_nascimento: Date): void {
        this.data_nascimento = data_nascimento;
    }

    // Getter: retorna o endereço do aluno
    public getEndereco(): string {
        return this.endereco;
    }

    // Setter: define um novo endereço para o aluno
    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }

    // Getter: retorna o e-mail do aluno
    public getEmail(): string {
        return this.email;
    }

    // Setter: define um novo e-mail para o aluno
    public setEmail(email: string): void {
        this.email = email;
    }

    // Getter: retorna o celular do aluno
    public getCelular(): string {
        return this.celular;
    }

    // Setter: define um novo número de celular para o aluno
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    // Getter duplicado do RA (mesma função que getRa acima — provavelmente um erro de duplicidade no código original)
    public getRA(): string {
        return this.ra;
    }

    // Setter duplicado do RA (mesma função que setRa acima)
    public setRA(ra: string): void {
        this.ra = ra;
    }

    // Getter: retorna o status do aluno (true = ativo, false = inativo)
    public getStatusAluno(): boolean {
        return this.status_aluno;
    }

    // Setter: define um novo status para o aluno
    public setStatusAluno(status_aluno: boolean): void {
        this.status_aluno = status_aluno;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================
    // Métodos "static" pertencem à classe, não ao objeto — são chamados como Aluno.listarAlunos()

    /**
     * Retorna uma lista com todos os alunos cadastrados no banco de dados
     * 
     * @returns Lista com todos os alunos cadastrados no banco de dados
     */
    static async listarAlunos(): Promise<AlunoDTO[]> {

        try {
            // Seleciona apenas as colunas necessárias — evita buscar dados extras do banco
            // (ex: colunas internas, logs, timestamps não usados pela aplicação)
            const query = `
            SELECT
                id_aluno,
                ra,
                nome,
                sobrenome,
                data_nascimento,
                endereco,
                email,
                celular,
                status_aluno
            FROM aluno
            WHERE status_aluno = TRUE;
        `;

            // Executa a consulta e aguarda a resposta do banco de dados
            const { rows } = await database.query(query);

            // .map() transforma cada linha retornada em um objeto AlunoDTO
            // É preferível ao forEach+push por ser mais declarativo e criar o array diretamente
            const listaDeAlunos: AlunoDTO[] = rows.map((aluno: any) => ({
                id_aluno: aluno.id_aluno as number,
                ra: aluno.ra as string,
                nome: aluno.nome as string,
                sobrenome: aluno.sobrenome as string,
                data_nascimento: aluno.data_nascimento as Date,
                endereco: aluno.endereco as string,
                email: aluno.email as string,
                celular: aluno.celular as string,
                status_aluno: aluno.status_aluno as boolean
            } as AlunoDTO));

            return listaDeAlunos;

        } catch (error) {
            // console.error é semanticamente correto para erros (diferente de console.log)
            // Registra a mensagem e o objeto de erro separados para melhor leitura no terminal
            console.error("Erro ao listar alunos:", error);

            // Retorna array vazio em vez de null:
            // o chamador pode usar .length ou iterar diretamente sem verificar null primeiro
            return [];
        }
    }

    /**
     * Retorna as informações de um aluno informado pelo ID
     * 
     * @param idAluno Identificador único do aluno
     * @returns Objeto com informações do aluno
     */
   /**
 * Busca um aluno específico pelo seu ID.
 *
 * @param id_aluno - ID numérico do aluno a ser buscado
 * @returns AlunoDTO com os dados do aluno, ou null se não encontrado ou em caso de erro
 */
static async listarAluno(id_aluno: number): Promise<AlunoDTO | null> {
    try {
        // Seleciona apenas as colunas necessárias — evita tráfego desnecessário de dados
        // O "$1" é um placeholder que será substituído pelo valor de id_aluno com segurança
        // (técnica chamada "prepared statement", que previne SQL Injection)
        const query = `
            SELECT
                id_aluno,
                ra,
                nome,
                sobrenome,
                data_nascimento,
                endereco,
                email,
                celular,
                status_aluno
            FROM aluno
            WHERE id_aluno = $1
              AND status_aluno = TRUE;
        `;

        // Executa a query passando o id como parâmetro — o banco substitui $1 por id_aluno
        // Desestruturação direta: extrai apenas "rows" da resposta do banco
        const { rows } = await database.query(query, [id_aluno]);

        // Se nenhuma linha for retornada, o aluno não existe ou está inativo
        // Retorna null em vez de tentar acessar rows[0] e gerar um erro de runtime
        if (rows.length === 0) return null;

        // Desestrutura a primeira (e única) linha retornada pelo banco
        // Evita repetir "rows[0]." em cada propriedade
        const aluno = rows[0];

        // Monta e retorna o objeto AlunoDTO com type assertion,
        // garantindo ao TypeScript que os dados do banco chegam com os tipos corretos
        return {
            id_aluno:        aluno.id_aluno        as number,
            ra:              aluno.ra              as string,
            nome:            aluno.nome            as string,
            sobrenome:       aluno.sobrenome       as string,
            data_nascimento: aluno.data_nascimento as Date,
            endereco:        aluno.endereco        as string,
            email:           aluno.email           as string,
            celular:         aluno.celular         as string,
            status_aluno:    aluno.status_aluno    as boolean
        } as AlunoDTO;

    } catch (error) {
        // console.error é semanticamente correto para erros
        // Registra a mensagem e o objeto separados para melhor leitura no terminal
        console.error("Erro ao buscar aluno:", error);
        return null;
    }
}

    /**
    * Cadastra um novo aluno no banco de dados
    * @param aluno Objeto Aluno contendo as informações a serem cadastradas
    * @returns Boolean indicando se o cadastro foi bem-sucedido
    */
    // Recebe um objeto Aluno completo e tenta inseri-lo no banco de dados
    /**
 * Cadastra um novo aluno no banco de dados.
 *
 * @param aluno - Objeto Aluno com os dados a serem inseridos
 * @returns true se o cadastro foi realizado com sucesso, false caso contrário
 */
static async cadastrarAluno(aluno: Aluno): Promise<boolean> {
    try {
        // Normaliza os dados antes de enviar ao banco:
        // nomes e endereço em maiúsculas (padrão de armazenamento), e-mail em minúsculas
        // Feito aqui uma única vez, evitando repetição inline na query
        const nome            = aluno.getNome().toUpperCase().trim();
        const sobrenome       = aluno.getSobrenome().toUpperCase().trim();
        const dataNascimento  = aluno.getDataNascimento();
        const endereco        = aluno.getEndereco().toUpperCase().trim();
        const email           = aluno.getEmail().toLowerCase().trim();
        const celular         = aluno.getCelular();

        // Prepared statement com placeholders $1..$6 — previne SQL Injection
        // RETURNING id_aluno faz o banco retornar o ID gerado após o INSERT
        const query = `
            INSERT INTO aluno (nome, sobrenome, data_nascimento, endereco, email, celular)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_aluno;
        `;

        // Executa a query com os valores já normalizados
        const { rows } = await database.query(query, [
            nome,
            sobrenome,
            dataNascimento,
            endereco,
            email,
            celular
        ]);

        // Se o banco retornou o ID, o INSERT foi confirmado com sucesso
        if (rows.length === 0) return false;

        console.log(`Aluno cadastrado com sucesso. ID: ${rows[0].id_aluno}`);
        return true;

    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        return false;
    }
}

   /**
 * Realiza a remoção lógica de um aluno e seus empréstimos vinculados.
 * Não apaga os registros do banco — apenas desativa via status = FALSE.
 *
 * @param id_aluno - ID do aluno a ser desativado
 * @returns true se a remoção foi realizada com sucesso, false caso contrário
 */
static async removerAluno(id_aluno: number): Promise<boolean> {
    try {
        // Verifica se o aluno existe e está ativo antes de prosseguir
        // listarAluno já filtra por status_aluno = TRUE, então null = inexistente ou inativo
        const aluno: AlunoDTO | null = await this.listarAluno(id_aluno);

        // Se o aluno não foi encontrado ou já está inativo, encerra sem alterações
        if (!aluno) return false;

        // Desativa os empréstimos e o aluno em uma única transação:
        // TRANSACTION garante que as duas operações acontecem juntas ou não acontecem nenhuma.
        // Se uma falhar, a outra é desfeita automaticamente (rollback) — mantendo o banco consistente.
        await database.query(`BEGIN`);

        // Remoção lógica dos empréstimos vinculados ao aluno
        await database.query(
            `UPDATE emprestimo
             SET status_emprestimo_registro = FALSE
             WHERE id_aluno = $1;`,
            [id_aluno]
        );

        // Remoção lógica do aluno — rowCount indica quantas linhas foram afetadas
        const { rowCount } = await database.query(
            `UPDATE aluno
             SET status_aluno = FALSE
             WHERE id_aluno = $1;`,
            [id_aluno]
        );

        // Confirma as duas operações no banco (commit só ocorre se tudo correu bem)
        await database.query(`COMMIT`);

        // rowCount > 0 confirma que o UPDATE do aluno afetou ao menos uma linha
        return (rowCount ?? 0) > 0;

    } catch (error) {
        // Se qualquer operação falhar, desfaz tudo que foi feito na transação
        await database.query(`ROLLBACK`);
        console.error("Erro ao remover aluno:", error);
        return false;
    }
}

    /**
 * Atualiza os dados de um aluno ativo no banco de dados.
 *
 * @param aluno - Objeto Aluno com os dados atualizados (deve conter id_aluno)
 * @returns true se a atualização foi realizada com sucesso, false caso contrário
 */
static async atualizarAluno(aluno: Aluno): Promise<boolean> {
    try {
        // Verifica se o aluno existe e está ativo antes de tentar atualizar
        // listarAluno já filtra por status_aluno = TRUE, então null = inexistente ou inativo
        const alunoExistente: AlunoDTO | null = await this.listarAluno(aluno.id_aluno);

        // Se o aluno não foi encontrado ou está inativo, encerra sem alterações
        if (!alunoExistente) return false;

        // Normaliza os dados antes de enviar ao banco (mesmo padrão de cadastrarAluno):
        // nomes e endereço em maiúsculas, e-mail em minúsculas, trim remove espaços extras
        const nome           = aluno.getNome().toUpperCase().trim();
        const sobrenome      = aluno.getSobrenome().toUpperCase().trim();
        const dataNascimento = aluno.getDataNascimento();
        const endereco       = aluno.getEndereco().toUpperCase().trim();
        const celular        = aluno.getCelular();
        const email          = aluno.getEmail().toLowerCase().trim();

        // Prepared statement sem aspas nos placeholders — aspas causariam o banco
        // interpretar '$1' como texto literal em vez de parâmetro (bug crítico)
        const query = `
            UPDATE aluno SET
                nome            = $1,
                sobrenome       = $2,
                data_nascimento = $3,
                endereco        = $4,
                celular         = $5,
                email           = $6
            WHERE id_aluno = $7;
        `;

        // Executa o UPDATE com os valores normalizados
        const { rowCount } = await database.query(query, [
            nome,
            sobrenome,
            dataNascimento,
            endereco,
            celular,
            email,
            aluno.id_aluno
        ]);

        // rowCount > 0 confirma que ao menos uma linha foi afetada pelo UPDATE
        // ?? 0 trata o caso em que rowCount é null (comportamento possível em alguns drivers)
        return (rowCount ?? 0) > 0;

    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        return false;
    }
}
}

// Exporta a classe Aluno para que possa ser importada e usada em outros arquivos do projeto
export default Aluno;