import { Token } from "../token/token ";
import { Expression, TExpression } from "./Node";

/**
 * prefixのAST.
 */
export default class PrefixExpression implements Expression {
  public readonly nodeType = PrefixExpression;
  private constructor(
    /** token */
    private token: Token,
    /** operator */
    private _operator: string,
    /** operatorの右にくる値 */
    private _right?: TExpression
  ) {}

  static of(
    token: Token,
    operator: string,
    right?: TExpression
  ): PrefixExpression {
    return new PrefixExpression(token, operator, right);
  }
  get right(): TExpression {
    if (!this._right) {
      throw new Error("no right");
    }
    return this._right;
  }

  set right(right: TExpression) {
    this._right = right;
  }

  get operator(): string {
    return this._operator;
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
