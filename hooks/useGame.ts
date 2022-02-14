import { useCallback, useEffect, useReducer, useRef } from 'react';

//////////////
// constant //
//////////////
const STAGE_TIME = 15;

//////////////
//  helper  //
//////////////
const getRandomColors = (stage: number) => {
  const diff = 25 - Math.ceil(stage / 3);

  const code = () => Math.floor(Math.random() * 230);
  const r = code();
  const g = code();
  const b = code();

  const plusOrMinus = (input: number) => Math.sign(Math.random() - 0.5) * input;

  return {
    baseColor: `rgb(${r}, ${g}, ${b})`,
    answerColor: `rgb(${r + plusOrMinus(diff)}, ${g + plusOrMinus(diff)}, ${
      b + plusOrMinus(diff)
    })`,
  };
};
const getRandomAnswer = (stage: number) => {
  const width = Math.round((stage + 0.5) / 2) + 1;
  return Math.floor(Math.random() * width * width);
};
const getInitialState = (): GameState => ({
  isPlaying: true,
  stage: 1,
  ...getRandomColors(1),
  answer: getRandomAnswer(1),
  time: STAGE_TIME,
  score: 0,
});

//////////////
// reducer  //
//////////////
type GameState = {
  isPlaying: boolean;
  stage: number;
  baseColor: string;
  answerColor: string;
  answer: number;
  time: number;
  score: number;
};
type GameActionType = 'INIT' | 'SELECT_CORRECT' | 'SELECT_INCORRECT' | 'TICK';
type GameAction = { type: GameActionType };
function reducer(prev: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT':
      return getInitialState();
    case 'SELECT_CORRECT':
      return {
        ...prev,
        ...getRandomColors(prev.stage + 1),
        time: STAGE_TIME,
        stage: prev.stage + 1,
        answer: getRandomAnswer(prev.stage + 1),
        score: prev.score + Math.pow(prev.stage, 3) * prev.time,
      };
    case 'SELECT_INCORRECT':
      return {
        ...prev,
        time: Math.max(prev.time - 3, 0),
      };
    case 'TICK':
      if (!prev.isPlaying) {
        return prev;
      }
      if (prev.time <= 0) {
        return {
          ...prev,
          isPlaying: false,
        };
      } else {
        return {
          ...prev,
          time: prev.time - 1,
        };
      }
    default:
      return prev;
  }
}

//////////////
//   hook   //
//////////////
export const useGame = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const timer = useRef<NodeJS.Timer>();

  const init = useCallback(() => {
    dispatch({ type: 'INIT' });

    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
  }, []);

  const select = useCallback(
    (index: number) => {
      if (!state.isPlaying) {
        return;
      }

      if (index === state.answer) {
        dispatch({ type: 'SELECT_CORRECT' });
      } else {
        dispatch({ type: 'SELECT_INCORRECT' });
      }
    },
    [state.answer, state.isPlaying]
  );

  useEffect(() => {
    if (state.isPlaying) {
      return;
    }

    if (timer.current) {
      clearInterval(timer.current);
    }
    alert(`GAME OVER!\n스테이지: ${state.stage}, 점수: ${state.score}`);
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlaying]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);

  return { state, action: { select } };
};
