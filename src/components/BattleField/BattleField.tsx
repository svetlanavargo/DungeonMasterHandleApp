import type { Card } from '../../App.tsx';
import type { Condition } from '../../hooks/useBattle.ts';
import Btn from '../UI/Btn/Btn.tsx';
import CardItem from '../UI/Card/CardItem.tsx';
import styles from './BattleField.module.css';

export interface BattleCard extends Card {
    initiative: number;
    currentHits: number;
    conditions?: Condition[]
}

interface BattleProps {
    isBattle: boolean
    startFight: () => void,
    cards: BattleCard[],
    getOutOfBattle: (id: string) => void;
    nextMove: () => void;
    currentTurnIndex: number,
    addHits: (id: string) => void;
    subtractHits: (id: string) => void;
    addCondition: (id: string) => void;
}

function BattleField(
    {
        isBattle,
        startFight,
        cards,
        getOutOfBattle,
        currentTurnIndex,
        addHits,
        subtractHits,
        nextMove,
        addCondition
    }: BattleProps) {
    return (
        <div className={styles.battleField}>
            {!isBattle ? (
                cards.length > 1 ? (
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
                            subtractHits={subtractHits}
                            addHits={addHits}
                            addCondition={addCondition}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BattleField