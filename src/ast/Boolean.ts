import { Token } from "../token/token ";
import { Expression } from "./Node";

export default class Boolean implements Expression {
  constructor(private token: Token, private value: boolean) {}

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
