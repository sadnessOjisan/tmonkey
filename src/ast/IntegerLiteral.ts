import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class IntegerLiteral implements Expression {
  constructor(private token: Token, private value: number) {}

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.token.literal;
  }
}
