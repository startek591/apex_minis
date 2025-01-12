import { Store } from './store.service';

export interface SetOptions {
  persist?: boolean;
}

export abstract class PersistentStore<T extends object> extends Store<T> {
  protected abstract save(field: string, value: any): void;

  public set<K extends keyof T>(
    field: K,
    value: T[K],
    options: SetOptions = {}
  ): void {
    const values = {} as Partial<T>;
    values[field] = value;
    this.setMany(values, options);
  }

  setMany(values: Partial<T>, { persist = true }: SetOptions = {}): void {
    this.store.next(Object.assign({}, this.state, values));
    if (persist) {
      for (const [field, value] of Object.entries(values)) {
        this.save(field, value);
      }
    }
  }
}
