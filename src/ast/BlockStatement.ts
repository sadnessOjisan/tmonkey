import { Token } from "../token/token ";
import { Statement } from "./Node";

export class BlockStatement implements Statement {
  constructor(private token: Token, private statements: Statement[]) {}

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token.literal;
  }

  toString(): string {
    return this.statements.join(",");
  }
}
