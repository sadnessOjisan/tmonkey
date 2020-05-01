import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class Identifier implements Expression {
  public readonly nodeType = Identifier;
  private constructor(private token?: Token, public value?: string) {}

  static of(token?: Token, value?: string): Identifier {
    return new Identifier(token, value);
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return this.value ? this.value : "";
  }
}
