import styles from './page.module.css';
import Game2048 from '@/components/Game2048';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Игра 2048</h1>
      <p className={styles.description}>Смысл игры заключается в передвижении блоков стрелками на клавиатуре (либо свайп по экрану). При совпадении значений в блоках они складываются. Чтобы выиграть, надо получить ячейку 2048.</p>
      <div className={styles.game}>
        <Game2048 />
      </div>
    </main>
  )
}
