export class Transferencia {
    constructor(
      public id?: number,
      public origem?: string,
      public destino?: string,
      public data?: Date,
      public valor?: number
    ) {}
  }