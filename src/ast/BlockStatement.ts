import { Token } from "../token/token ";
import { Statement, TStatement } from "./Node";

/**
 * Block節を表現するAST
 */
export default class BlockStatement implements Statement {
  public readonly nodeType = BlockStatement;

  private constructor(
    private token?: Token, // { が当てはまるはず
    /**
     * blockに含まれる文の一覧
     */
    private _statements?: TStatement[]
  ) {}

  static of(token?: Token, statements?: TStatement[]): BlockStatement {
    return new BlockStatement(token, statements);
  }

  get statements(): TStatement[] {
    return this._statements || [];
  }

  set statements(statements: TStatement[]) {
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
