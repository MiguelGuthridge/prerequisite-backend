import { DataStore } from '../types';
import fs from 'fs';

const DATABASE_LOCATION = 'database.json';

/**
 * Returns the default data
 * @returns a new empty data store
 */
export const defaultData = (): DataStore => {
  return {
    users: {},
    projects: {},
    tasks: {},
  };
};

const loadData = (): DataStore => {
  if (!fs.existsSync(DATABASE_LOCATION)) {
    return defaultData();
  }
  const data = fs.readFileSync(DATABASE_LOCATION);
  return JSON.parse(data.toString('utf-8'));
};

export const saveData = () => {
  fs.writeFileSync(
    DATABASE_LOCATION,
    JSON.stringify(data)
  );
};

/** Data store before I make it use a proper database */
let data = loadData();

/**
 * Get the data
 * @returns a reference to the data store
 */
export const getData = (): DataStore => {
  return data;
};

/**
 * Set a new data store
 * @param newData new data to set
 */
export const setData = (newData: DataStore) => {
  data = newData;
  saveData();
};
