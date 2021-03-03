export type ModuleData<T = any> = {
  type: string;
  data: T;
};

const databaseName: string = 'clock';
const storeName: string = 'module';
let db: IDBDatabase | null = null;

function openDatabase(
  name: string,
  version: number,
  onupgradeneeded: (event: IDBVersionChangeEvent) => any,
): Promise<Event> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = window.indexedDB.open(name, version);
    request.onsuccess = resolve;
    request.onerror = reject;
    request.onupgradeneeded = onupgradeneeded;
  });
}

export async function initializeFromDatabase(
  loadFromData: (key: number, moduleData: ModuleData) => any,
  defaultOperation: () => any,
): Promise<void> {
  if (!window.indexedDB) {
    defaultOperation();
    return;
  }

  const event: Event = await openDatabase(databaseName, 1, (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result;

    if (event.oldVersion === 0) {
      db.createObjectStore(storeName, { autoIncrement : true });
    }
  });

  db = (event.target as IDBOpenDBRequest).result;

  const tx: IDBTransaction = db.transaction(storeName);
  const store: IDBObjectStore = tx.objectStore(storeName);

  let count = 0;
  store.openCursor().onsuccess = (event: Event) => {
    const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
    if (cursor) {
      count += 1;
      loadFromData(cursor.key as number, cursor.value);
      cursor.continue();
    } else if (count === 0) {
      defaultOperation();
    }
  };
};

export function getDatabase(): IDBDatabase | null {
  return db;
};
