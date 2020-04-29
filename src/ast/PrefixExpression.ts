import { Token } from "../token/token ";
import { Expression } from "./Node";

export class PrefixExpression implements Expression {
  constructor(
    private token: Token,
    private operator: string,
    private right: Expression
  ) {}

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `(${this.operator}${this.right.toString()})`;
  }
}
