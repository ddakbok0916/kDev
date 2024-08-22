'use strict';
const express = require('express');
const next = require('next');
var bodyParser = require('body-parser');
var session = require('express-session');
const passport = require('passport');

const fs = require('fs');
const http = require('http');
const db = require('./lib/dbConnection');

const routes = {
  auth: require('./api/auth'),
  main: require('./api/main'),
  board: require('./api/board'),
  user: require('./api/user'),
};

// Load environment variables from .env file if present
require('dotenv').config();

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception: ', err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason);
});

// Default when run with `npm start` is 'production' and default port is '8080'
// `npm run dev` defaults mode to 'development' & port to '3000'
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' //node에서 https ajax시 Error: unable to verify the first certificate오류 해결
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.PORT = process.env.PORT || 8080;
// Initialize Next.js
const nextApp = next({
  dir: '.',
  dev: process.env.NODE_ENV === 'local',
  port: 8080,
});

// Add next-auth to next app
nextApp
  .prepare()
  .then(() => {
    // Get Express and instance of Express from NextAuth
    //const expressApp = nextAuthOptions.expressApp
    const app = express();

    app.use(
      express.json({
        limit: '500mb',
      }),
    );

    app.use(
      bodyParser.urlencoded({
        limit: '500mb',
        extended: true,
      }),
    );

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // var corsOptions = {
    //   origin: function (origin, callback) {
    //     var isWhitelisted =
    //       ['http://127.0.0.1:3000', 'https://dev.viewowl.app:8443'].indexOf(
    //         origin
    //       ) !== -1
    //     callback(null, isWhitelisted)
    //   },
    //   credentials: true
    // }
    // app.use(cors(corsOptions))

    // Add account management route - reuses functions defined for NextAuth
    //routes.account(expressApp, nextAuthOptions.functions)
    app.use(
      session({
        secret: '3hwal!@#',
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 },
        rolling: true,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());

    require('./passport/localStrategy').setup(app);

    routes.auth(app);
    routes.main(app);
    routes.board(app);
    routes.user(app);

    // Default catch-all handler to allow Next.js to handle all other routes
    function ensureAuthenticated (req, res, next) {
      const receptionNumberParam = req.params['0']; // URL의 경로 파라미터
      const receptionNumberSession = req?.session?.passport?.user?.reception_number;

      if (receptionNumberSession && receptionNumberParam !== receptionNumberSession) {
        // 파라미터 값과 세션 값이 다른 경우
        req.logout((err) => {
          if (err) {
            return next(err);
          }
          req.session.destroy((err) => {
            if (err) {
              return next(err);
            }
            res.redirect('/image/' + receptionNumberParam); // 로그인 페이지로 리다이렉트
          });
        });
      } else {
        // 인증되었고 파라미터 값이 일치하는 경우
        return next();
      }
    }

    //페이지별 권한처리

    app.get('/image/*', ensureAuthenticated, (req, res) => {
      let nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });
    app.get('/image/*', (req, res) => {
      let nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });
    app.get('*', (req, res) => {
      let nextRequestHandler = nextApp.getRequestHandler();
      return nextRequestHandler(req, res);
    });

    app.listen(8080, () => {
      console.log('> HTTP Server running on port 8080');
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
