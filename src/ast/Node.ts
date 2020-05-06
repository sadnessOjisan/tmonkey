import BlockStatement from "./BlockStatement";
import Boolean2 from "./Boolean";
import CallExpression from "./CallExpression";
import ExpressionStatement from "./ExpressionStatement";
import FunctionLiteral from "./FunctionLiteral";
import Identifier from "./Identifier";
import IfExpression from "./IfExpression";
import InfixExpression from "./InfixExpression";
import IntegerLiteral from "./IntegerLiteral";
import LetStatement from "./LetStatement";
import PrefixExpression from "./PrefixExpression";
import Program from "./Program";
import ReturnStatement from "./ReturnStatement";

export interface Node {
  nodeType: NodeType; // TS require this because it dont have type assertion...
  tokenLiteral: () => string;
  toString: () => string;
}

/**
 * 文
 */
export interface Statement extends Node {
  statementNode: () => void;
}

/**
 * 式
 */
export interface Expression extends Node {
  expressionNode: () => void;
}

export type TStatement =
  | Program
  | BlockStatement
  | ExpressionStatement
  | ReturnStatement
  | LetStatement;

export type TExpression =
  | IntegerLiteral
  | Boolean2
  | PrefixExpression
  | InfixExpression
  | IfExpression
  | Identifier
  | FunctionLiteral
  | CallExpression;

export type NodeType =
  | typeof BlockStatement
  | typeof Boolean2
  | typeof CallExpression
  | typeof ExpressionStatement
  | typeof FunctionLiteral
  | typeof Identifier
  | typeof IfExpression
  | typeof InfixExpression
  | typeof IntegerLiteral
  | typeof LetStatement
  | typeof PrefixExpression
  | typeof Program
  | typeof ReturnStatement;

export type TNode = TStatement | TExpression;
