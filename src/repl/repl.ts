import * as fs from "fs";
import { Lexer } from "../lexer/lexer";
import Parser from "../parser/parser";
import Environment from "../object/environment";

const PROMPT = ">> ";

export const start = (): void => {
  const env = Environment.of({});
  const stdIn = fs.readFileSync("/dev/stdin", "utf8");
  console.log("stdIn", stdIn);
  for (;;) {
    console.log(PROMPT);
    if (!stdIn) {
      return;
    }
    const line = `let`;
    const lexer = Lexer.of(line);
    const perser = Parser.of(lexer);

    const program = perser.parseProgram();
    if (perser.errors.length !== 0) {
      console.log(perser.errors);
      continue;
    }
    console.log(program);
  }
};
