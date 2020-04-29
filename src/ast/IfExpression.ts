import { Token } from "../token/token ";
import { Expression } from "./Node";
import BlockStatement from "./BlockStatement";

export default class IfExpression implements Expression {
  constructor(
    private token: Token,
    private condition: Expression,
    private consequence: BlockStatement,
    private alternative: BlockStatement
  ) {}

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `if${this.condition.toString()}" "${this.consequence.toString()}" "${
      this.alternative != null ? `else ${this.alternative.toString()}` : ``
    }`;
  }
}
