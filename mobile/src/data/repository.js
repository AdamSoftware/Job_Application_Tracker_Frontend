import * as SQLite from 'expo-sqlite'
import { createDemoWorkspace } from './demoWorkspace'

const DATABASE_NAME = 'trackr-workspace.db'
const ROW_ID = 'primary'
let databasePromise

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME)
      await db.execAsync('PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS workspace (id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL, updated_at TEXT NOT NULL);')
      return db
    })()
  }
  return databasePromise
}

export async function loadWorkspace() {
  const db = await getDatabase()
  const row = await db.getFirstAsync('SELECT payload FROM workspace WHERE id = ?', ROW_ID)
  if (!row?.payload) {
    const initial = createDemoWorkspace()
    await saveWorkspace(initial)
    return initial
  }
  const parsed = JSON.parse(row.payload)
  return { ...createDemoWorkspace(), ...parsed }
}

export async function saveWorkspace(workspace) {
  const db = await getDatabase()
  const updatedAt = new Date().toISOString()
  await db.runAsync('INSERT OR REPLACE INTO workspace (id, payload, updated_at) VALUES (?, ?, ?)', ROW_ID, JSON.stringify({ ...workspace, lastSavedAt: updatedAt }), updatedAt)
}
