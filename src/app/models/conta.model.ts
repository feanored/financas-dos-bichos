export class Conta {
  constructor(
    public id?: number,
    public nome?: string,
    public tipo?: string,
    public saldo?: number,
    public desativado?: boolean
  ) {}
}
