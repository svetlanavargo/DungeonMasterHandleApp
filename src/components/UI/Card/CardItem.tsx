import type { Card } from '../../../App.tsx';
import type { BattleCard } from '../../BattleField/BattleField.tsx';
import type { Condition } from '../../../hooks/useBattle.ts';
import { remainingTimeInMinutes } from '../../../utils/time.ts';
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
    addHits?: (id: string) => void;
    subtractHits?: (id: string) => void;
    addCondition?: (id: string) => void;
}

function CardItem({
                      card,
                      mode,
                      onEdit,
                      onDelete,
                      isCurrentTurn,
                      isBattle,
                      addUserToBattle,
                      getOutOfBattle,
                      nextMove,
                      addHits,
                      subtractHits,
                      addCondition
                  }: CardProps) {
    const { id, name, maxHits, currentHits, ac, isPlayer, color, initiativeBonus, note } = card;
    const initiative = 'initiative' in card ? card.initiative : 0;

    let colorClass, hitsClass, isDead, isNPC;

    if (isPlayer && color) {
        if (color === 'red') colorClass = styles.red;
        else if (color === 'blue') colorClass = styles.blue;
        else if (color === 'green') colorClass = styles.green;
    }

    if (Number(currentHits) <= maxHits / 2) hitsClass = styles.low;
    if (Number(currentHits) <= 0) isDead = styles.dead;
    if (!isPlayer) isNPC = styles.nps;

    return (
        <div className={`
            ${styles.card} 
            ${colorClass} 
            ${hitsClass} 
            ${isDead} 
            ${isCurrentTurn ? styles.currentTurn : ''}
        `}>
            <div>
                <div className={styles.cardHeader}>
                    <div className={styles.flex}>
                        <div className={styles.shield}><b>{ac}</b></div>
                        <div className={isNPC}>
                            <h2 className={styles.cardName}>{name}</h2>
                        </div>
                    </div>

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
                    {mode === 'battle' ? (
                        <div className={styles.hitsWrapper}>
                            <Btn onClick={() => addHits?.(id)} classBtn='addHits'/>
                            <p className={styles.battleHits}><b>{currentHits}/{maxHits}</b></p>
                            <Btn onClick={() => subtractHits?.(id)} classBtn='subtractHits'/>
                        </div>
                    ) : (
                        <p className={styles.description}>Хиты: <b>{currentHits}/{maxHits}</b></p>
                    )}

                    {mode === 'battle' && (
                        <div className={styles.conditionWrap}>
                            {isCurrentTurn && <Btn onClick={() => addCondition?.(id)} classBtn='addCondition'/>}
                            <ul>
                                {('conditions' in card ? card.conditions : undefined)?.map((cond: Condition) => (
                                    <li key={cond.id}>
                                        {cond.name} - {cond.type === 'time'
                                        ? `${remainingTimeInMinutes(cond.remaining)} min`
                                        : `${cond.remaining} rounds`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {initiativeBonus && mode === 'list' ? (
                        <p className={styles.description}>Бонус Инициативы: <b>{initiativeBonus}</b></p>
                    ): null}
                    {note && <p className={styles.note}>{note}</p>}
                </div>
            </div>

            <div>
                {mode === 'list' && isBattle && currentHits > 0 && (
                    <div className={styles.addUserToBattleBtn}>
                        <Btn onClick={() => addUserToBattle?.(id)} classBtn='addUserToBattle'/>
                    </div>
                )}
                {mode === 'battle' && isBattle && (
                    <div className={styles.battleBtns}>
                        <Btn onClick={() => getOutOfBattle?.(id)} classBtn='getOutOfBattle'/>
                        {isCurrentTurn && <Btn onClick={() => nextMove?.()} classBtn='nextMove'/>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardItem;