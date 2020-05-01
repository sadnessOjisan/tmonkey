import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class CallExpression implements Expression {
  public readonly nodeType = CallExpression;
  constructor(
    private token: Token,
    private _func: Expression, // function is reserved
    private _args: Expression[] // arguments is reserved
  ) {}

  get func(): Expression {
    return this._func;
  }

  get args(): Expression[] {
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
