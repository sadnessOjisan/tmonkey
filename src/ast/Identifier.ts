import { Token } from "../token/token ";
import { Expression } from "./Node";

export class Identifier implements Expression {
  constructor(private token: Token, private value: string) {}

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.value;
  }
}
