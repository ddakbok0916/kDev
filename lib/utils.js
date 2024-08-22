// 현재시간 추출
const currentTimeGen = (time = true) => {
  const now = new Date();
  const dateArr = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  const date = dateArr.join('-');
  if (time) {
    const timeArr = [now.getHours(), now.getMinutes(), now.getSeconds()];
    const time = timeArr.join(':');
    const dateTime = [date, time].join(' ');
    return dateTime;
  } else {
    return date;
  }
};

// 상장용 날짜 추출
const awardDateGen = (apiDateStr) => {
  const dateObj = new Date(apiDateStr);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  const formattedDate = `${year}년 ${month}월 ${day}일`;

  return formattedDate;
};

//깊은 복사
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

//계층 트리 만들기
function buildTree (comments) {
  const commentMap = {};
  comments.forEach((comment) => {
    comment.children = [];
    commentMap[comment.id] = comment;
  });

  const tree = [];
  comments.forEach((comment) => {
    if (comment.p_id) {
      commentMap[comment.p_id].children.push(comment);
    } else {
      tree.push(comment);
    }
  });

  return tree;
}

//마스킹( 2글자 이름은 첫글짜 빼고 , 3글자 이름은 첫글자, 끝글자 빼고 모두 마스킹)
function maskingWords (text) {
  if (text) {
    return text.replace(/\S+/g, function (word) {
      if (word.length >= 3) {
        return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
      } else if (word.length == 2) {
        return word[0] + '*';
      } else {
        return word;
      }
    });
  } else {
    return '<이름 없음>';
  }
}

const utils = { currentTimeGen, deepClone, buildTree, maskingWords, awardDateGen };

module.exports = utils;
