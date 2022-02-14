import styles from './index.module.css';

export function Board(props: {
  stage: number;
  baseColor: string;
  answerColor: string;
  answer: number;
  onSelect: (index: number) => void;
}) {
  const width = Math.round((props.stage + 0.5) / 2) + 1;

  return (
    <div className={styles.wrapper}>
      {[...Array(width * width)].map((_, index) => (
        <div
          key={`${props.stage}_${index}`}
          style={{
            width: `${360 / width - 4}px`,
            height: `${360 / width - 4}px`,
            margin: '2px',
            backgroundColor:
              props.answer === index ? props.answerColor : props.baseColor,
          }}
          onClick={() => {
            props.onSelect(index);
          }}
        />
      ))}
    </div>
  );
}
