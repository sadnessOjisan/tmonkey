import { Token } from "../token/token ";
import { Expression, TExpression } from "./Node";

export default class CallExpression implements Expression {
  public readonly nodeType = CallExpression;
  constructor(
    private token: Token,
    private _func: TExpression, // function is reserved
    private _args: TExpression[] // arguments is reserved
  ) {}

  get func(): TExpression {
    return this._func;
  }

  get args(): TExpression[] {
    return this._args;
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.func.toString()}(${this.args.join(",")})`;
  }
}
