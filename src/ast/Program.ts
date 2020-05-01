import { Statement } from "./Node";

export default class Program {
  public readonly nodeType = Program;
  private constructor(private _statements: Statement[]) {}

  static of(statements: Statement[]): Program {
    return new Program(statements);
  }

  get statements(): Statement[] {
    return this._statements;
  }

  set statements(statements: Statement[]) {
    this._statements = statements;
  }

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
