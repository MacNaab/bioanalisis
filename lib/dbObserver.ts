// utils/dbObserver.ts
import { EventEmitter } from 'events';

class DBObserver extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }
}

export const dbObserver = new DBObserver();

// Après chaque modification de la DB :
dbObserver.emit('db-update');