export const token = {
  ILLEGAL: "ILLEGAL" as const,
  EOF: "EOF" as const,

  // Identifiers + literals
  IDENT: "IDENT" as const, // add, foobar, x, y, ...
  INT: "INT" as const, // 1343456

  // Operators
  ASSIGN: "=" as const,
  PLUS: "+" as const,
  MINUS: "-" as const,
  BANG: "!" as const,
  ASTERISK: "*" as const,
  SLASH: "/" as const,

  LT: "<" as const,
  GT: ">" as const,

  EQ: "==" as const,
  NOT_EQ: "!=" as const,

  // Delimiters
  COMMA: "," as const,
  SEMICOLON: ";" as const,

  LPAREN: "(" as const,
  RPAREN: ")" as const,
  LBRACE: "{" as const,
  RBRACE: "}" as const,

  // Keywords
  FUNCTION: "FUNCTION" as const,
  LET: "LET" as const,
  TRUE: "TRUE" as const,
  FALSE: "FALSE" as const,
  IF: "IF" as const,
  ELSE: "ELSE" as const,
  RETURN: "RETURN" as const,
};

export const tokenValues = Object.values(token);

export const strToTokenType = (str: any): TokenType => {
  if (!tokenValues.includes(str)) {
    throw new Error("unsexpected type");
  }
  return str;
};

export const keywords = {
  fn: token.FUNCTION,
  let: token.LET,
  true: token.TRUE,
  false: token.FALSE,
  if: token.IF,
  else: token.ELSE,
  return: token.RETURN,
};

type ValuesOf<T extends { [key: string]: unknown }> = T[keyof T];
export type TokenSetType = typeof token;
type KeyWordsKeyType = keyof typeof keywords;
export type TokenType = ValuesOf<TokenSetType>;

export interface Token {
  type: TokenType;
  literal: string;
}

export const lookupIdent = (ident: string): TokenType => {
  return keywords[ident as KeyWordsKeyType] || token.IDENT;
};
