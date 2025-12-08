export declare class Lazy<T> {
  #private;
  constructor(fn: () => T);
  get hasValue(): boolean;
  get value(): T;
}
