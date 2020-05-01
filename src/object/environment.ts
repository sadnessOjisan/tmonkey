import { Obj } from "./object";

export default class Environment {
  private constructor(
    private store: { [key: string]: Obj },
    private outer: Environment
  ) {}

  static of(store: any, outer: Environment): Environment {
    return new Environment(store, outer);
  }

  get(name: string): { obj: Obj; ok: boolean } {
    const object = this.store[name]
      ? this.store[name]
      : this.outer
      ? this.outer.get(name).obj
      : ({} as Obj);

    return { obj: object, ok: true };
  }

  set(name: string, val: Obj): Obj {
    this.store[name] = val;
    return val;
  }
}
