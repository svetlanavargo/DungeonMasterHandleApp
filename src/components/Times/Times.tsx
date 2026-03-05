import styles from './Times.module.css';

interface TimesProps {
    isBattle: boolean,
    timer: number,
    round: number,
    turnCounter: number
}

function Times({isBattle, round, timer, turnCounter}: TimesProps) {
    return (
        <div className={styles.times}>
            {
                isBattle ?(
                    <div>
                        <p>Всего ходов: {turnCounter}</p>
                        <p>Таймер: {timer}</p>
                        <p>Раунд: {round}</p>
                    </div>
                    ) : null
            }
        </div>
    )
}

export default Times