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
    setCards: React.Dispatch<React.SetStateAction<Card[]>>
) => {
    // бойцы в бою
    const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
    const [isBattle, setIsBattle] = useState(false);

    // счётчики ходов, раундов и таймер
    const [turnState, setTurnState] = useState({
        turnCounter: 0,
        currentTurnIndex: 0,
        round: 0,
        timer: 0
    });

    // сообщения о завершении состояний
    const [expiredConditions, setExpiredConditions] = useState<string[]>([]);

    const turnDuration = 6;

    const rollInitiative = (card: Card) => {
        if (card.isPlayer) {
            const input = window.prompt(`Инициатива ${card.name}:`, '0');
            return Math.max(0, Math.min(1000, Number(input)));
        }
        const roll = Math.floor(Math.random() * 20 + 1);
        return roll + (card.initiativeBonus || 0);
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
        setTurnState({
            turnCounter: 0,
            currentTurnIndex: 0,
            round: 1,
            timer: 0
        });
        setExpiredConditions([]);
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
        setTurnState({ turnCounter: 0, currentTurnIndex: 0, round: 0, timer: 0 });
        setExpiredConditions([]);
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        const totalCards = battleCards.length;
        const newTurn = turnState.turnCounter + 1;
        const currentCardIndex = newTurn % totalCards;
        const currentCard = battleCards[currentCardIndex];

        setBattleCards(prevCards => {
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

            if (expired.length > 0) {
                setExpiredConditions(prev => [...prev, ...expired.filter(msg => !prev.includes(msg))]);
            }

            return updated;
        });

        // обновляем счётчики отдельно
        setTurnState({
            turnCounter: newTurn,
            currentTurnIndex: currentCardIndex,
            round: Math.floor(newTurn / totalCards) + 1,
            timer: turnState.timer + turnDuration
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
                setIsBattle(false);
                setTurnState({ turnCounter: 0, currentTurnIndex: 0, round: 0, timer: 0 });

                // оставшуюся карточку возвращаем в основной список
                setCards(prevCards => {
                    const remainingCard = updated[0];
                    if (!remainingCard) return prevCards;
                    const exists = prevCards.some(c => c.id === remainingCard.id);
                    return exists ? prevCards : [...prevCards, remainingCard];
                });

                return [];
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
            // 1️⃣ Устанавливаем хп в 0
            changeHits(id, -card.currentHits);

            // 2️⃣ Убираем из боя и возвращаем в cards с currentHits = 0
            setCards(prev => {
                const exists = prev.some(c => c.id === card.id);
                if (exists) {
                    return prev.map(c =>
                        c.id === card.id ? { ...c, currentHits: 0 } : c
                    );
                } else {
                    return [...prev, { ...card, currentHits: 0 }];
                }
            });

            // 3️⃣ Убираем из battleCards
            getOutOfBattle(id);
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

    const resurrectCard = (id: string) => {
        setCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, currentHits: card.maxHits } : card
            )
        );
    };

    const clearExpiredConditions = () => {
        setExpiredConditions([]);
    };

    return {
        isBattle,
        battleCards,
        turnState,
        expiredConditions,
        startFight,
        stopBattle,
        nextMove,
        addUserToBattle,
        getOutOfBattle,
        subtractHits,
        addHits,
        longRest,
        addCondition,
        clearExpiredConditions,
        resurrectCard
    };
};