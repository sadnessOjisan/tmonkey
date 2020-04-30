import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class InfixExpression implements Expression {
  private constructor(
    private token?: Token,
    private operator?: string,
    private left?: Expression,
    private right?: Expression
  ) {}

  static of(
    token?: Token,
    operator?: string,
    left?: Expression,
    right?: Expression
  ): InfixExpression {
    return new InfixExpression(token, operator, left, right);
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return `(${this.left?.toString()}" "${
      this.operator
    }" "${this.right?.toString()})`;
  }

  setRight(expression: Expression): void {
    this.right = expression;
  }
}
