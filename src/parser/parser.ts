/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { Lexer } from "../lexer/lexer";
import { Token, token, TokenType } from "../token/token ";
import { Expression, TExpression, TStatement } from "../ast/Node";
import Identifier from "../ast/Identifier";
import InfixExpression from "../ast/InfixExpression";
import {
  precedenceTable,
  precedences,
  PrecedenceTableKeyType,
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
import CallExpression from "../ast/CallExpression";

type PrefixParseFnsType = {
  [key in TokenType]: () => TExpression;
};

type InfixParseFnsType = {
  [key in TokenType]: (ex: TExpression) => TExpression;
};

export default class Parser {
  private _errors: string[];
  /**
   * 現在位置のtoken
   */
  private curToken: Token;
  /**
   * 次の位置のtoken. curtokenだけだと行末にあるものかどうかを識別できないので導入した
   */
  private peekToken: Token;
  /**
   * prefixとそれに対応するparse関数を保存するテーブル
   */
  private prefixParseFns: PrefixParseFnsType;
  /**
   * infixとそれに対応するparse関数を保存するテーブル
   */
  private infixParseFns: InfixParseFnsType;
  constructor(private lexer: Lexer, curToken: Token, peekToken: Token) {
    this.curToken = curToken;
    this.peekToken = peekToken;
    this._errors = [];
    this.prefixParseFns = {} as PrefixParseFnsType;
    // thisの束縛のためarrowを使う
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
    this.registerInfix(token.PLUS, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.MINUS, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.SLASH, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.ASTERISK, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.EQ, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.NOT_EQ, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.LT, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.GT, (left: TExpression) =>
      this.parseInfixExpression(left)
    );
    this.registerInfix(token.LPAREN, (left: TExpression) =>
      this.parseCallExpression(left)
    );
  }

  /**
   * parser classをinstance化する
   * @param lexer レキサー
   */
  static of(lexer: Lexer): Parser {
    const currentToken = lexer.nextToken();
    const nextToken = lexer.nextToken();
    console.log("<of> currentToken", currentToken);
    const parser = new Parser(lexer, currentToken, nextToken);
    return parser;
  }

  get errors(): string[] {
    return this._errors;
  }

  set errors(arr: string[]) {
    this._errors = arr;
  }

  /**
   * 現在位置にあるtokenと一致するか調べる
   * @param t token
   */
  curTokenIs(t: TokenType): boolean {
    return this.curToken ? this.curToken.type == t : false;
  }

  /**
   * 文をparseする
   */
  parseStatement(): TStatement {
    switch (this.curToken.type) {
      case token.LET:
        return this.parseLetStatement();
      case token.RETURN:
        return this.parseReturnStatement();
      default:
        // 式文としてparseする
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
    if (!this.curToken) {
      throw new Error("un initialized token position");
    }
    const expression = PrefixExpression.of(
      this.curToken,
      this.curToken.literal
    );

    this.nextToken();

    expression.right = this.parseExpression(precedences.PREFIX);

    return expression;
  }

  parseBoolean(): Expression {
    if (!this.curToken) {
      throw new Error("un initialized token position");
    }
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

  /**
   * block 節のparse
   */
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

  /**
   * 関数リテラルのparse. fn<params><block statments>をparseする。
   * P103
   */
  parseFunctionLiteral(): Expression | undefined {
    const lit = FunctionLiteral.of(this.curToken);

    if (!this.expectPeek(token.LPAREN)) {
      // 現在位置の次が(で始まってるか確認
      throw new Error("not started with (");
    }

    // 関数の引数をparse(現在位置が進む)
    lit.parameters = this.parseFunctionParameters();

    if (!this.expectPeek(token.LBRACE)) {
      // 現在位置の次が{で始まってるか確認
      throw new Error("not started with {");
    }

    // 関数のブロック節をparse(現在位置が進む)
    lit.body = this.parseBlockStatement();
    return lit;
  }

  /**
   * 関数の引数をparseする
   */
  parseFunctionParameters(): Identifier[] {
    let identifiers: Identifier[] = [];

    if (this.peekTokenIs(token.RPAREN)) {
      // 次が)なら引数が空なので位置を一つ進めて止める
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    const ident = Identifier.of(this.curToken, this.curToken?.literal);
    identifiers = [...identifiers, ident];

    // commmaに出会わなくなるまで引数を読み進めて保存していく
    while (this.peekTokenIs(token.COMMA)) {
      this.nextToken(); // ,分のskip
      this.nextToken();
      const ident = Identifier.of(this.curToken, this.curToken.literal);
      identifiers = [...identifiers, ident];
    }

    if (!this.expectPeek(token.RPAREN)) {
      // ,にぶつからないところまで読んだのに)で終わっていないので構文エラー
      throw new Error("not ended with )");
    }

    return identifiers;
  }

  /**
   * letを表現するASTに情報を詰めて返す
   */
  parseLetStatement(): LetStatement {
    const stmt = LetStatement.of(this.curToken);

    if (!this.expectPeek(token.IDENT)) {
      throw new Error("unexpected next token");
    }

    stmt.name = Identifier.of(this.curToken, this.curToken.literal);

    if (!this.expectPeek(token.ASSIGN)) {
      throw new Error("unexpected next token");
    }

    this.nextToken();

    stmt.value = this.parseExpression(precedences.LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement(): ReturnStatement {
    const stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    stmt.returnValue = this.parseExpression(precedences.LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  /**
   * 式文をparseする
   */
  parseExpressionStatement(): ExpressionStatement {
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(precedences.LOWEST);

    if (this.peekTokenIs(token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  /**
   * ソースコードをparseする関数
   */
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

  /**
   * tokenを一つ読み進める
   */
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

  noPrefixParseFnError(t: TokenType): void {
    const msg = `no prefix parse function for ${t}found`;
    console.log(msg);
    this.errors = [...this.errors, msg];
  }

  peekTokenIs(t: TokenType): boolean {
    return this.peekToken.type === t;
  }

  /**
   * 次のtokenの優先度を調べる
   */
  peekPrecedence(): number {
    return (
      precedenceTable[this.peekToken.type as PrecedenceTableKeyType] ||
      precedences.LOWEST
    );
  }

  /**
   * 式を順番にparseしていく
   * p73
   * @param precedence
   */
  parseExpression(precedence: number): TExpression {
    console.error("this.curToken", this.curToken);
    const prefix = this.prefixParseFns[this.curToken.type];
    if (prefix == undefined) {
      console.error("prefix", prefix);
      throw new Error("unexpected token");
    }

    // この時点でのprefixは前置演算子に対応する関数
    let leftExp = prefix();
    console.log("this.peekPrecedence()", this.peekPrecedence());
    while (
      !this.peekTokenIs(token.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.type];
      if (infix == undefined) {
        // 前置演算子であれば現在のparse結果を返す
        return leftExp;
      }

      // 中値演算子であることがわかればtokenを進める
      this.nextToken();
      console.log("INFIX");
      leftExp = infix(leftExp);
    }

    console.info("leftExp", leftExp);

    return leftExp;
  }

  /**
   * 中値演算子をparseする
   * @param left
   */
  parseInfixExpression(left: TExpression): TExpression {
    const expression = InfixExpression.of(
      this.curToken,
      this.curToken.literal,
      left
    );

    const precedence = this.curPrecedence();
    this.nextToken();
    const parsedExpression = this.parseExpression(precedence);
    if (parsedExpression) {
      expression.right = parsedExpression;
    }
    return expression;
  }

  /**
   * 関数呼び出しをparseする
   * @param fn
   */
  parseCallExpression(fn: TExpression): TExpression {
    const args = this.parseCallArguments();
    const exp = CallExpression.of(this.curToken, fn, args);
    return exp;
  }

  /**
   * 呼び出し式の引数をparseする
   */
  parseCallArguments(): TExpression[] {
    let args = [] as TExpression[];

    if (this.peekTokenIs(token.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();
    args = [...args, this.parseExpression(precedences.LOWEST)];

    while (this.peekTokenIs(token.COMMA)) {
      this.nextToken();
      this.nextToken();
      args = [...args, this.parseExpression(precedences.LOWEST)];
    }

    if (!this.expectPeek(token.RPAREN)) {
      throw new Error("un ended with }");
    }

    return args;
  }

  registerPrefix(tokenType: TokenType, fn: () => Expression | undefined): void {
    // @ts-ignore
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(
    tokenType: TokenType,
    fn: (ex: TExpression) => TExpression
  ): void {
    this.infixParseFns[tokenType] = fn;
  }
}
