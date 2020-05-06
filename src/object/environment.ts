/**
 * 名前に環境づけられた値を記録しておくために使うもの(P156)
 * 変数の束縛に使う
 * クラスで作る理由は、テストケースごとに作り直したいと言った要望があるから。
 * つまりただのmapでテーブルを使うだけなら不十分
 */

import { Obj } from "./object";

export default class Environment {
  private constructor(
    private store: { [key: string]: Obj },
    private outer?: Environment
  ) {}

  static of(store: any, outer?: Environment): Environment {
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

  static newEnclosedEnvironment(outer: Environment): Environment {
    const env = new Environment({}, undefined);
    env.outer = outer;
    return env;
  }
}
