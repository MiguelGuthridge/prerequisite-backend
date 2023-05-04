import { DataStore } from '../types';

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

/** Data store before I make it use a proper database */
let data = defaultData();

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
};
