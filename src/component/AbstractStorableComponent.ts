import { getDatabase, ModuleData } from '../db';
import AbstractComponent from './AbstractComponent';

abstract class AbstractStorableComponent<T> extends AbstractComponent {
  protected databaseKey: number | null;

  constructor(key?: number) {
    super();

    this.databaseKey = typeof key === 'number' && key > 0 ? key : null;
  }

  draw(baseNode: HTMLElement | null): void {
    super.draw(baseNode);

    if (this.baseNode === baseNode && this.databaseKey !== null) {
      this.putIntoDatabase();
    }
  }

  protected putIntoDatabase(): void {
    const db: IDBDatabase | null = getDatabase();
    if (!db) {
      return;
    }

    const transaction: IDBTransaction = db.transaction('module', 'readwrite');
    const store: IDBObjectStore = transaction.objectStore('module');
    const request: IDBRequest = store.put(this.moduleData, this.databaseKey || undefined);
    request.onsuccess = (event: Event) => {
      if (!this.databaseKey) {
        this.databaseKey = (event.target as IDBRequest).result as number;
      }
    };
  };

  protected abstract get moduleData(): ModuleData<T>;
}

export default AbstractStorableComponent;
