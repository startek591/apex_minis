declare module '*.json' {
  const value: any;
  export default value;
}

// Allows filter to infer the filtered type, e.g.
// [1,'a'].filter((x): x is number => typeof x === 'number')
// has type `number[]`.
interface Array<T> {
  filter<U extends T>(pred: (a: T) => a is U): U[];
}
interface ReadonlyArray<T> {
  filter<U extends T>(pred: (a: T) => a is U): U[];
}

type Nullable<T> = { [P in keyof T]: T[P] | null };
