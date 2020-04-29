import { Token } from "../token/token ";
import { Expression } from "./Node";
import BlockStatement from "./BlockStatement";
import Identifier from "./Identifier";

export default class IfExpression implements Expression {
  constructor(
    private token: Token,
    private parameters: Identifier[],
    private body: BlockStatement
  ) {}

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.tokenLiteral()}(${this.parameters.join(
      ","
    )})${this.body.toString()}`;
  }
}
