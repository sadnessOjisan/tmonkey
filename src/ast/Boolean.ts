import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class Boolean2 implements Expression {
  public readonly nodeType = Boolean2;
  private constructor(private token?: Token, private value?: boolean) {}

  static of(token?: Token, value?: boolean): Boolean2 {
    return new Boolean2(token, value);
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return this.token ? this.token.literal : "";
  }
}
