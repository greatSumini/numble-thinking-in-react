import type { NextPage } from 'next';
import { Board, Header } from '../components';

import { useGame } from '../hooks';

const Home: NextPage = () => {
  const { state, action } = useGame();

  return (
    <>
      <Header {...state} />
      <Board {...state} onSelect={action.select} />
    </>
  );
};

export default Home;
