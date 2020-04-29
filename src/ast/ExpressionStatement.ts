import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";

export default class ExpressionStatement implements Statement {
  constructor(private token: Token, private _expression?: Expression) {}

  set expression(expression: Expression | undefined) {
    if (!expression) throw new Error("no undefined");
    this._expression = expression;
  }

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this._expression != null ? this.expression.toString() : ""}`;
  }
}
