const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('../lib/dbConnection');
const _ = require('lodash');
const { URL, URLSearchParams } = require('url');
const { currentTimeGen } = require('../lib/utils');

passport.serializeUser((user, done) => {
  // Strategy 성공 시 호출됨
  done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
});

passport.deserializeUser((user, done) => {
  // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
  done(null, user); // 여기의 user가 req.user가 됨
});

passport.use(
  new LocalStrategy(
    {
      // local 전략을 세움
      usernameField: 'key',
      passwordField: 'key',
      session: true, // 세션에 저장 여부
      passReqToCallback: true,
    },
    async (req, key, password, done) => {
      const url = new URL(process.env.TNF_DOMAIN_PROD),
        params = { key: key },
        pathname = '/tnf/get-from-uuid';
      console.log('localStrategy :\n key ::::', key);

      url.pathname = pathname;
      url.search = new URLSearchParams(params).toString();

      console.log('requesting :::', url.toString());
      //요청
      try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
          throw new Error(`로그인 API 호출이 실패했습니다.`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        const user = data.user;
        console.log('user ::: ', user, 'so then !user :::', !user);
        switch (true) {
          case !user:
            throw new Error('Login was not successful: user data missing');
          case !data.login_status == 'success':
            throw new Error('Login was not successful: login server api returns failure ( detail : ', data.status, ')');
        }

        console.log('Fetched user data:', user);
        const { reception_number, student_name, protector_name, phone_number, region, region_detail, school, application_url } = user;
        const now = currentTimeGen();

        let user_no = null;
        // 로그인 후 db에 기록
        const userSaveResult = await db.transaction(async function (conn) {
          console.log('🚀 ~ localStrategy.js ~  user : ', user, `(current time : ${now} )`);
          //기존 로그인 기록이 있는지 확인
          const resultWasLogIn = await wasLogIn(user);
          console.log('logincheck:::::resultWasLogIn', resultWasLogIn);
          //첫 로그인이라면
          if (resultWasLogIn.length == 0) {
            console.log('!!!firstLogin!!!');
            const insertQuery = `INSERT INTO members (reception_number, user_name, user_type, created_at, tel ,sns_type)
            VALUES (?,?, 20, STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?,?)`;
            try {
              const [rows] = await conn.query(insertQuery, [reception_number, student_name, now, phone_number, '통합로그인']);
              console.log('Insert successful:', rows);
              user_no = rows.insertId;
              console.log('the user_no is set to ', user_no);
              return { isNew: true, reception_number: reception_number };
            } catch (error) {
              console.error('Error while inserting:', error);
              throw error;
            }
          } else {
            // 기존 로그인 기록이 있다면
            console.log('alreadyUser ::: welcome');
            user_no = resultWasLogIn[0].user_no;
            console.log('the user_no is set to ', user_no);
            return { isNew: false, reception_number: resultWasLogIn[0].reception_number };
          }
        });
        //기존에 이미지가 저장되어 있는지 확인
        console.log('imageSavecheck:::::', userSaveResult);
        if (userSaveResult.isNew || userSaveResult.reception_number == null) {
          console.log('currnet user is newUSER or noImageINfo');
          //신규 사용자거나 저장된 이미지가 없다면
          await db
            .transaction(async function (conn) {
              const insertQuery = `INSERT INTO 
            pictures ( reception_number,pic_url,school_name,child_name,protector_name,address_city,address_district,tel,created_at ) 
            VALUES (?,?,?,?,?,?,?,?,STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'))`;
              const params = [reception_number, application_url, school, student_name, protector_name, region, region_detail, phone_number, now];
              console.log('\nimage insertion query : ', insertQuery, '\n params : ', params);
              return conn.query(insertQuery, params);
            })
            .then((result) => {
              console.log('Insert successful:', result);
            })
            .catch((error) => {
              console.error('error occured while saving image data into database');
              throw error;
            });
        } else {
          // 기존 사용자이고 저장된 이미지가 존재한다면
          console.log('current user already got images');
        }

        user.user_no = user_no;
        user.user_type = '통합로그인';
        return done(null, user);
      } catch (err) {
        //로그인 실패했을때
        console.log('err', err);
        return done(null, false, { message: err.message || 'An error occurred during login' });
      }
    },
  ),
);

var setup = function (app) {
  app.get('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(400).json({ error });
      if (!user) {
        // res.status(400).json({ error: 'Login failed' });
        res.redirect(`/image/error?message=${info.message}`);
      }
      req.logIn(user, async (error) => {
        if (error) return next(error);
        return res.redirect(`/image/${user.reception_number}`); /* 리다이렉트할 페이지 경로를 설정*/
      });
    })(req, res, next);
  });
};
//user정보로 취득
const wasLogIn = async ({ student_name, phone_number, region, region_detail, protector_name, reception_number }) => {
  //reception_number, student_name, protector_name, phone_number, region, region_detail, school, application_url
  return await db.connect(async function (conn) {
    const selectQuery = `
      SELECT m.user_no, p.reception_number
      FROM members m
      LEFT OUTER JOIN pictures p ON p.reception_number = m.reception_number
      WHERE m.reception_number = ?
    `;
    const params = [reception_number];
    console.log('::::SELECQUERY::::\n', selectQuery, ':::::PARAMS:::::\n', 'params : ', params);
    const [rows] = await conn.query(selectQuery, params);
    console.log('result :::\n', rows);
    return rows;
  });
};
exports.setup = setup;
