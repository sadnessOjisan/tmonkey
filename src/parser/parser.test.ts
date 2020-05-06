import Parser from "./parser";
import { Lexer } from "../lexer/lexer";

const code = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

add(five, ten);
`;

describe("", () => {
  describe("newToken", () => {
    test("return token", () => {
      const lexer = new Lexer(code);
      const parser = Parser.of(lexer);
      expect(() => parser.parseProgram()).not.toThrowError();
    });
  });
});
