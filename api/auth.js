const fs = require('fs');
const _ = require('lodash');
const db = require('../lib/dbConnection');
const bcrypt = require('bcrypt');

module.exports = (expressApp) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  /* 로그아웃 */
  expressApp.get('/auth/logout', async (req, res) => {
    try {
      req.logout((err) => {
        req.session.destroy();
        if (err) {
          console.log(err);
        } else {
          // res.redirect('/');
          res.json(true);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to logout');
    }
  });
};
