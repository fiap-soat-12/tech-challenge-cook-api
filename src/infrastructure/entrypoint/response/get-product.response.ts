export class GetProductResponse {
  public readonly id: string;
  public readonly name: string;
  public readonly category: string;
  public readonly price: number;
  public readonly description: string;

  constructor(props: Partial<GetProductResponse>) {
    Object.assign(this, props);
  }
}
