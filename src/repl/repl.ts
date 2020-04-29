import * as fs from "fs";
import { Lexer } from "../lexer/lexer";
import Parser from "../parser/parser";

const PROMPT = ">> ";

export const start = () => {
  const stdIn = fs.readFileSync("/dev/stdin", "utf8");
  while (true) {
    console.log(PROMPT);
    if (!stdIn) {
      return;
    }
    const line = `aaaaa`;
    const l = Lexer.of(line);
    const p = Parser.of(l);

    const program = p.parseProgram();
    if (p.errors.length !== 0) {
      console.log(p.errors);
      continue;
    }
    console.log(program);
  }
};
