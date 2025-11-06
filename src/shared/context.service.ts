import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  run(context: Map<string, any>, callback: () => void) {
    this.asyncLocalStorage.run(context, callback);
  }

  get(key: string): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }
}
