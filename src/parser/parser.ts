/* eslint-disable @typescript-eslint/ban-ts-ignore */

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
import IntegerLiteral from "../ast/IntegerLiteral";
import PrefixExpression from "../ast/PrefixExpression";
import IfExpression from "../ast/IfExpression";
import BlockStatement from "../ast/BlockStatement";
import Boolean from "../ast/Boolean";
import FunctionLiteral from "../ast/FunctionLiteral";

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
    // thisの束縛のため
    this.registerPrefix(token.IDENT, () => this.parseIdentifier());
    this.registerPrefix(token.INT, () => this.parseIntegerLiteral());
    this.registerPrefix(token.BANG, () => this.parsePrefixExpression());
    this.registerPrefix(token.MINUS, () => this.parsePrefixExpression());
    this.registerPrefix(token.TRUE, () => this.parseBoolean());
    this.registerPrefix(token.FALSE, () => this.parseBoolean());
    this.registerPrefix(token.LPAREN, () => this.parseGroupedExpression());
    this.registerPrefix(token.IF, () => this.parseIfExpression());
    this.registerPrefix(token.FUNCTION, () => this.parseFunctionLiteral());

    this.infixParseFns = {} as InfixParseFnsType;
    this.registerInfix(token.IDENT, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.INT, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.BANG, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.MINUS, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.TRUE, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.FALSE, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.LPAREN, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.IF, (left: Expression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.FUNCTION, (left: Expression) =>
      this.parseInfixExpression(left)
    );
  }

  static of(lexer: Lexer): Parser {
    return new Parser(lexer);
  }

  get errors(): string[] {
    return this._errors;
  }

  set errors(arr: string[]) {
    this._errors = arr;
  }

  curTokenIs(t: TokenType): boolean {
    return this.curToken ? this.curToken.type == t : false;
  }

  parseStatement(): Statement | undefined {
    console.log("this.curToken", this.curToken);
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

  peekError(t: TokenType): void {
    const msg = `expected next token to be ${t}, got ${this.peekToken?.type} instead`;
    this.errors = [...this.errors, msg];
  }

  parseIntegerLiteral(): Expression | undefined {
    const lit = IntegerLiteral.of(this.curToken);
    try {
      const num = Number(this.curToken?.literal);
      lit.value = num;
    } catch (e) {
      const msg = `no prefix parse function for ${lit.value}found`;
      console.log(msg);
      this.errors = [...this.errors, msg];
      return undefined;
    }
    return lit;
  }

  parsePrefixExpression(): Expression {
    const expression = PrefixExpression.of(
      this.curToken,
      this.curToken?.literal
    );

    this.nextToken();

    expression.right = this.parseExpression(precedences.PREFIX);

    return expression;
  }

  parseBoolean(): Expression {
    return Boolean.of(this.curToken, this.curTokenIs(token.TRUE));
  }

  parseGroupedExpression(): Expression | undefined {
    this.nextToken();
    const exp = this.parseExpression(precedences.LOWEST);
    if (!this.expectPeek(token.RPAREN)) {
      return undefined;
    }
    return exp;
  }

  parseIfExpression(): Expression | undefined {
    const expression = IfExpression.of(this.curToken);
    if (!this.expectPeek(token.LPAREN)) {
      return undefined;
    }
    this.nextToken();
    expression.condition = this.parseExpression(precedences.LOWEST);
    if (!this.expectPeek(token.RPAREN)) {
      return undefined;
    }
    if (!this.expectPeek(token.LBRACE)) {
      return undefined;
    }
    expression.consequence = this.parseBlockStatement();
    if (this.peekTokenIs(token.ELSE)) {
      this.nextToken();
      if (!this.expectPeek(token.LBRACE)) {
        return undefined;
      }
      expression.alternative = this.parseBlockStatement();
    }
    return expression;
  }

  parseBlockStatement() {
    const block = BlockStatement.of(this.curToken);
    block.statements = [];

    this.nextToken();

    while (!this.curTokenIs(token.RBRACE) && !this.curTokenIs(token.EOF)) {
      const stmt = this.parseStatement();
      if (stmt != undefined) {
        block.statements = [...block.statements, stmt];
      }
      this.nextToken();
    }

    return block;
  }

  parseFunctionLiteral(): Expression | undefined {
    const lit = FunctionLiteral.of(this.curToken);
    if (!this.expectPeek(token.LPAREN)) {
      return undefined;
    }
    lit.parameters = this.parseFunctionParameters();
    if (!this.expectPeek(token.LBRACE)) {
      return undefined;
    }
    lit.body = this.parseBlockStatement();
    return lit;
  }

  parseFunctionParameters(): Identifier[] | undefined {
    let identifiers: Identifier[] = [];

    if (this.peekTokenIs(token.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    const ident = Identifier.of(this.curToken, this.curToken?.literal);
    identifiers = [...identifiers, ident];

    while (this.peekTokenIs(token.COMMA)) {
      this.nextToken();
      this.nextToken();
      const ident = Identifier.of(this.curToken, this.curToken?.literal);
      identifiers = [...identifiers, ident];
    }

    if (!this.expectPeek(token.RPAREN)) {
      return undefined;
    }

    return identifiers;
  }

  parseLetStatement(): LetStatement | undefined {
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

    stmt.value = this.parseExpression(precedences.LOWEST);

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
      console.log("stmt", stmt);
      if (stmt != undefined) {
        program.statements = [...program.statements, stmt];
        console.log("program.statements", program.statements);
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
    return Identifier.of(this.curToken, this.curToken?.literal);
  }

  noPrefixParseFnError(t?: TokenType): void {
    const msg = `no prefix parse function for ${t}found`;
    console.log(msg);
    this.errors = [...this.errors, msg];
  }

  peekTokenIs(t: TokenType): boolean {
    return this.peekToken?.type === t;
  }

  peekPrecedence(): number {
    return (
      precedences[this.peekToken?.type as PrecedencesKeyType] ||
      precedences.LOWEST
    );
  }

  parseExpression(precedence: number): Expression | undefined {
    const prefix = this.curToken
      ? this.prefixParseFns[this.curToken.type]
      : undefined;
    if (prefix == undefined) {
      this.noPrefixParseFnError(this.curToken?.type);
      return undefined;
    }
    console.log("prefix", prefix);
    let leftExp = prefix();

    while (
      !this.peekTokenIs(token.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      if (!this.peekToken) throw new Error();
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
      this.curToken?.literal,
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

  registerPrefix(tokenType: TokenType, fn: () => Expression | undefined): void {
    // @ts-ignore
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(
    tokenType: TokenType,
    fn: (ex: Expression) => Expression
  ): void {
    this.infixParseFns[tokenType] = fn;
  }
}
