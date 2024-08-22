import { combineReducers } from 'redux';
import Main from '../store/modules/Main';

export default combineReducers({
  Main,
  // 다른 리듀서를 만들게되면 여기에 넣어줌..
});
