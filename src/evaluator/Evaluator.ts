import { Node, TNode, Expression } from "../ast/Node";
import { ReturnValue, Integer, Obj, objectType, Null, ErrorO ,BooleanO} from "../object/object";
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
const TRUE = BooleanO.of( true);
const FALSE = BooleanO.of( false);

const evalProgram = (program: Program, env: Environment): Obj => {
  let result = (null as any) as Obj;
  for (const statement of program.statements) {
    result = evaluate(statement, env);
    switch (result.type()) {
      case objectType.RETURN_VALUE_OBJ:
        result = (result as ReturnValue).value;
        break;
      case objectType.ERROR_OBJ:
        result = result;
        break;
    }
  }

  if (!result) {
    throw new Error();
  }

  return result;
};

const evalBlockStatement = (block: BlockStatement, env: Environment): Obj => {
  let result = (null as any) as Obj;

  for (const statement of block.statements) {
    result = evaluate(statement, env);

    if (result != undefined) {
      const rt = result.type();
      if (rt == objectType.RETURN_VALUE_OBJ || rt == objectType.ERROR_OBJ) {
        return result;
      }
    }
  }
  return result;
};

const nativeBoolToBooleanObject = (input: boolean): BooleanO => {
  if (input) {
    return TRUE;
  }
  return FALSE;
};

const evalPrefixExpression = (operator: string, right: Obj): Obj => {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError("unknown operator: %s%s");
  }
};

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
    return newError(
      "type mismatch: %s %s %s"
    );
  } else {
    return newError(
      "unknown operator: %s %s %s",
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
  if (right.type() != objectType.INTEGER_OBJ) {
    return newError("unknown operator: -%s");
  }
  const value = right.ingetger.value;
  return Integer.of(-1 * value);
};

const evalIntegerInfixExpression = (
  operator: string,
  left: Obj,
  right: Obj
): Obj => {
  const leftVal = left.ingetger.value;
  const rightVal = right.ingetger.value;

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
        `unknown operator: ${left.type()} ${operator} ${right.type()}`
      );
  }
};

const evalIfExpression = (ie: IfExpression, env: Environment): Obj => {
  const condition = evaluate(ie.condition, env);
  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluate(ie.consequence, env);
  } else if (ie.alternative != undefined) {
    return evaluate(ie.alternative, env);
  } else {
    return NULL;
  }
};

const evalIdentifier = (node: Identifier, env: Environment): Obj => {
  const val = env.get(node.value);
  if (!val) {
    return newError("identifier not found: " + node.Value);
  }

  return val;
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

const isError = (obj: Obj): boolean => {
  if (obj != undefined) {
    return obj.type() == objectType.ERROR_OBJ;
  }
  return false;
};

const evalExpressions = (exps: Expression[], env: Environment): Obj[] => {
  var result: Obj[];
  for (const e of exps) {
    const evaluated = evaluate(e, env);
    if (isError(evaluated)) {
      return [{type: ()=>"", inspect: ()=>""}]
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

const unwrapReturnValue = (obj: any): Obj => {
  return obj.retunValue || obj;
};


const evaluate = (node: Node, env: Environment): any => {
    switch (node.nodeType) {
      // Statements
      case Program:
        return evalProgram(node as Program, env);
      case BlockStatement:
        return evalBlockStatement(node as BlockStatement, env);
      case ExpressionStatement:
        return evaluate((node as ExpressionStatement).expression, env);
      case ReturnStatement:
        const val = evaluate((node as ReturnStatement).returnValue, env);
        if (isError(val)) {
          return val;
        }
        return ReturnValue.of(val);
      case LetStatement:
        if (isError(evaluate((node as LetStatement).value, env))) {
          return val;
        }
        env.set((node as LetStatement).name.value, val);
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
  
        const right = evaluate(node.Right, env);
        if (isError(right)) {
          return right;
        }
  
        return evalInfixExpression(node.Operator, left, right);
  
      case IfExpression:
        return evalIfExpression(node as IfExpression, env);
  
      case Identifier:
        return evalIdentifier(node as Identifier, env);
  
      case FunctionLiteral:
        return Function2.of(
          (node as FunctionLiteral).parameters,
          env,
          (node as FunctionLiteral).body
        );
  
      case CallExpression:
        if (isError(evaluate((node as CallExpression).func, env))) {
          return (node as CallExpression).func;
        }
  
        if ((node as CallExpression).args.length == 1 && isError(arevalExpressions((node as CallExpression).args, env)gs[0])) {
          return (node as CallExpression).args[0];
        }
  
        return applyFunction((node as CallExpression).func, (node as CallExpression).args);
    }
  
    return undefined;
  };
  
