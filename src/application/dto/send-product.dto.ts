export class SendProductDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly description: string,
    public readonly status: string,
  ) {}
}
