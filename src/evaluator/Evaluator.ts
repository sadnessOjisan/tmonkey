/* eslint-disable @typescript-eslint/no-use-before-define */

import { TNode, TExpression } from "../ast/Node";
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
  let result;

  for (const statement of program.statements) {
    console.info("<evalProgram> statement: ", statement);
    result = evaluate(statement, env);
    if (result instanceof ReturnValue) {
      return result.value;
    } else if (result instanceof ErrorO) {
      return result;
    }
    // TODO: 式だけの場合ここで値を返してもいいかも
  }

  if (!result) {
    throw new Error("no program");
  }

  return result;
};

/**
 * ブロックに含まれる文を評価する。結果がnullじゃないもにに出会うまで評価し返す
 * @param block
 * @param env
 */
const evalBlockStatement = (block: BlockStatement, env: Environment): Obj => {
  let result;

  for (const statement of block.statements) {
    result = evaluate(statement, env);

    if (result != undefined) {
      const rt = result.type();
      if (rt == objectType.RETURN_VALUE_OBJ || rt == objectType.ERROR_OBJ) {
        return result;
      }
    }
  }
  // TODO: ここがnullのときどうする？
  return result as Obj;
};

/**
 * boolenをオブジェクトシステムにおけるBooleanに変換する関数
 * @param input boolean
 */
const nativeBoolToBooleanObject = (input: boolean): BooleanO => {
  if (input) {
    return TRUE;
  }
  return FALSE;
};

/**
 * 演算子付きオペランドを評価する.
 * Monkeyでは!と-に対応する (p131)
 * @param operator
 * @param right
 */
const evalPrefixExpression = (operator: string, right: Obj): Obj => {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError("unknown operator");
  }
};

/**
 * 中値演算子を評価する. 数字の足し算、左右の比較をサポート
 * @param operator
 * @param left
 * @param right
 */
const evalInfixExpression = (operator: string, left: Obj, right: Obj): Obj => {
  if (
    left.type() == objectType.INTEGER_OBJ &&
    right.type() == objectType.INTEGER_OBJ
  ) {
    return evalIntegerInfixExpression(operator, left, right);
  } else if (operator == "==") {
    return nativeBoolToBooleanObject(left == right);
  } else if (operator == "!=") {
    return nativeBoolToBooleanObject(left != right);
  } else if (left.type() != right.type()) {
    return newError("type mismatch");
  } else {
    return newError("unknown operator");
  }
};

/**
 * !演算子によるbooleanの反転
 * @param right
 */
const evalBangOperatorExpression = (right: Obj): Obj => {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
};

/**
 * -演算子による数値の反転
 * @param right
 */
const evalMinusPrefixOperatorExpression = (right: Obj): Obj => {
  if (!(right instanceof Integer)) {
    return newError("unknown operator");
  }

  return Integer.of(-1 * right.value);
};

/**
 * 中値演算子を評価
 * @param operator
 * @param left
 * @param right
 */
const evalIntegerInfixExpression = (
  operator: string,
  left: Obj,
  right: Obj
): Obj => {
  if (!(right instanceof Integer && left instanceof Integer)) {
    return newError("unknown operator");
  }

  const leftVal = left.value;
  const rightVal = right.value;

  switch (operator) {
    case "+":
      return Integer.of(leftVal + rightVal);
    case "-":
      return Integer.of(leftVal - rightVal);
    case "*":
      return Integer.of(leftVal * rightVal);
    case "/":
      return Integer.of(leftVal / rightVal);
    case "<":
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case ">":
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case "==":
      return nativeBoolToBooleanObject(leftVal == rightVal);
    case "!=":
      return nativeBoolToBooleanObject(leftVal != rightVal);
    default:
      return newError("unknown operator");
  }
};

const evalIfExpression = (ie: IfExpression, env: Environment): Obj => {
  console.log("<evalIfExpression> ie", ie);
  const condition = evaluate(ie.condition, env);
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
  return val.obj;
};

const isTruthy = (obj: Obj): boolean => {
  switch (obj) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
};

const newError = (format: string): ErrorO => {
  return ErrorO.of(format);
};

/**
 * objectがエラーかどうかを判定する
 * @param obj
 */
const isError = (obj: Obj): boolean => {
  if (obj != undefined) {
    return obj.type() == objectType.ERROR_OBJ;
  }
  return false;
};

/**
 * 式のリストを評価する. 関数の引数の評価に使う
 * @param exps
 * @param env
 */
const evalExpressions = (exps: TExpression[], env: Environment): Obj[] => {
  let result = [] as Obj[];

  for (const exp of exps) {
    const evaluated = evaluate(exp, env);
    if (isError(evaluated)) {
      return [evaluated];
    }
    result = [...result, evaluated];
  }
  return result;
};

/**
 * 関数を実行して返す
 * @param fn
 * @param args
 */
const applyFunction = (fn: Obj, args: Obj[]): Obj => {
  if (!(fn instanceof Function)) {
    return newError("not a function");
  }
  console.info("<applyFunction> fn:", fn);
  const extendedEnv = extendFunctionEnv(fn, args);
  const evaluated = evaluate(fn.body, extendedEnv);
  return unwrapReturnValue(evaluated);
};

/**
 * 環境の拡張. closureの実現
 * @param fn
 * @param args
 */
const extendFunctionEnv = (fn: Function, args: Obj[]): Environment => {
  const env = Environment.newEnclosedEnvironment(fn.env);
  for (let idx = 0; idx < fn.parameters.length; idx++) {
    const element = fn.parameters[idx];
    env.set(element.value, args[idx]);
  }
  return env;
};

/**
 * そのobjectがreturn valueを持ってたらreturn valueを返し、そうでないならobjctを返す
 * @param obj
 */
const unwrapReturnValue = (obj: any): Obj => {
  return obj.returnValue || obj;
};

/**
 * ASTのNODEを評価する
 * @param node
 * @param env
 */
export const evaluate = (node: TNode, env: Environment): any => {
  console.info("<evaluate> node: ", node);
  if (node instanceof Program) {
    console.info("<evaluate> node: ", node);
    return evalProgram(node, env); // ブロックの塊やネストされたブロックを評価する
  } else if (node instanceof BlockStatement) {
    return evalBlockStatement(node, env); // ブロック一つを評価する
  } else if (node instanceof ExpressionStatement) {
    return evaluate(node.expression, env); // 式を評価する
  } else if (node instanceof ReturnStatement) {
    const val = evaluate(node.returnValue, env);
    if (isError(val)) {
      return val;
    }
    return ReturnValue.of(val);
  } else if (node instanceof LetStatement) {
    console.info("<evaluate> LetStatement: ", node);
    const val = evaluate(node.value, env);
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
    console.info("<FunctionLiteral> node:", node);
    const params = node.parameters;
    const body = node.body;
    return Function.of(params, body, env);
  } else if (node instanceof CallExpression) {
    console.info("<CallExpression> node:", node);
    const fn = evaluate(node.func, env);
    if (isError(fn)) {
      return fn;
    }
    const args = evalExpressions(node.args, env);
    if (args.length == 1 && isError(args[0])) {
      return args[0];
    }
    console.info("<CallExpression> fn:", fn);
    console.info("<CallExpression> args:", args);
    return applyFunction(fn, args);
  } else {
    console.error("node:", node);
    throw new Error("unexpected");
  }
};
