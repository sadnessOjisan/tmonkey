import { Token } from "../token/token ";
import { Expression } from "./Node";
import BlockStatement from "./BlockStatement";

export default class IfExpression implements Expression {
  public readonly nodeType = IfExpression;
  constructor(
    private token?: Token,
    private _condition?: Expression,
    private _consequence?: BlockStatement,
    private _alternative?: BlockStatement
  ) {}

  static of(token?: Token): IfExpression {
    return new IfExpression(token);
  }

  get alternative(): BlockStatement | undefined {
    return this._alternative;
  }

  set alternative(alternative: BlockStatement | undefined) {
    this._alternative = alternative;
  }

  get condition() {
    return this._condition;
  }

  set condition(condition: Expression | undefined) {
    this._condition = condition;
  }

  get consequence(): BlockStatement | undefined {
    return this._consequence;
  }

  set consequence(consequence: BlockStatement | undefined) {
    this._consequence = consequence;
  }

  expressionNode(): void {
    return;
  }

  tokenLiteral(): string {
    return this.token ? this.token.literal : "";
  }

  toString(): string {
    return `if${this.condition?.toString()}" "${this.consequence?.toString()}" "${
      this.alternative != null ? `else ${this.alternative.toString()}` : ``
    }`;
  }
}
