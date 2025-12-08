export class Lazy {
  #value;
  #fn;
  constructor(fn) {
    this.#fn = fn;
  }
  get hasValue() {
    return this.#value != undefined;
  }
  get value() {
    if (this.#value == undefined) {
      this.#value = this.#fn();
    }
    return this.#value;
  }
}
