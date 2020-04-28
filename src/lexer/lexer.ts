/* eslint-disable no-fallthrough, @typescript-eslint/ban-ts-ignore */

import { Token, token, lookupIdent, strToTokenType } from "../token/token ";

export class Lexer {
  constructor(
    private input: string,
    private position: number = 0,
    private readPosition: number = 0,
    private ch: string = ""
  ) {}

  static of(
    input: string,
    position: number,
    readPosition: number,
    ch: string
  ): Lexer {
    return new Lexer(input, position, readPosition, ch);
  }

  nextToken(): Token {
    let tok: Token;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          tok = { type: token.EQ, literal: literal };
        } else {
          tok = this.newToken(token.ASSIGN, this.ch);
        }
      case "+":
        tok = this.newToken(token.PLUS, this.ch);
      case "-":
        tok = this.newToken(token.MINUS, this.ch);
      case "!":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          tok = { type: token.EQ, literal: literal };
        } else {
          tok = this.newToken(token.BANG, this.ch);
        }
      case "/":
        tok = this.newToken(token.SLASH, this.ch);
      case "*":
        tok = this.newToken(token.ASTERISK, this.ch);
      case "<":
        tok = this.newToken(token.LT, this.ch);
      case ">":
        tok = this.newToken(token.GT, this.ch);
      case ";":
        tok = this.newToken(token.SEMICOLON, this.ch);
      case ",":
        tok = this.newToken(token.COMMA, this.ch);
      case "{":
        tok = this.newToken(token.LBRACE, this.ch);
      case "}":
        tok = this.newToken(token.RBRACE, this.ch);
      case "(":
        tok = this.newToken(token.LPAREN, this.ch);
      case ")":
        tok = this.newToken(token.RPAREN, this.ch);
      default:
        if (this.isLetter(this.ch)) {
          // token以外に数字とか自由な文字が入ってくる
          // @ts-ignore
          if (!tok) throw new Error("no literal");
          tok = this.newToken(this.readIdentifier(), lookupIdent(tok.literal));
          return tok;
        } else if (this.isDigit(this.ch)) {
          tok = this.newToken(token.INT, this.readNumber());
          return tok;
        } else {
          tok = this.newToken(token.ILLEGAL, this.ch);
        }
    }
    this.readChar();
    return tok;
  }

  skipWhitespace(): void {
    while (
      this.ch == " " ||
      this.ch == "\t" ||
      this.ch == "\n" ||
      this.ch == "\r"
    ) {
      this.readChar();
    }
  }

  readNumber(): string {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = ""; // golang byte zero is ts string ""
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  peekChar(): string {
    if (this.readPosition >= this.input.length) {
      return ""; // zero value of string
    } else {
      return this.input[this.readPosition];
    }
  }

  readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  isLetter(ch: string): boolean {
    //   TODO: これであってる？
    return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch == "_";
  }

  isDigit(ch: string): boolean {
    //   TODO: これであってる？
    return "0" <= ch && ch <= "9";
  }

  newToken(tokenType: string, ch: string): Token {
    const token = strToTokenType(tokenType);
    return { type: token, literal: ch };
  }
}
