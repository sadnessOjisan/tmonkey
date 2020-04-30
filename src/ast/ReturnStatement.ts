import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";

export default class ReturnStatement implements Statement {
  public readonly nodeType = ReturnStatement;
  constructor(private token: Token, private _returnValue?: Expression) {}

  get returnValue(): Expression {
    if (!this._returnValue) {
      throw new Error();
    }
    return this._returnValue;
  }

  set returnValue(returnValue: Expression | undefined) {
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
