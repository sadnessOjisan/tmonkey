import Parser from "./parser";
import { Lexer } from "../lexer/lexer";

const code = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};
`;

describe("", () => {
  describe("newToken", () => {
    test("return token", () => {
      const lexer = new Lexer(code);
      const parser = Parser.of(lexer);
      const actual = parser.parseProgram();
      expect(actual).toEqual({ type: "(", literal: "a" });
    });
  });
});
