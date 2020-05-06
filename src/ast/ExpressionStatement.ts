import { Token } from "../token/token ";
import { Expression, Statement, TExpression } from "./Node";

export default class ExpressionStatement implements Statement {
  public readonly nodeType = ExpressionStatement;
  constructor(private token?: Token, private _expression?: TExpression) {}

  get expression(): TExpression {
    if (!this._expression) {
      throw new Error("un setted expression");
    }
    return this._expression;
  }

  set expression(expression: TExpression) {
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
