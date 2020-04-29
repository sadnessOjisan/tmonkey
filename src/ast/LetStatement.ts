import { Token } from "../token/token ";
import { Expression, Statement } from "./Node";
import Identifier from "./Identifier";

export default class LetStatement implements Statement {
  constructor(
    private token: Token,
    private name: Identifier,
    private value: Expression
  ) {}

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return `${this.tokenLiteral()} ${this.name} = ${this.value}`;
  }
}
