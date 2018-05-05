import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import dateFns from 'date-fns';

import * as actions from '../actions';

const code = handleActions({
  [actions.changeCode]: (state, { payload }) => {
    const { content } = payload;
    return content;
  },
}, null);

const currentTabInfo = handleActions({
  [actions.runCheckRequest]: (state) => {
    const newState = { ...state, current: 'console' };
    return newState;
  },
  [actions.selectTab]: (state, { payload }) => {
    const { current } = payload;
    const newClicksCount = state.current === current ? state.clicksCount + 1 : 0;
    return { current, clicksCount: newClicksCount };
  },
}, { current: 'editor', clicksCount: 0 });

const notification = handleActions({
  [actions.dismissNotification]: () => {
    const info = null;
    return info;
  },
  [actions.runCheckFailure]: () => {
    const msg = { type: 'danger', headline: 'alert.error.headline', message: 'alert.error.message' };
    return msg;
  },
  [actions.runCheckRequest]: () => {
    const info = null;
    return info;
  },
  [actions.runCheckSuccess]: (_, { payload }) => {
    const { check: { data: { attributes } } } = payload;
    if (attributes.passed) {
      return { type: 'success', headline: 'alert.passed.headline', message: 'alert.passed.message' };
    }

    return {
      type: 'warning',
      headline: `alert.${attributes.result}.headline`,
      message: `alert.${attributes.result}.message`,
    };
  },
}, null);

const checkInfo = handleActions({
  [actions.runCheckRequest]: (state) => {
    const newState = { ...state, output: '', processing: true };
    return newState;
  },
  [actions.runCheckSuccess]: (state, { payload }) => {
    const { check: { data: { attributes } } } = payload;
    return {
      ...state,
      processing: false,
      output: attributes.output,
    };
  },
  [actions.runCheckFailure]: (state) => {
    const newState = { ...state, processing: false };
    return newState;
  },
}, { processing: false, output: '' });

const countdown = handleActions({
  [actions.init]: (state, { payload }) => {
    const { startTime } = payload;
    const finishTime = dateFns.addMinutes(startTime, 30);
    // const finishTime = dateFns.addSeconds(startTime, 10);
    return { ...state, startTime, finishTime };
  },
  [actions.updateCountdown]: (state, { payload }) => {
    const { currentTime } = payload;
    return { ...state, currentTime };
  },
}, {
  currentTime: null,
  startTime: null,
  finishTime: null,
});

const lessonState = handleActions({
  [actions.init]: (state, { payload }) => {
    const { userFinishedLesson } = payload;
    return { finished: !!userFinishedLesson };
  },
  [actions.runCheckSuccess]: (state, { payload }) => {
    const { check: { data: { attributes } } } = payload;
    const newState = { ...state, finished: attributes.passed };
    return newState;
  },
}, {
  finished: null,
});

const solutionState = handleActions({
  [actions.init]: (state, { payload }) => {
    const { userFinishedLesson } = payload;
    const lessonFinished = !!userFinishedLesson;
    return { canBeShown: lessonFinished, shown: lessonFinished };
  },
  [actions.showSolution]: (state) => {
    const newState = { ...state, shown: true };
    return newState;
  },
  [actions.makeSolutionAvailable]: (state) => {
    const newState = { ...state, canBeShown: true };
    return newState;
  },
  [actions.runCheckSuccess]: (_, { payload }) => {
    const { check: { data: { attributes } } } = payload;
    return { canBeShown: attributes.passed, shown: attributes.passed };
  },
}, { canBeShown: false, shown: false });

export default combineReducers({
  code,
  currentTabInfo,
  notification,
  checkInfo,
  countdown,
  lessonState,
  solutionState,
});
