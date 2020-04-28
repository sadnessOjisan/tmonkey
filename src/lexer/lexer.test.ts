import { Lexer } from "./lexer";

const code = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};
`;

describe("", () => {
  describe("nextToken", () => {
    const lexer = new Lexer(code);
    test.each([
      [0, { type: "ILLEGAL", literal: "" }],
      [0, { type: "LET", literal: "let" }],
      [0, { type: "IDENT", literal: "five" }],
      [0, { type: "=", literal: "=" }],
      [0, { type: "INT", literal: "5" }],
      [0, { type: ";", literal: ";" }],
      [0, { type: "LET", literal: "let" }],
      [0, { type: "IDENT", literal: "ten" }],
      [0, { type: "=", literal: "=" }],
      [0, { type: "INT", literal: "10" }],
      [0, { type: ";", literal: ";" }],
      [0, { type: "LET", literal: "let" }],
      [0, { type: "IDENT", literal: "add" }],
      [0, { type: "=", literal: "=" }],
      [0, { type: "FUNCTION", literal: "fn" }],
      [0, { type: "(", literal: "(" }],
      [0, { type: "IDENT", literal: "x" }],
      [0, { type: ",", literal: "," }],
      [0, { type: "IDENT", literal: "y" }],
      [0, { type: ")", literal: ")" }],
      [0, { type: "{", literal: "{" }],
      [0, { type: "IDENT", literal: "x" }],
      [0, { type: "+", literal: "+" }],
      [0, { type: "IDENT", literal: "y" }],
      [0, { type: ";", literal: ";" }],
      [0, { type: "}", literal: "}" }],
      [0, { type: ";", literal: ";" }],
      [0, { type: "EOF", literal: "" }],
    ])("test", (_, expected) => {
      expect(lexer.nextToken()).toEqual(expected);
    });
  });

  // {token.LET, "let"},
  // {token.IDENT, "result"},
  // {token.ASSIGN, "="},
  // {token.IDENT, "add"},
  // {token.LPAREN, "("},
  // {token.IDENT, "five"},
  // {token.COMMA, ","},
  // {token.IDENT, "ten"},
  // {token.RPAREN, ")"},
  // {token.SEMICOLON, ";"},
  // {token.BANG, "!"},
  // {token.MINUS, "-"},
  // {token.SLASH, "/"},
  // {token.ASTERISK, "*"},
  // {token.INT, "5"},
  // {token.SEMICOLON, ";"},
  // {token.INT, "5"},
  // {token.LT, "<"},
  // {token.INT, "10"},
  // {token.GT, ">"},
  // {token.INT, "5"},
  // {token.SEMICOLON, ";"},
  // {token.IF, "if"},
  // {token.LPAREN, "("},
  // {token.INT, "5"},
  // {token.LT, "<"},
  // {token.INT, "10"},
  // {token.RPAREN, ")"},
  // {token.LBRACE, "{"},
  // {token.RETURN, "return"},
  // {token.TRUE, "true"},
  // {token.SEMICOLON, ";"},
  // {token.RBRACE, "}"},
  // {token.ELSE, "else"},
  // {token.LBRACE, "{"},
  // {token.RETURN, "return"},
  // {token.FALSE, "false"},
  // {token.SEMICOLON, ";"},
  // {token.RBRACE, "}"},
  // {token.INT, "10"},
  // {token.EQ, "=="},
  // {token.INT, "10"},
  // {token.SEMICOLON, ";"},
  // {token.INT, "10"},
  // {token.NOT_EQ, "!="},
  // {token.INT, "9"},
  // {token.SEMICOLON, ";"},
  // {token.EOF, ""},

  describe("newToken", () => {
    test("return token", () => {
      const lexer = new Lexer("fwfwe");
      const actual = lexer.newToken("(", "a");
      expect(actual).toEqual({ type: "(", literal: "a" });
    });
  });

  describe("isLetter", () => {
    test("a", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("a");
      expect(actual).toBe(true);
    });

    test("x", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("x");
      expect(actual).toBe(true);
    });

    test("z", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("z");
      expect(actual).toBe(true);
    });

    test("A", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("A");
      expect(actual).toBe(true);
    });

    test("X", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("X");
      expect(actual).toBe(true);
    });

    test("Z", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("Z");
      expect(actual).toBe(true);
    });

    test("_", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("_");
      expect(actual).toBe(true);
    });

    test("=", () => {
      const lexer = new Lexer(code);
      const actual = lexer.isLetter("=");
      expect(actual).toBe(false);
    });
  });
});
