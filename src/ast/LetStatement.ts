import { Token } from "../token/token ";
import { Expression, Statement, TExpression } from "./Node";
import Identifier from "./Identifier";

export default class LetStatement implements Statement {
  public readonly nodeType = LetStatement;
  constructor(
    private token: Token,
    private _name?: Identifier,
    private _value?: TExpression
  ) {}

  static of(
    token: Token,
    name?: Identifier,
    value?: TExpression
  ): LetStatement {
    return new LetStatement(token, name, value);
  }

  get name(): Identifier {
    if (!this._name) {
      throw new Error("unsetted name");
    }
    return this._name;
  }

  set name(name: Identifier) {
    this._name = name;
  }

  get value(): TExpression {
    if (!this._value) {
      throw new Error("un setted value");
    }
    return this._value;
  }

  set value(value: TExpression) {
    this._value = value;
  }

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.tokenLiteral()} ${this.name} = ${this.value}`;
  }
}
