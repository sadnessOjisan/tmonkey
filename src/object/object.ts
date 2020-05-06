import Identifier from "../ast/Identifier";
import BlockStatement from "../ast/BlockStatement";
import Environment from "./environment";

export const objectType = {
  NULL_OBJ: "NULL",
  ERROR_OBJ: "ERROR",
  INTEGER_OBJ: "INTEGER",
  BOOLEAN_OBJ: "BOOLEAN",
  RETURN_VALUE_OBJ: "RETURN_VALUE",
  FUNCTION_OBJ: "FUNCTION",
};

type ObjectType = string;

export interface Obj {
  type: () => ObjectType;
  inspect: () => string;
}

export class Integer implements Obj {
  private constructor(private _value: number) {}

  get value(): number {
    return this._value;
  }

  static of(value: number): Integer {
    return new Integer(value);
  }

  type(): ObjectType {
    return objectType.INTEGER_OBJ;
  }

  inspect(): string {
    return `${this._value}`;
  }
}

export class BooleanO implements Obj {
  private constructor(private value: boolean) {}

  static of(value: boolean): BooleanO {
    return new BooleanO(value);
  }

  type(): ObjectType {
    return objectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return `${this.value}`;
  }
}

export class Null implements Obj {
  static of(): Null {
    return new Null();
  }

  type(): ObjectType {
    return objectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return `null`;
  }
}

export class ReturnValue implements Obj {
  private constructor(private _value: Obj) {}

  get value(): Obj {
    return this._value;
  }

  static of(value: Obj): ReturnValue {
    return new ReturnValue(value);
  }

  type(): ObjectType {
    return objectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return this.value.inspect();
  }
}

export class ErrorO implements Obj {
  private constructor(private message: string) {}

  static of(message: string): ErrorO {
    return new ErrorO(message);
  }

  type(): ObjectType {
    return objectType.BOOLEAN_OBJ;
  }

  inspect(): string {
    return `ERROR: ${this.message}`;
  }
}

export class Function implements Obj {
  private constructor(
    private _parameters: Identifier[],
    private _body: BlockStatement,
    private _env: Environment
  ) {}

  static of(
    parameters: Identifier[],
    body: BlockStatement,
    env: Environment
  ): Function {
    return new Function(parameters, body, env);
  }

  get parameters(): Identifier[] {
    return this._parameters;
  }

  get body(): BlockStatement {
    return this._body;
  }

  get env(): Environment {
    return this._env;
  }
  type(): ObjectType {
    return objectType.FUNCTION_OBJ;
  }

  inspect(): string {
    return `fn(${this.parameters.join(",")}){\n
        ${this.body.toString()}
        \n}`;
  }
}
