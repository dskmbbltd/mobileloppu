import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test.db');

export default db;