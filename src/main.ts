import { Lexer } from "./lexer/lexer";
import Parser from "./parser/parser";

const line = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);

if (5 < 10) {
	return true;
} else {
	return false;
}

10 == 10;
10 != 9;
`;
const lexer = Lexer.of(line);
const perser = Parser.of(lexer);

const program = perser.parseProgram();

console.log("<program>", program);
