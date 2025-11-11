import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  // 初始化上下文的方法
  initializeContext() {
    const context = new Map<string, any>();
    this.asyncLocalStorage.enterWith(context);
    return context;
  }

  run<T>(context: Map<string, any>, callback: () => Promise<T> | T): Promise<T> {
    return new Promise((resolve, reject) => {
      this.asyncLocalStorage.run(context, async () => {
        try {
          const result = await callback();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  get(key: string): any {
    const store = this.asyncLocalStorage.getStore();
    return store?.get(key);
  }

  set(key: string, value: any): void {
    const store = this.asyncLocalStorage.getStore();
    store?.set(key, value);
  }

  // 添加一个辅助方法，用于获取整个上下文
  getAll(): Map<string, any> | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
