import { useState, useEffect } from 'react';
import { useBattle } from './hooks/useBattle.ts';
import type { Condition } from './hooks/useBattle';
import Header from './components/Header/Header.tsx';
import CardsList from './components/CardsList/CardsList.tsx';
import Times from './components/Times/Times.tsx';
import BattleField from './components/BattleField/BattleField.tsx';
import CreateCardModal from './components/Modals/CreateCardModal.tsx';
import ConditionModal from './components/Modals/ConditionModal.tsx';
import NoticesModal from './components/Modals/NoticesModal.tsx';
import './App.css'

export interface Card {
    id: string,
    name: string,
    maxHits: number,
    currentHits: number,
    ac: number,
    note?: string,
    isPlayer: boolean,
    initiativeBonus: number,
    color?: 'red' | 'blue' | 'green' | undefined
}

function App() {
    const [cards, setCards] = useState<Card[]>(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : [];
    });
    const [expiredConditions, setExpiredConditions] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [conditionModalOpen, setConditionModalOpen] = useState(false);
    const [currentCardForCondition, setCurrentCardForCondition] = useState<string | null>(null);

    const {
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
    } = useBattle(cards, setCards, setExpiredConditions);

    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards));
    }, [cards]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { setIsModalOpen(false); setEditingCardId(null); };

    const openConditionModal = (cardId: string) => {
        setCurrentCardForCondition(cardId);
        setConditionModalOpen(true);
    };
    const closeConditionModal = () => {
        setCurrentCardForCondition(null);
        setConditionModalOpen(false);
    };
    const handleAddCondition = (cond: Condition) => {
        if (!currentCardForCondition) return;

        // если состояние типа time, конвертируем минуты в количество ходов
        const remaining = cond.type === 'time' ? cond.duration * 10 : cond.duration;

        addCondition(currentCardForCondition, {
            ...cond,
            remaining
        });
    };

    const handleSubmit = (data: Omit<Card, 'id'>) => {
        if (editingCardId) {
            setCards(prev =>
                prev.map(card => card.id === editingCardId ? { ...card, ...data } : card)
            );
        } else {
            const newCard: Card = { id: Math.random().toString(36).substr(2, 9), ...data };
            setCards(prev => [...prev, newCard]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => setCards(prev => prev.filter(c => c.id !== id));
    const handleEdit = (id: string) => { setEditingCardId(id); setIsModalOpen(true); };
    const handleAddUserToBattle = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card) addUserToBattle(card);
    };

    const editingCard = cards.find(c => c.id === editingCardId);

    return (
        <>
            <Header onAddCard={openModal} longRest={longRest} />

            <div className='container'>
                <Times
                    isBattle={isBattle}
                    turnCounter={turnCounter}
                    timer={timer}
                    round={round}
                    stopBattle={stopBattle}
                />
                <BattleField
                    isBattle={isBattle}
                    cards={battleCards}
                    startFight={startFight}
                    getOutOfBattle={getOutOfBattle}
                    currentTurnIndex={currentTurnIndex}
                    nextMove={nextMove}
                    addHits={addHits}
                    subtractHits={subtractHits}
                    addCondition={openConditionModal}
                />
                <CardsList
                    cards={cards}
                    battleCards={battleCards}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isBattle={isBattle}
                    addUserToBattle={handleAddUserToBattle}
                />
            </div>

            <CreateCardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialValues={editingCard ? {
                    name: editingCard.name,
                    maxHits: editingCard.maxHits,
                    currentHits: editingCard.currentHits,
                    ac: editingCard.ac,
                    isPlayer: editingCard.isPlayer,
                    initiativeBonus: editingCard.initiativeBonus,
                    note: editingCard.note,
                    color: editingCard.color
                } : undefined}
            />
            <ConditionModal
                isOpen={conditionModalOpen}
                onClose={closeConditionModal}
                onAdd={handleAddCondition}
            />

            {expiredConditions.length > 0 && (
                <NoticesModal onClose={clearExpiredConditions}>
                    <div className="expired-notices-content">
                        {expiredConditions.map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                        <button onClick={clearExpiredConditions}>Закрыть</button>
                    </div>
                </NoticesModal>
            )}
        </>
    );
}

export default App;