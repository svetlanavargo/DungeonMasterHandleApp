import type { Card } from '../../../App.tsx';
import type { BattleCard } from '../../BattleField/BattleField.tsx';
import Btn from '../Btn/Btn.tsx';
import styles from './Card.module.css';

type CardMode = 'list' | 'battle'

interface CardProps {
    card: Card | BattleCard
    mode: CardMode
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isBattle: boolean,
    addUserToBattle?: (id: string) => void;
    getOutOfBattle?:  (id: string) => void;
    nextMove?: () => void;
    isCurrentTurn?: boolean;
}

function CardItem({ card, mode, onEdit, onDelete, isCurrentTurn, isBattle, addUserToBattle, getOutOfBattle, nextMove }:CardProps) {
    const { id, name, maxHits, currentHits, ac, isPlayer, color, initiativeBonus, note } = card;
    const initiative = 'initiative' in card ? card.initiative : 0;

    let colorClass, hitsClass

    if (isPlayer && color) {
        if (color === 'red') colorClass = styles.red;
        else if (color === 'blue') colorClass = styles.blue;
        else if (color === 'green') colorClass = styles.green;
    }

    if (Number(currentHits) <= maxHits / 2) {
        hitsClass = styles.low
    }

    return (
        <div className={`
            ${styles.card} 
            ${colorClass} 
            ${hitsClass} 
            ${isCurrentTurn ? styles.currentTurn : ''}
        `}
        >
            <div>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardName}>
                        {name} {!isPlayer && "- NPC"}
                    </h2>

                    {mode === 'list' && (
                        <div className={styles.btns}>
                            <Btn onClick={() => onEdit?.(id)} classBtn='edit'/>
                            <Btn onClick={() => onDelete?.(id)} classBtn='delete'/>
                        </div>
                    )}
                    {mode === 'battle' && (
                        <div className={styles.initiative}>{initiative}</div>
                    )}
                </div>
                <div>
                    <p className={styles.description}>
                        Хиты: <b>{currentHits}/{maxHits}</b>
                    </p>

                    <p className={styles.description}>
                        КД: <b>{ac}</b>
                    </p>

                    {initiativeBonus && mode === 'list' ? (
                        <p className={styles.description}>
                            Бонус Инициативы: <b>{initiativeBonus}</b>
                        </p>
                    ):null}

                    {note && (
                        <p className={styles.note}>{note}</p>
                    )}
                </div>
            </div>
            <div>
               {mode === 'list' && isBattle && (
                   <div className={styles.addUserToBattleBtn}>
                       <Btn
                           onClick={() => addUserToBattle?.(id)}
                           classBtn='addUserToBattle'
                       />
                   </div>
               )}
               {mode === 'battle' && isBattle && (
                   <div className={styles.battleBtns}>
                       <Btn
                           onClick={() => getOutOfBattle?.(id)}
                           classBtn='getOutOfBattle'
                       />
                       {isCurrentTurn && (
                           <Btn
                               onClick={() => nextMove?.()}
                               classBtn='nextMove'
                           />
                       )}
                   </div>
               )}
            </div>
        </div>
    );
}

export default CardItem