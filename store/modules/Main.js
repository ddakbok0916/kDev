import _ from 'lodash';
// 액션 타입 정의

const TOGGLE_SIDEBAR = 'main/TOGGLE_SIDEBAR';
const SET_SHOW_FOOTER = 'main/TOGGLE_FOOTER';
const SET_PATH = 'main/SET_PATH';
const SET_URL = 'main/SET_URL';
const SET_STATUS_HEIGHT = 'main/SET_STATUS_HEIGHT';
const SET_FOOTER_HEIGHT = 'main/SET_FOOTER_HEIGHT';
const SET_IS_IOS = 'main/SET_IS_IOS';
const SET_LOADING = 'main/SET_LOADING';
const SET_SEARCH_DATA = 'main/SET_SEARCH_DATA';
const SET_PREV_SCROLL = 'main/SET_PREV_SCROLL';
const SET_PREV_URL = 'main/SET_PREV_URL';
const SET_SHOW_ALERT = 'main/SET_SHOW_ALERT';
const SET_HAS_NEW_NOTICE = 'main/SET_HAS_NEW_NOTICE';
const SET_IS_IMAGE = 'SET_IS_IMAGE';
// **** 액션 생섬함수 정의

export const toggleSideBar = () => (dispatch, getState) => {
  dispatch({ type: TOGGLE_SIDEBAR });
}; //초
export const setShowFooter = ({ show }) => ({ type: SET_SHOW_FOOTER, show });
export const setPath = ({ path }) => ({ type: SET_PATH, path });
export const setUrl = ({ url }) => ({ type: SET_URL, url });
export const setStatusHeight = ({ statusHeight }) => ({ type: SET_STATUS_HEIGHT, statusHeight });
export const setFooterHeight = ({ height }) => ({ type: SET_FOOTER_HEIGHT, height });
export const setIsIos = ({ isIos }) => ({ type: SET_IS_IOS, isIos });
export const setLoading = ({ show }) => ({ type: SET_LOADING, show });
export const setSearchData = ({ searchData }) => ({ type: SET_SEARCH_DATA, searchData });
export const setPrevScroll = ({ scrollTop }) => ({ type: SET_PREV_SCROLL, scrollTop });
export const setPrevURL = ({ prevURL }) => ({ type: SET_PREV_URL, prevURL });
export const setShowAlert =
  ({ show }) =>
  (dispatch, getState) => {
    dispatch({ type: SET_SHOW_ALERT, show });

    setTimeout(() => {
      dispatch({ type: SET_SHOW_ALERT, show: { show: false, message: '' } });
    }, 3000);
  };
export const setIsImage = ({ isImage }) => ({ type: SET_IS_IMAGE, isImage });

export const setHasNewNotice = ({ hasNew }) => ({ type: SET_HAS_NEW_NOTICE, hasNew });

const initialState = {
  showSideBar: false,
  showFooter: true,
  path: 'Home',
  statusHeight: 0,
  footerHeight: 0,
  url: '/',
  isIos: false,
  loadingShow: false,
  searchData: { show: false, list: [] },
  prevScroll: null,
  prevURL: '',
  showAlert: {},
  hasNewNotice: false,
  isImage: true,
};

// **** 리듀서 작성
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        ...state,
        showSideBar: !state.showSideBar,
      };
    }
    case SET_SHOW_FOOTER: {
      let show = _.isBoolean(action.show) ? action.show : state.show;
      return {
        ...state,
        showFooter: show,
      };
    }
    case SET_PATH: {
      return {
        ...state,
        path: action.path,
      };
    }
    case SET_URL: {
      const { url, invokeMainInitialAnimation } = state;

      return {
        ...state,
        url: action.url,
      };
    }
    case SET_STATUS_HEIGHT: {
      return {
        ...state,
        statusHeight: action.statusHeight,
      };
    }
    case SET_IS_IOS: {
      return {
        ...state,
        isIos: action.isIos,
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        loadingShow: action.show,
      };
    }
    case SET_FOOTER_HEIGHT: {
      return {
        ...state,
        footerHeight: action.height,
      };
    }
    case SET_SEARCH_DATA: {
      return {
        ...state,
        searchData: action.searchData,
      };
    }
    case SET_PREV_SCROLL: {
      return {
        ...state,
        prevScroll: action.scrollTop,
      };
    }
    case SET_PREV_URL: {
      return {
        ...state,
        prevURL: action.prevURL,
      };
    }
    case SET_SHOW_ALERT: {
      return {
        ...state,
        showAlert: action.show,
      };
    }
    case SET_HAS_NEW_NOTICE: {
      return {
        ...state,
        hasNewNotice: action.hasNew,
      };
    }
    case SET_IS_IMAGE: {
      return {
        ...state,
        isImage: action.isImage,
      };
    }

    default: {
      return state;
    }
  }
}
