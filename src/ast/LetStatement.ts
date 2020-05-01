import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";
import Identifier from "./Identifier";

export default class LetStatement implements Statement {
  public readonly nodeType = LetStatement;
  constructor(
    private token: Token,
    private _name?: Identifier,
    private _value?: Expression
  ) {}

  static of(token: Token, name?: Identifier, value?: Expression): LetStatement {
    return new LetStatement(token, name, value);
  }

  set name(name: Identifier) {
    this._name = name;
  }

  set value(value: Expression | undefined) {
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
