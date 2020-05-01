import { Node, TNode } from "../ast/Node";
import { ReturnValue, Integer } from "../object/object";
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

const evaluate = (node: Node, env: any): any => {
  switch (node.nodeType) {
    // Statements
    case Program:
      return evalProgram(node as Program, env);
    case BlockStatement:
      return evalBlockStatement(node, env);
    case ExpressionStatement:
      return Eval((node as ExpressionStatement).expression, env);
    case ReturnStatement:
      const val = evaluate((node as ReturnStatement).returnValue, env);
      if (isError(val)) {
        return val;
      }
      return ReturnValue.of(val);
    case LetStatement:
      const val = evaluate(node.value, env);
      if (isError(val)) {
        return val;
      }
      env.Set(node.Name.Value, val);
    // Expressions
    case IntegerLiteral:
      return Integer.of(node.value);

    case Boolean2:
      return nativeBoolToBooleanObject(node.Value);

    case PrefixExpression:
      const right = evaluate(node.Right, env);
      if (isError(right)) {
        return right;
      }
      return evalPrefixExpression(node.Operator, right);

    case InfixExpression:
      const left = evaluate(node.Left, env);
      if (isError(left)) {
        return left;
      }

      const right = Eval(node.Right, env);
      if (isError(right)) {
        return right;
      }

      return evalInfixExpression(node.Operator, left, right);

    case IfExpression:
      return evalIfExpression(node, env);

    case Identifier:
      return evalIdentifier(node, env);

    case FunctionLiteral:
      const params = node.parameters;
      const body = node.body;
      return Function2.of(params, env, body);

    case CallExpression:
      const fn = Eval(node.Function, env);
      if (isError(fn)) {
        return fn;
      }

      const args = evalExpressions(node.Arguments, env);
      if (args.length == 1 && isError(args[0])) {
        return args[0];
      }

      return applyFunction(fn, args);
  }

  return undefined;
};

const evalProgram = (program: Program, env: Environment): Obj => {
  var result: Obj;
  for (const statement of program.statements) {
    result = evaluate(statement, env);

    switch (result.type) {
      case ReturnValue:
        result = result.Value;
        break;
      case Error:
        result = result;
        break;
    }
  }

  return result;
};

const evalBlockStatement = (block: BlockStatement, env: Environment): Obj => {
  var result: Obj;

  for (const statement of block.statements) {
    result = evaluate(statement, env);

    if (result != undefined) {
      const rt = result.Type();
      if (rt == object.RETURN_VALUE_OBJ || rt == object.ERROR_OBJ) {
        return result;
      }
    }
  }
  return result;
};

const nativeBoolToBooleanObject = (input: boolean): Boolean => {
  if (input) {
    return object.TRUE;
  }
  return object.FALSE;
};

const evalPrefixExpression = (operator: string, right: Obj): Obj => {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError("unknown operator: %s%s", operator, right.Type());
  }
};

const evalInfixExpression = (operator: string, left: Obj, right: Obj): Obj => {
  if (left.Type() == object.INTEGER_OBJ && right.Type() == object.INTEGER_OBJ) {
    return evalIntegerInfixExpression(operator, left, right);
  } else if (operator == "==") {
    return nativeBoolToBooleanObject(left == right);
  } else if (operator == "!=") {
    return nativeBoolToBooleanObject(left != right);
  } else if (left.Type() != right.Type()) {
    return newError(
      "type mismatch: %s %s %s",
      left.Type(),
      operator,
      right.Type()
    );
  } else {
    return newError(
      "unknown operator: %s %s %s",
      left.Type(),
      operator,
      right.Type()
    );
  }
};

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

const evalMinusPrefixOperatorExpression = (right: Obj): Obj => {
  if (right.Type() != object.INTEGER_OBJ) {
    return newError("unknown operator: -%s", right.Type());
  }
  const value = right.Integer.Value;
  return Integer.of(-1 * value);
};

const evalIntegerInfixExpression = (
  operator: string,
  left,
  right: Obj
): Obj => {
  const leftVal = left.Integer.Value;
  const rightVal = right.Integer.Value;

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
      return newError(
        `unknown operator: ${left.Type()} ${operator} ${right.Type()}`
      );
  }
};

const evalIfExpression = (ie: IfExpression, env: Environment): Obj => {
  const condition = evaluate(ie.Condition, env);
  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(ie.Consequence, env);
  } else if (ie.Alternative != nil) {
    return evaluate(ie.Alternative, env);
  } else {
    return NULL;
  }
};

const evalIdentifier = (node: Identifier, env: Environment): Obj => {
  const val = env.Get(node.Value);
  if (!val) {
    return newError("identifier not found: " + node.Value);
  }

  return val;
};

const isTruthy = (obj: Obj): bool => {
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

const newError = (format: string): Error2 => {
  return Error2.of(format);
};

const isError = (obj: Obj): boolean => {
  if (obj != undefined) {
    return obj.Type() == object.ERROR_OBJ;
  }
  return false;
};

const evalExpressions = (exps: Expression[], env: Environment): Obj[] => {
  var result: Obj[];
  for (const e of exps) {
    const evaluated = evaluate(e, env);
    if (isError(evaluated)) {
      return Obj.of(evaluated);
    }
    result = [...result, evaluated];
  }
  return result;
};

const applyFunction = (fn: Obj, args: Obj[]): Obj => {
  const fn2 = fn(Function);
  if (!fn2) {
    return newError("not a function: %s", fn.Type());
  }
  const extendedEnv = extendFunctionEnv(fn2, args);
  const evaluated = evaluate(fn2.Body, extendedEnv);
  return unwrapReturnValue(evaluated);
};

const extendFunctionEnv = (fn: Function, args: Obj[]): Environment => {
  const env = object.NewEnclosedEnvironment(fn.Env);

  for (let l = 0; fn.parameters.length; l++) {
    env.Set(parameters[l].Value, args[l]);
  }

  for (let i = 0; i < fn.parameters.length; i++) {
    env.Set(fn.parameters[i].value.Value, args[i]);
  }
  return env;
};

const unwrapReturnValue = (obj: Obj): Obj => {
  return obj.retunValue || obj;
};
