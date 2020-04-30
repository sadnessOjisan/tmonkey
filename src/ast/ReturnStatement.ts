import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";

export default class ReturnStatement implements Statement {
  constructor(private token: Token, private _returnValue?: Expression) {}

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
