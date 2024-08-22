const fs = require('fs');
const _ = require('lodash');
const db = require('../lib/dbConnection');
const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const short = require('short-uuid');

module.exports = (expressApp) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  expressApp.get('/api/board/getBoardList', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
      const data = await db.transaction(async function (conn) {
        const selectBoardList = `
        SELECT row_number() OVER (ORDER BY created_at ASC) AS num, id, title, writer, created_at
        FROM worldvision.posts 
        WHERE isVisible = 1
        AND board_code = 10
        ORDER BY created_at DESC
        LIMIT ?, ?
        `;

        const selectQNAList = `
        SELECT title, contents, answer
        FROM worldvision.posts 
        WHERE isVisible = 1
        AND board_code = 20
        ORDER BY created_at DESC
        `;
        const [rows1] = await conn.query(selectBoardList, [offset, limit]);
        const [rows2] = await conn.query(selectQNAList);
        const [totalResult] = await conn.query('SELECT COUNT(*) AS total FROM worldvision.posts WHERE isVisible = 1 AND board_code = 10');
        const total = totalResult[0].total;
        return { board: rows1, qna: rows2, total };
      });
      res.json({ board: data.board, qna: data.qna, total: data.total, page: page, limit: limit });
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  expressApp.post('/api/user/join', async (req, res) => {
    const { username, password, mobile } = req.body.data;

    try {
      await db.connect(async function (conn) {
        let addboardQuery = `
          INSERT INTO kdev.user
          (user_name, password, mobile)
          VALUES('${username}', '${password}', '${mobile}');
          `;
        const [rows] = await conn.query(addboardQuery);
        return rows;
      });
      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });
};
