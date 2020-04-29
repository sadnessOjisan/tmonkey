import { Statement } from "./Node";

export class Program {
  constructor(private statements: Statement[]) {}

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  toString(): string {
    return JSON.stringify(this.statements);
  }
}
