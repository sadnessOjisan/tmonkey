import { Token } from "../token/token ";
import { Expression } from "./Node";
import { BlockStatement } from "./BlockStatement";

export class CallExpression implements Expression {
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
