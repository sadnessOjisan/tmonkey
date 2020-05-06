import { Token } from "../token/token ";
import { Expression } from "./Node";

/**
 * 識別子のAST
 */
export default class Identifier implements Expression {
  public readonly nodeType = Identifier;
  private constructor(private token: Token, public _value: string) {}

  static of(token: Token, value: string): Identifier {
    return new Identifier(token, value);
  }

  get value(): string {
    return this._value;
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
