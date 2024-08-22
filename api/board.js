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

  expressApp.post('/api/board/addPost', async (req, res) => {
    const user = req.user;
    const { id, title, content } = req.body;
    console.log('🚀 ~ expressApp.post ~ user:', user);

    try {
      let addboardQuery;
      const data = await db.transaction(async function (conn) {
        if (id == 0) {
          addboardQuery = `
          INSERT INTO worldvision.posts
          (board_code, title, contents, created_at, created_userno, isVisible, writer)
          VALUES(10, ?, ?, current_timestamp(), ?, 1, (select user_name from members where user_no = ?));
          `;
          const [rows] = await conn.query(addboardQuery, [title, content, user.user_no, user.user_no]);
          return rows;
        } else {
          addboardQuery = `
          UPDATE worldvision.posts
          SET title = ?, contents = ? , updated_userno='${user.user_no}', updated_at=current_timestamp()
          WHERE id = '${id}'
          AND created_userno = '${user.user_no}'
          `;
          const [rows] = await conn.query(addboardQuery, [title, content]);
          return rows;
        }
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  expressApp.post('/api/board/getBoardDetail', async (req, res) => {
    const { id } = req.body;

    try {
      const data = await db.transaction(async function (conn) {
        const updateQuery = `
          UPDATE worldvision.posts 
          SET views = views + 1
          WHERE id = '${id}'
      `;
        await conn.query(updateQuery);

        const selectBoardList = `
          SELECT row_number() over ( order by id ) as num, id, title, writer, created_at, title,contents, created_userno, answer, views 
          FROM worldvision.posts 
          WHERE isVisible = 1
          AND id = ${id}
          AND board_code = '10'
                  `;
        const [rows] = await conn.query(selectBoardList);
        return rows;
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  expressApp.post('/api/board/deletePost', async (req, res) => {
    const { id } = req.body;

    try {
      const data = await db.transaction(async function (conn) {
        const deletePostQuery = `
      UPDATE worldvision.posts 
      SET isVisible = 0
      WHERE id = '${id}'
      `;
        const [rows] = await conn.query(deletePostQuery);
        return rows;
      });
      console.log('🚀 ~ expressApp.post ~ data.affectedRows:', data.affectedRows);
      if (data.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  expressApp.post('/api/board/updateViews', async (req, res) => {
    const { id } = req.body;

    try {
      const data = await db.transaction(async function (conn) {
        const updateQuery = `
          UPDATE worldvision.posts 
          SET views = views + 1
          WHERE id = '${id}'
      `;
        const [rows] = await conn.query(updateQuery);
        return rows;
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });

  expressApp.post('/api/board/getModifyBoardData', async (req, res) => {
    const { id } = req.body;

    try {
      const data = await db.transaction(async function (conn) {
        const selectBoardList = `
          SELECT id, title, contents, created_userno 
          FROM worldvision.posts
          WHERE id = '${id}'
                  `;
        const [rows] = await conn.query(selectBoardList);
        return rows;
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).end(error.message);
    }
  });
};
