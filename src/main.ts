import { Lexer } from "./lexer/lexer";
import Parser from "./parser/parser";

const line = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

add(3, 4);
`;
const lexer = Lexer.of(line);
const perser = Parser.of(lexer);

const program = perser.parseProgram();

console.log("<program>", program);
