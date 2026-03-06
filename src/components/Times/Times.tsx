import Btn from '../UI/Btn/Btn.tsx';
import styles from './Times.module.css';

interface TimesProps {
    isBattle: boolean,
    timer: number,
    round: number,
    turnCounter: number,
    stopBattle: () => void
}

function Times({isBattle, round, timer, turnCounter, stopBattle}: TimesProps) {
    const currentTime = (timer: number) => {
        const min = Math.floor(timer / 60);
        const sec = timer % 60;

        // добавляем ведущий ноль, если число меньше 10
        const formattedMin = String(min).padStart(2, '0');
        const formattedSec = String(sec).padStart(2, '0');

        return `${formattedMin}:${formattedSec}`;
    }

    return (
        <div className={styles.times}>
            {
                isBattle && (
                    <div className={styles.timersFlex}>
                        <div className={styles.baseTimers}>
                            <h3>Базовые таймеры:</h3>
                            <p><b>Всего ходов:</b> {turnCounter}</p>
                            <p><b>Таймер:</b> {currentTime(timer)}</p>
                            <p><b>Раунд:</b> {round}</p>
                        </div>
                        <div className={styles.timersBtn}>
                            <Btn onClick={stopBattle} classBtn='stopBattle'/>
                        </div>
                    </div>
                    )
            }
            <div>
                {/*{battleCards.map(card =>*/}
                {/*    card.conditions?.map(cond => (*/}
                {/*        <p key={cond.id}>*/}
                {/*            {card.name}: {cond.name} ({cond.remaining} {cond.type === 'round' ? 'раундов' : 'секунд'})*/}
                {/*        </p>*/}
                {/*    ))*/}
                {/*)}*/}
            </div>
        </div>
    )
}

export default Times