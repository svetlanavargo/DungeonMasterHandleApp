import type {Card} from '../../App.tsx';
import CardItem from '../UI/Card/CardItem.tsx';
import styles from './CardsList.module.css';

interface BattleCard extends Card {
    initiative: number
}

interface MainProps {
    cards: Card[],
    battleCards: BattleCard[]
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isBattle: boolean,
    addUserToBattle: (id: string) => void;
}

function CardsList({cards, battleCards, onEdit, onDelete, isBattle, addUserToBattle}: MainProps) {
    const activeIds = battleCards.map(card => card.id)

    const availableCards = cards.filter(card => !activeIds.includes(card.id))

    return (
        <div className={styles.cardsList}>
            {cards.length === 0 ? (
                <div></div>
            ) : (
                <div className={styles.cardsWrapper}>
                    {availableCards.map(card => card && (
                        <CardItem
                            key={card.id}
                            card={card}
                            mode="list"
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isBattle={isBattle}
                            addUserToBattle={addUserToBattle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CardsList