import { Token } from "../token/token ";
import { Expression } from "./Node";
import BlockStatement from "./BlockStatement";
import Identifier from "./Identifier";

export default class FunctionLiteral implements Expression {
  public readonly nodeType = FunctionLiteral;
  private constructor(
    private token: Token,
    private _parameters?: Identifier[],
    private _body?: BlockStatement
  ) {}

  static of(
    token: Token,
    parameters?: Identifier[],
    body?: BlockStatement
  ): FunctionLiteral {
    return new FunctionLiteral(token, parameters, body);
  }

  get parameters(): Identifier[] {
    if (!this._parameters) {
      throw new Error("unsetted val");
    }
    return this._parameters;
  }

  set parameters(parameters: Identifier[]) {
    this._parameters = parameters;
  }

  get body(): BlockStatement {
    if (!this._body) {
      throw new Error("unsetted");
    }
    return this._body;
  }

  set body(blockStatement: BlockStatement) {
    this._body = blockStatement;
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return `${this.tokenLiteral()}(${this.parameters?.join(
      ","
    )})${this.body.toString()}`;
  }
}
