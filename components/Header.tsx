export function Header(props: { stage: number; time: number; score: number }) {
  return (
    <header>
      스테이지: {props.stage}, 남은 시간: {props.time}, 점수: {props.score}
    </header>
  );
}
