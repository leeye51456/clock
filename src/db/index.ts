export type ModuleData<T = any> = {
  type: string;
  data: T;
};

let db: IDBDatabase | null = null;

// TODO - Eliminate callback hell
export function openDatabase(
  loadFromData: (key: number, moduleData: ModuleData) => any,
  defaultOperation: () => any,
): void {
  if (!window.indexedDB) {
    defaultOperation();
    return;
  }

  const request: IDBOpenDBRequest = window.indexedDB.open('clock', 1);

  request.onsuccess = function (event: Event) {
    db = (event.target as IDBOpenDBRequest).result;

    const transaction: IDBTransaction = db.transaction('module');
    const store: IDBObjectStore = transaction.objectStore('module');

    store.count().onsuccess = function (event: Event) {
      if ((event.target as IDBRequest).result === 0) {
        defaultOperation();
        return;
      }

      store.openCursor().onsuccess = function (event: Event) {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if (cursor) {
          loadFromData(cursor.key as number, cursor.value);
          cursor.continue();
        }
      };
    };
  };

  request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
    const db = (event.target as IDBOpenDBRequest).result;

    if (event.oldVersion === 0) {
      db.createObjectStore('module', { autoIncrement : true });
    }
  };
};

export function getDatabase(): IDBDatabase | null {
  return db;
};
