import {
  combineLatest,
  MonoTypeOperatorFunction,
  NEVER,
  Observable,
} from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  map,
  switchMap,
} from 'rxjs/operators';

export interface StoreProvider<T> {
  getValue(): T;
  asObservable(): Observable<T>;
  next(value: T): void;
}

export abstract class Store<T extends object> {
  constructor(protected readonly store: StoreProvider<T>) {}

  public get state(): Readonly<T> {
    return this.store.getValue();
  }

  public when<K extends keyof T, U>(
    field: K,
    predicate: T[K] | ((value: T[K]) => boolean)
  ): MonoTypeOperatorFunction<U> {
    const isValue =
      predicate instanceof Function
        ? predicate
        : (value: T[K]) => value === predicate;
    return (observable) =>
      this.get(field).pipe(
        switchMap((value) => (isValue(value) ? observable : NEVER))
      );
  }

  public get<K extends keyof T>(field: K): Observable<T[K]>;
  public get<K1 extends keyof T, K2 extends keyof T>(
    field1: K1,
    field2: K2
  ): Observable<[T[K1], T[K2]]>;
  public get<K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
    field1: K1,
    field2: K2,
    field3: K3
  ): Observable<[T[K1], T[K2], T[K3]]>;
  public get<
    K1 extends keyof T,
    K2 extends keyof T,
    K3 extends keyof T,
    K4 extends keyof T
  >(
    field1: K1,
    field2: K2,
    field3: K3,
    field4: K4
  ): Observable<[T[K1], T[K2], T[K3], T[K4]]>;
  public get<
    K1 extends keyof T,
    K2 extends keyof T,
    K3 extends keyof T,
    K4 extends keyof T,
    K5 extends keyof T
  >(
    field1: K1,
    field2: K2,
    field3: K3,
    field4: K4,
    field5: K5
  ): Observable<[T[K1], T[K2], T[K3], T[K4], T[K5]]>;
  public get<
    K1 extends keyof T,
    K2 extends keyof T,
    K3 extends keyof T,
    K4 extends keyof T,
    K5 extends keyof T,
    K6 extends keyof T
  >(
    field1: K1,
    field2: K2,
    field3: K3,
    field4: K4,
    field5: K5,
    field6: K6
  ): Observable<[T[K1], T[K2], T[K3], T[K4], T[K5], T[K6]]>;
  /**
   * Get one or more field values or the entire store object if no fields specified.
   * @param fields one or more field names to get the value of.
   */
  public get<K extends keyof T>(...fields: K[]): Observable<any> {
    switch (fields.length) {
      case 0:
        return this.store.asObservable();
      case 1:
        return this.store
          .asObservable()
          .pipe(pluck(fields[0]), distinctUntilChanged());
      default:
        const observables = fields.map((field) => this.get(field));
        // Debounce to ensure that properties set simultaneously don't emit
        // sequentially and are instead grouped into a single emission.
        return combineLatest(observables).pipe(debounceTime(0));
    }
  }
}
