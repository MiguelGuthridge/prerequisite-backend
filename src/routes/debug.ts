import { Router } from 'express';
import { defaultData, setData } from '../data/data';

const debug = Router();

debug.delete('/clear', (req, res) => {
  setData(defaultData());
  res.json({});
});

debug.get('/echo', (req, res) => {
  const { value } = req.query;
  console.log(`[ ECHO ] ${value}`);
  res.json({ value });
});

export default debug;
