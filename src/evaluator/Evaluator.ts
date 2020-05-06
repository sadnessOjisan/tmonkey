/* eslint-disable @typescript-eslint/no-use-before-define */

import { Node, TNode, Expression } from "../ast/Node";
import {
  ReturnValue,
  Integer,
  Obj,
  objectType,
  Null,
  ErrorO,
  BooleanO,
  Function,
} from "../object/object";
import IntegerLiteral from "../ast/IntegerLiteral";
import Program from "../ast/Program";
import BlockStatement from "../ast/BlockStatement";
import ExpressionStatement from "../ast/ExpressionStatement";
import ReturnStatement from "../ast/ReturnStatement";
import LetStatement from "../ast/LetStatement";
import Boolean2 from "../ast/Boolean";
import PrefixExpression from "../ast/PrefixExpression";
import InfixExpression from "../ast/InfixExpression";
import IfExpression from "../ast/IfExpression";
import Identifier from "../ast/Identifier";
import FunctionLiteral from "../ast/FunctionLiteral";
import CallExpression from "../ast/CallExpression";
import Environment from "../object/environment";

const NULL = Null.of();
const TRUE = BooleanO.of(true);
const FALSE = BooleanO.of(false);

const evalProgram = (program: Program, env: Environment): Obj => {
  // no op
};

/**
 * ブロックに含まれる文を評価する。結果がnullじゃないもにに出会うまで評価し返す
 * @param block
 * @param env
 */
const evalBlockStatement = (block: BlockStatement, env: Environment): Obj => {
  // no op
};

/**
 * boolenをオブジェクトシステムにおけるBooleanに変換する関数
 * @param input boolean
 */
const nativeBoolToBooleanObject = (input: boolean): BooleanO => {
  // no op
};

/**
 * 演算子付きオペランドを評価する.
 * Monkeyでは!と-に対応する (p131)
 * @param operator
 * @param right
 */
const evalPrefixExpression = (operator: string, right: Obj): Obj => {
  // no op
};

/**
 * 中値演算子を評価する
 * @param operator
 * @param left
 * @param right
 */
const evalInfixExpression = (operator: string, left: Obj, right: Obj): Obj => {
  // no op
};

const evalBangOperatorExpression = (right: Obj): Obj => {
  // no op
};

const evalMinusPrefixOperatorExpression = (right: Obj): Obj => {
  // no op
};

const evalIntegerInfixExpression = (
  operator: string,
  left: Obj,
  right: Obj
): Obj => {
  // no op
};

const evalIfExpression = (ie: IfExpression, env: Environment): Obj => {
  const condition = evaluate(ie, env);
  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(ie.consequence, env); // if節を実行
  } else if (ie.alternative != undefined) {
    return evaluate(ie.alternative, env); // else節を実行
  } else {
    return NULL;
  }
};

const evalIdentifier = (node: Identifier, env: Environment): Obj => {
  const val = env.get(node.value);
  if (!val) {
    return newError("identifier not found: " + node.value);
  }

  return val;
};

const isTruthy = (obj: TNode): boolean => {
  // no op
};

const newError = (format: string): ErrorO => {
  // no op
};

const isError = (obj: Obj): boolean => {
  // no op
};

/**
 * 式を評価する
 * @param exps
 * @param env
 */
const evalExpressions = (exps: Expression[], env: Environment): Obj[] => {
  // no op
};

const applyFunction = (fn: Obj, args: Obj[]): Obj => {
  // no op
};

const extendFunctionEnv = (fn: Function, args: Obj[]): Environment => {
  // no op
};

const unwrapReturnValue = (obj: any): Obj => {
  // no op
};

/**
 * ASTのNODEを評価する
 * @param node
 * @param env
 */
const evaluate = (node: TNode, env: Environment): Obj => {
  if (node instanceof Program) {
    return evalProgram(node, env); // ブロックの塊やネストされたブロックを評価する
  } else if (node instanceof BlockStatement) {
    return evalBlockStatement(node, env); // ブロック一つを評価する
  } else if (node instanceof ExpressionStatement) {
    return evaluate(node, env); // 式を評価する
  } else if (node instanceof ReturnStatement) {
    const val = evaluate(node, env);
    if (isError(val)) {
      return val;
    }
    return ReturnValue.of(val);
  } else if (node instanceof LetStatement) {
    const val = evaluate(node, env);
    if (isError(val)) {
      return val;
    }
    env.set(node.name.value || "undefined", val);
  } else if (node instanceof IntegerLiteral) {
    return Integer.of(node.value);
  } else if (node instanceof Boolean2) {
    return nativeBoolToBooleanObject(node.value);
  } else if (node instanceof PrefixExpression) {
    const right = evaluate(node.right, env);
    if (isError(right)) {
      return right;
    }
    return evalPrefixExpression(node.operator, right);
  } else if (node instanceof InfixExpression) {
    const left = evaluate(node.left, env);
    if (isError(left)) {
      return left;
    }

    const right = evaluate(node.right, env);
    if (isError(right)) {
      return right;
    }
    return evalInfixExpression(node.operator, left, right);
  } else if (node instanceof IfExpression) {
    return evalIfExpression(node, env);
  } else if (node instanceof Identifier) {
    return evalIdentifier(node, env);
  } else if (node instanceof FunctionLiteral) {
    const params = node.parameters;
    const body = node.body;
    return Function.of(params, body, env);
  } else if (node instanceof CallExpression) {
    const fn = evaluate(node.func, env);
    if (isError(fn)) {
      return fn;
    }

    const args = evalExpressions(node.args, env);
    if (args.length == 1 && isError(args[0])) {
      return args[0];
    }

    return applyFunction(fn, args);
  } else {
    throw new Error("unexpected");
  }
};
