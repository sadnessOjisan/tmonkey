import { Token } from "../token/token ";
import { Statement } from "./Node";

export default class BlockStatement implements Statement {
  private constructor(
    private token?: Token,
    private _statements?: Statement[]
  ) {}

  static of(token?: Token, statements?: Statement[]): BlockStatement {
    return new BlockStatement(token, statements);
  }

  get statements(): Statement[] {
    return this._statements || [];
  }

  set statements(statements: Statement[]) {
    this._statements = statements;
  }

  statementNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return this.statements ? this.statements.join(",") : "";
  }
}
