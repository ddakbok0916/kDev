import { createWrapper } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import reducer from './index';

const configureStore = () => {
  const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
  return store;
};

export const store = configureStore();

export const wrapper = createWrapper(store, {
  debug: true,
});
