import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class CBoolean implements Expression {
  private constructor(private token?: Token, private value?: boolean) {}

  static of(token?: Token, value?: boolean): CBoolean {
    return new CBoolean(token, value);
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
