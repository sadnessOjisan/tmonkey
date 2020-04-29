/** 演算子の優先順位テーブル */

import { token } from "../token/token ";

const LOWEST = 0;
const EQUALS = 1; // ==
const LESSGREATER = 2; // > or <
const SUM = 3; // +
const PRODUCT = 4; // *
const PREFIX = 5; // -X or !X
const CALL = 6;

export const precedences = {
  LOWEST,
  EQUALS,
  LESSGREATER,
  SUM,
  PRODUCT,
  PREFIX,
  CALL,
};

export const precedenceTable = {
  [token.EQ]: EQUALS,
  [token.NOT_EQ]: EQUALS,
  [token.LT]: LESSGREATER,
  [token.GT]: LESSGREATER,
  [token.PLUS]: SUM,
  [token.MINUS]: SUM,
  [token.SLASH]: PRODUCT,
  [token.ASTERISK]: PRODUCT,
  [token.LPAREN]: CALL,
};
