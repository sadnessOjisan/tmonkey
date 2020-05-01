import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class PrefixExpression implements Expression {
  public readonly nodeType = PrefixExpression;
  private constructor(
    private token?: Token,
    private operator?: string,
    private _right?: Expression
  ) {}

  static of(
    token?: Token,
    operator?: string,
    right?: Expression
  ): PrefixExpression {
    return new PrefixExpression(token, operator, right);
  }

  set right(right: Expression | undefined) {
    this._right = right;
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return `(${this.operator}${this.right?.toString()})`;
  }
}
