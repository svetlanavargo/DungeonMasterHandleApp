import { useState } from 'react';
import type { Card } from '../App';

export type Condition = {
    id: string,
    name: string,
    duration: number,
    type: 'round' | 'time',
    remaining: number
}

export interface BattleCard extends Card {
    initiative: number;
    conditions?: Condition[];
}

export const useBattle = (
    cards: Card[],
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    setExpiredConditions: React.Dispatch<React.SetStateAction<string[]>>
) => {
    const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
    const [isBattle, setIsBattle] = useState(false);
    const [timer, setTimer] = useState(0);
    const [round, setRound] = useState(0);
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const [turnCounter, setTurnCounter] = useState(0);

    const turnDuration = 6;

    const rollInitiative = (card: Card) => {
        if (card.isPlayer) {
            const input = window.prompt(`Инициатива ${card.name}:`, '0');
            return Math.max(0, Math.min(1000, Number(input)));
        }
        const roll = Math.floor(Math.random() * 20 + 1);
        return roll + (card.initiativeBonus || 0);
    };

    const handleCardDeath = (deadCard: Card) => {
        setCards(prev =>
            prev.map(card =>
                card.id === deadCard.id ? { ...card, currentHits: 0 } : card
            )
        );

        setBattleCards(prev => {
            const updated = prev.filter(c => c.id !== deadCard.id);
            if (updated.length === 0) setIsBattle(false);
            return updated;
        });
    };

    const startFight = () => {
        const aliveCards = cards.filter(c => c.currentHits > 0);
        const newBattleCards: BattleCard[] = aliveCards.map(card => ({
            ...card,
            initiative: rollInitiative(card)
        }));

        newBattleCards.sort((a, b) => b.initiative - a.initiative);

        setBattleCards(newBattleCards);
        setIsBattle(true);
        setTurnCounter(0);
        setCurrentTurnIndex(0);
        setRound(1);
        setTimer(0);
    };

    const stopBattle = () => {
        setCards(prev =>
            prev.map(card => {
                const bc = battleCards.find(b => b.id === card.id);
                return bc ? { ...card, currentHits: bc.currentHits } : card;
            })
        );

        setBattleCards([]);
        setIsBattle(false);
        setTurnCounter(0);
        setCurrentTurnIndex(0);
        setRound(0);
        setTimer(0);
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        setBattleCards(prevCards => {
            const totalCards = prevCards.length;
            if (totalCards === 0) return prevCards; // защита

            const newTurn = turnCounter + 1;
            const currentCard = prevCards[newTurn % totalCards];
            const expired: string[] = [];

            const updated = prevCards.map(card => {
                if (!card.conditions) return card;

                const remainingConditions = card.conditions
                    .map(cond => {
                        let newRemaining = cond.remaining;

                        if (cond.type === 'round' && card.id === currentCard.id) newRemaining -= 1;
                        if (cond.type === 'time') newRemaining -= 1;

                        if (newRemaining <= 0) {
                            expired.push(`Состояние "${cond.name}" на ${card.name} закончилось`);
                            return null;
                        }
                        return { ...cond, remaining: newRemaining };
                    })
                    .filter(Boolean) as Condition[];

                return { ...card, conditions: remainingConditions };
            });

            // Обновляем expiredConditions, избегая дубликатов
            if (expired.length > 0) {
                setExpiredConditions(prev => {
                    const newExpired = expired.filter(msg => !prev.includes(msg));
                    return [...prev, ...newExpired];
                });
            }

            // обновляем turnCounter, currentTurnIndex и round прямо здесь
            setTurnCounter(newTurn);
            setCurrentTurnIndex(newTurn % totalCards);
            setRound(Math.floor(newTurn / totalCards) + 1);
            setTimer(prev => prev + turnDuration);

            return updated;
        });
    };

    const addUserToBattle = (card: Card) => {
        if (battleCards.some(c => c.id === card.id) || card.currentHits <= 0) return;

        const newBattleCard: BattleCard = { ...card, initiative: rollInitiative(card) };
        setBattleCards(prev => {
            const upd = [...prev, newBattleCard];
            upd.sort((a, b) => b.initiative - a.initiative);
            return upd;
        });
    };

    const getOutOfBattle = (id: string) => {
        setBattleCards(prev => {
            const updated = prev.filter(c => c.id !== id);

            if (updated.length <= 1) {
                // Завершаем бой
                setIsBattle(false);
                setTurnCounter(0);
                setCurrentTurnIndex(0);
                setRound(0);
                setTimer(0);

                // Возвращаем оставшуюся карточку в основной список
                setCards(prevCards => {
                    const remainingCard = updated[0];
                    if (!remainingCard) return prevCards; // если не осталось ни одной, ничего не делаем

                    // Если она уже в списке cards, не добавляем дубли
                    const exists = prevCards.some(c => c.id === remainingCard.id);
                    return exists ? prevCards : [...prevCards, remainingCard];
                });

                return []; // очищаем battleCards
            }

            return updated;
        });
    };

    const changeHits = (id: string, delta: number) => {
        setBattleCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, currentHits: Math.max(0, card.currentHits + delta) } : card
            )
        );
    };

    const subtractHits = (id: string) => {
        const card = battleCards.find(c => c.id === id);
        if (!card) return;

        const input = window.prompt(`Сколько урона у ${card.name}?`, '0');
        if (!input) return;

        const damage = Number(input);
        if (isNaN(damage)) return;

        const newHits = card.currentHits - damage;
        if (newHits <= 0) {
            handleCardDeath({ ...card, currentHits: 0 });
            return;
        }

        changeHits(id, -damage);
    };

    const addHits = (id: string) => {
        const input = window.prompt('Сколько лечения?');
        if (!input) return;

        const heal = Number(input);
        if (isNaN(heal)) return;

        changeHits(id, heal);
    };

    const longRest = () => {
        setCards(prev => prev.map(card => card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card));
        setBattleCards(prev => prev.map(card => card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card));
    };

    const addCondition = (cardId: string, condition: Condition) => {
        setBattleCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? {
                        ...card,
                        conditions: card.conditions
                            ? [...card.conditions.slice(0, 4), condition]
                            : [condition]
                    }
                    : card
            )
        );
    };

    const clearExpiredConditions = () => {
        setExpiredConditions([]);
    };

    return {
        isBattle,
        battleCards,
        timer,
        round,
        currentTurnIndex,
        turnCounter,
        startFight,
        stopBattle,
        nextMove,
        addUserToBattle,
        getOutOfBattle,
        subtractHits,
        addHits,
        longRest,
        addCondition,
        clearExpiredConditions
    };
};