import type { Card } from '../../App.tsx';
import Btn from '../UI/Btn/Btn.tsx';
import CardItem from '../UI/Card/CardItem.tsx';
import styles from './BattleField.module.css';

export interface BattleCard extends Card {
    initiative: number;
    currentHits: number;
}

interface BattleProps {
    isBattle: boolean
    startFight: () => void,
    countCards: number,
    cards: BattleCard[],
    getOutOfBattle: (id: string) => void;
    nextMove: () => void;
    currentTurnIndex: number
}

function BattleField({isBattle, startFight, countCards, cards, getOutOfBattle, currentTurnIndex, nextMove}: BattleProps) {
    return (
        <div className={styles.battleField}>
            {!isBattle ? (
                countCards > 1 ? (
                    <div className={styles.fightBtnWrapper}>
                        <Btn classBtn='startBattle' onClick={startFight}/>
                    </div>
                ) : (
                    <p>Добавьте больше 1 карточки для начала битвы</p>
                )
            ) : (
                <div className={styles.battleCardsWrapper}>
                    {cards.map((card, index) => (
                        <CardItem
                            key={card.id}
                            card={card}
                            isBattle={isBattle}
                            mode="battle"
                            getOutOfBattle={getOutOfBattle}
                            isCurrentTurn={currentTurnIndex === index}
                            nextMove={nextMove}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BattleField