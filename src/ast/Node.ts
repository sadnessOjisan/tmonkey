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

export interface Statement extends Node {
  statementNode: () => void;
}

export interface Expression extends Node {
  expressionNode: () => void;
}

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

export type TNode =
  | BlockStatement
  | Boolean2
  | CallExpression
  | ExpressionStatement
  | FunctionLiteral
  | Identifier
  | IfExpression
  | InfixExpression
  | IntegerLiteral
  | LetStatement
  | PrefixExpression
  | Program
  | ReturnStatement;
