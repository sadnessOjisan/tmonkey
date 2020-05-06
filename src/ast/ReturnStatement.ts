import { Token } from "../token/token ";
import { Expression, Statement, TExpression } from "./Node";

export default class ReturnStatement implements Statement {
  public readonly nodeType = ReturnStatement;
  constructor(private token: Token, private _returnValue?: TExpression) {}

  get returnValue(): TExpression {
    if (!this._returnValue) {
      throw new Error();
    }
    return this._returnValue;
  }

  set returnValue(returnValue: TExpression) {
    this._returnValue = returnValue;
  }

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.tokenLiteral()} ${this._returnValue?.toString()};`;
  }
}
