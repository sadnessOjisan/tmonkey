import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class CallExpression implements Expression {
  public readonly nodeType = CallExpression;
  constructor(
    private token: Token,
    private func: Expression, // function is reserved
    private args: Expression[] // arguments is reserved
  ) {}

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
