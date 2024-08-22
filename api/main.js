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
const axios = require('axios');

module.exports = (expressApp) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

};
