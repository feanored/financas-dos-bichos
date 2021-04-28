export class Despesa {
  constructor(
    public id?: number,
    public conta?: string,
    public nome?: string,
    public data?: Date,
    public valor?: number
  ) {}
}
