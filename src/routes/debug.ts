import { Router } from 'express';
import { defaultData, setData } from '../data';

const debug = Router();

debug.delete('/clear', (req, res) => {
  setData(defaultData());
  res.json({});
});

debug.get('/echo', (req, res) => {
  const { value } = req.query;
  console.log(`[ ECHO ] ${value}`);
  res.json({});
});

export default debug;
