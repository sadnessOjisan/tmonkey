import { Node, TNode } from "../ast/Node"
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


const evaluate = (node:Node, env:any):any => {
    switch (node.nodeType) {
        // Statements
        case Program:
            return evalProgram(node as Program, env)
        case BlockStatement:
            return evalBlockStatement(node, env)
            case ExpressionStatement:
            return Eval((node as ExpressionStatement).expression, env)
        case ReturnStatement:
            const val = evaluate((node as ReturnStatement).returnValue, env)
            if (isError(val)) {
                return val
            }
            return ReturnValue.of(val)
        case LetStatement:
            const val = evaluate(node.value, env)
            if (isError(val)) {
                return val
            }
            env.Set(node.Name.Value, val)
        // Expressions
        case IntegerLiteral:
            return Integer.of(node.value)

        case Boolean2:
            return nativeBoolToBooleanObject(node.Value)

        case PrefixExpression:
            const   right = evaluate(node.Right, env)
            if(isError(right)) {
                return right
            }
            return evalPrefixExpression(node.Operator, right)

        case InfixExpression:
            const   left = evaluate(node.Left, env)
            if (isError(left)) {
                return left
            }

            const   right = Eval(node.Right, env)
            if isError(right) {
                return right
            }
    
            return evalInfixExpression(node.Operator, left, right)
    
        case IfExpression:
            return evalIfExpression(node, env)
    
        case Identifier:
            return evalIdentifier(node, env)
    
        case FunctionLiteral:
            const   params = node.parameters
            const   body = node.body
            return &object.Function{Parameters: params, Env: env, Body: body}
    
        case CallExpression:
            const  fn = Eval(node.Function, env)
            if (isError(fn)) {
                return fn
            }
    
           const args = evalExpressions(node.Arguments, env)
            if (args.length == 1 && isError(args[0])) {
                return args[0]
            }
    
            return applyFunction(fn, args)
        }
    
        return undefined
};
