import { Lexer } from "./lexer/lexer";
import Parser from "./parser/parser";
import { evaluate } from "./evaluator/Evaluator";
import Environment from "./object/environment";

const line = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);

if (5 < add(1,2)) {
	return true;
} else {
	return false;
};
`;
const lexer = Lexer.of(line);
const perser = Parser.of(lexer);

const program = perser.parseProgram();
const evaluated = evaluate(program, Environment.of({}));
console.log("____________________");
console.log("<evaluated>", evaluated.inspect());
console.log("____________________");
