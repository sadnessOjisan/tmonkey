import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class IntegerLiteral implements Expression {
  constructor(private token?: Token, private _value?: number) {}

  static of(token?: Token): IntegerLiteral {
    return new IntegerLiteral(token);
  }

  set value(value: number) {
    this._value = value;
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
