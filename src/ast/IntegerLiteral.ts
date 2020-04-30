import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class IntegerLiteral implements Expression {
  public readonly nodeType = IntegerLiteral;
  constructor(private token?: Token, private _value?: number) {}

  static of(token?: Token): IntegerLiteral {
    return new IntegerLiteral(token);
  }

  get value() {
    return this._value;
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
