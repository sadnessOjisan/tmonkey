import { TStatement } from "./Node";

export default class Program {
  public readonly nodeType = Program;
  private constructor(private _statements: TStatement[]) {}

  static of(statements: TStatement[]): Program {
    return new Program(statements);
  }

  get statements(): TStatement[] {
    return this._statements;
  }

  set statements(statements: TStatement[]) {
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
