class Emprestimo {

    private id_emprestimo: number = 0;
    private id_aluno: number;
    private id_livro: number;
    private data_emprestimo: Date;
    private data_devolucao: Date;
    private status_emprestimo: string;
    private status_emprestimo_registro: boolean = true;

    constructor(
        _id_aluno: number,
        _id_livro: number,
        _data_emprestimo: Date,
        _status_emprestimo?: string,
        _data_devolucao?: Date
    ) {
        const dataDevolucaoPadrao = new Date(_data_emprestimo);
        dataDevolucaoPadrao.setDate(dataDevolucaoPadrao.getDate() + 7);

        this.id_aluno = _id_aluno;
        this.id_livro = _id_livro;
        this.data_emprestimo = _data_emprestimo;
        this.status_emprestimo = _status_emprestimo ?? "Em Andamento";
        this.data_devolucao = _data_devolucao ?? dataDevolucaoPadrao;
    }

    public getIdEmprestimo(): number {
        return this.id_emprestimo;
    }
    public setIdEmprestimo(value: number) {
        this.id_emprestimo = value;
    }

    public getIdAluno(): number {
        return this.id_aluno;
    }
    public setIdAluno(value: number) {
        this.id_aluno = value;
    }

    public getIdLivro(): number {
        return this.id_livro;
    }
    public setIdLivro(value: number) {
        this.id_livro = value;
    }

    public getDataEmprestimo(): Date {
        return this.data_emprestimo;
    }
    public setDataEmprestimo(value: Date) {
        this.data_emprestimo = value;
    }

    public getDataDevolucao(): Date {
        return this.data_devolucao;
    }
    public setDataDevolucao(value: Date) {
        this.data_devolucao = value;
    }

    public getStatusEmprestimo(): string {
        return this.status_emprestimo;
    }
    public setStatusEmprestimo(value: string) {
        this.status_emprestimo = value;
    }

    public getStatusEmprestimoRegistro(): boolean {
        return this.status_emprestimo_registro;
    }
    public setStatusEmprestimoRegistro(value: boolean) {
        this.status_emprestimo_registro = value;
    }
}

export default Emprestimo;