import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class InfixExpression implements Expression {
  constructor(
    private token: Token,
    private left: Expression,
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
    return `(${this.left.toString()}" "${
      this.operator
    }" "${this.right.toString()})`;
  }
}
