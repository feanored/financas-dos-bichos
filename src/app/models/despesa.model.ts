export class Despesa {
  constructor(
    public id?: number,
    public categoria?: string,
    public conta?: string,
    public nome?: string,
    public data?: Date,
    public valor?: number
  ) {}
}
