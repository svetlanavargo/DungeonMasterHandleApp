import { useState } from 'react';
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

function CardsList(
    {
        cards,
        battleCards,
        onEdit,
        onDelete,
        isBattle,
        addUserToBattle
    }: MainProps) {
    const [activeTab, setActiveTab] = useState<'alive' | 'dead'>('alive')

    const activeIds = battleCards.map(card => card.id)
    const availableCards = cards.filter(card => !activeIds.includes(card.id))
    const aliveCards = availableCards.filter(card => card.currentHits > 0)
    const deadCards = availableCards.filter(card => card.currentHits <= 0)

    const renderCards = (cardsToRender: Card[]) => (
        <div className={styles.cardsWrapper}>
            {cardsToRender.map(card => (
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
    );

    return (
        <div className={styles.cardsList}>
            {cards.length > 0 && (
                <>
                    {/* Вкладки */}
                    <div className={styles.tabs}>
                        <div
                            className={`${styles.alive} ${activeTab === 'alive' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('alive')}
                        >
                        </div>
                        <div
                            className={`${styles.dead} ${activeTab === 'dead' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('dead')}
                        >
                        </div>
                    </div>

                    {/* Содержимое вкладки */}
                    {activeTab === 'alive' && renderCards(aliveCards)}
                    {activeTab === 'dead' && renderCards(deadCards)}
                </>
            )}
        </div>
    )
}

export default CardsList