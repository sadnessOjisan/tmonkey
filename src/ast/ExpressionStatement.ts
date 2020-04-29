import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";

export class ExpressionStatement implements Statement {
  constructor(private token: Token, private expression: Expression) {}

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.expression != null ? this.expression.toString() : ""}`;
  }
}
