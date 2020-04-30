import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";

export default class ExpressionStatement implements Statement {
  constructor(private token?: Token, private _expression?: Expression) {}

  set expression(expression: Expression | undefined) {
    this._expression = expression;
  }

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return `${this._expression != null ? this._expression.toString() : ""}`;
  }
}
