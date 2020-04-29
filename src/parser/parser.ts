import { Lexer } from "../lexer/lexer";
import { Token, token, TokenType } from "../token/token ";
import { Expression, Statement } from "../ast/Node";
import Identifier from "../ast/Identifier";
import InfixExpression from "../ast/InfixExpression";
import {
  precedenceTable,
  precedences,
  PrecedenceTableKeyType,
  PrecedencesKeyType,
} from "./precedenceTable";
import Program from "../ast/Program";
import LetStatement from "../ast/LetStatement";
import ExpressionStatement from "../ast/ExpressionStatement";
import ReturnStatement from "../ast/ReturnStatement";

type PrefixParseFnsType = {
  [key in TokenType]: () => Expression;
};

type InfixParseFnsType = {
  [key in TokenType]: (ex: Expression) => Expression;
};

export default class Parser {
  private _errors: string[];
  private curToken?: Token;
  private peekToken?: Token;
  private prefixParseFns: PrefixParseFnsType;
  private infixParseFns: InfixParseFnsType;
  constructor(private lexer: Lexer) {
    this._errors = [];
    this.prefixParseFns = {} as PrefixParseFnsType;
    this.registerPrefix(token.IDENT, this.parseIdentifier);
    this.registerPrefix(token.INT, this.parseIdentifier);
    this.registerPrefix(token.BANG, this.parseIdentifier);
    this.registerPrefix(token.MINUS, this.parseIdentifier);
    this.registerPrefix(token.TRUE, this.parseIdentifier);
    this.registerPrefix(token.FALSE, this.parseIdentifier);
    this.registerPrefix(token.LPAREN, this.parseIdentifier);
    this.registerPrefix(token.IF, this.parseIdentifier);
    this.registerPrefix(token.FUNCTION, this.parseIdentifier);

    this.infixParseFns = {} as InfixParseFnsType;
    this.registerInfix(token.IDENT, this.parseInfixExpression);
    this.registerInfix(token.INT, this.parseInfixExpression);
    this.registerInfix(token.BANG, this.parseInfixExpression);
    this.registerInfix(token.MINUS, this.parseInfixExpression);
    this.registerInfix(token.TRUE, this.parseInfixExpression);
    this.registerInfix(token.FALSE, this.parseInfixExpression);
    this.registerInfix(token.LPAREN, this.parseInfixExpression);
    this.registerInfix(token.IF, this.parseInfixExpression);
    this.registerInfix(token.FUNCTION, this.parseInfixExpression);
  }

  static of(lexer: Lexer) {
    return new Parser(lexer);
  }

  get errors(): string[] {
    return this._errors;
  }

  curTokenIs(t: TokenType): boolean {
    return this.curToken ? this.curToken.type == t : false;
  }

  parseStatement(): Statement {
    switch (this.curToken?.type) {
      case token.LET:
        return this.parseLetStatement();
      case token.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  expectPeek(t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  parseLetStatement(): LetStatement {
    if (!this.curToken) throw new Error("undefined"); // FIXME: 本当に例外なげていい？
    const stmt = LetStatement.of(this.curToken);

    if (!this.expectPeek(token.IDENT)) {
      return undefined;
    }

    stmt.name = Identifier.of(this.curToken, this.curToken.literal);

    if (!this.expectPeek(token.ASSIGN)) {
      return undefined;
    }

    this.nextToken();

    stmt.value = this.parseExpression(LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement {
    if (!this.curToken) throw new Error("undefined"); // FIXME: 本当に例外なげていい？

    const stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(precedences.LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement(): ExpressionStatement {
    if (!this.curToken) throw new Error("undefined"); // FIXME: 本当に例外なげていい？
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(precedences.LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseProgram(): Program {
    const program = Program.of([]);
    program.statements = [];
    while (!this.curTokenIs(token.EOF)) {
      const stmt = this.parseStatement();
      if (stmt != undefined) {
        program.statements = [...program.statements, stmt];
      }
      this.nextToken();
    }
    return program;
  }

  nextToken(): void {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  curPrecedence(): number {
    return (
      precedenceTable[this.curToken?.type as PrecedenceTableKeyType] ||
      precedences.LOWEST
    );
  }

  parseIdentifier(): Expression {
    return Identifier.of(this.curToken, this.curToken.literal);
  }

  noPrefixParseFnError(t: TokenType): void {
    const msg = `no prefix parse function for ${t}found`;
    console.log(msg);
    this.errors = [...this.errors, msg];
  }

  peekTokenIs(t: TokenType): boolean {
    return this.peekToken.type === t;
  }

  peekPrecedence(): number {
    return (
      precedences[this.peekToken.type as PrecedencesKeyType] ||
      precedences.LOWEST
    );
  }

  parseExpression(precedence: number): Expression | undefined {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (prefix == undefined) {
      this.noPrefixParseFnError(this.curToken.type);
      return undefined;
    }
    let leftExp = prefix();

    while (
      !this.peekTokenIs(token.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.type];
      if (infix == undefined) {
        return leftExp;
      }

      this.nextToken();

      leftExp = infix(leftExp);
    }

    return leftExp;
  }

  parseInfixExpression(left: Expression): Expression {
    const expression = InfixExpression.of(
      this.curToken,
      this.curToken.literal,
      left
    );

    const precedence = this.curPrecedence();
    this.nextToken();
    const parsedExpression = this.parseExpression(precedence);
    if (parsedExpression) {
      expression.setRight(parsedExpression);
    }
    return expression;
  }

  registerPrefix(tokenType: TokenType, fn: () => Expression): void {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(
    tokenType: TokenType,
    fn: (ex: Expression) => Expression
  ): void {
    this.infixParseFns[tokenType] = fn;
  }
}
