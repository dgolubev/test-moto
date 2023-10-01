import express from 'express';
const router = express.Router();

router.get('/', function(_req, res, _next) {
  return res.json({
    title: 'Express + TS + Nodemon'
  });
});

export default router;
