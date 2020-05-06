import { Token } from "../token/token ";
import { Expression, TExpression } from "./Node";

export default class InfixExpression implements Expression {
  public readonly nodeType = InfixExpression;
  private constructor(
    private token: Token,
    private _operator: string,
    private _left: TExpression,
    private _right: TExpression
  ) {}

  static of(
    token: Token,
    operator: string,
    left: TExpression,
    right: TExpression
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
    return `(${this._left.toString()}" "${
      this._operator
    }" "${this.right?.toString()})`;
  }

  get operator(): string {
    return this._operator;
  }

  get left(): TExpression {
    return this._left;
  }

  get right(): TExpression {
    return this._right;
  }

  set right(expression: TExpression) {
    this._right = expression;
  }
}
