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
  | ReturnStatement
  | LetStatement
  | ExpressionStatement;

export type TExpression =
  | IntegerLiteral
  | Boolean2
  | PrefixExpression
  | InfixExpression
  | IfExpression
  | Identifier
  | FunctionLiteral
  | CallExpression;

export type TNode = TStatement | TExpression;
