import {useState, useEffect} from 'react';
import Header from './components/Header/Header.tsx';
import CardsList from './components/CardsList/CardsList.tsx';
import Times from './components/Times/Times.tsx';
import BattleField from './components/BattleField/BattleField.tsx';
import CreateCardModal from './components/CreateCardModal/CreateCardModal.tsx';
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

interface BattleCard extends Card {
    initiative: number;
    currentHits: number;
}

function App() {
    const [cards, setCards] = useState<Card[]>(() => {
        const savedCards = localStorage.getItem('cards')

        if (savedCards) {
            return JSON.parse(savedCards)
        }

        return []
    })

    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards))
    }, [cards]);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [isBattle, setIsBattle] = useState(false)
    const [timer, setTimer] = useState(0)
    const [round, setRound] = useState(0)
    const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
    const [currentTurnIndex, setCurrentTurnIndex] =useState(0)
    const [turnCounter, setTurnCounter] = useState(0);
    const turnDuration = 6;

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCardId(null);
    }

    const handleSubmit = (data: Omit<Card, 'id'>) => {
        if (editingCardId) {
            setCards(prev =>
                prev.map(card =>
                    card.id === editingCardId
                        ? { ...card, ...data }
                        : card
                )
            )
        }
        else {
            const newCard: Card = {
                id: crypto.randomUUID(),
                ...data
            }
            setCards(prev => [...prev, newCard])
        }

        closeModal()
    }
    const handleDelete = (id: string) => {
        setCards(prev => prev.filter(card => card.id !== id))
    }
    const handleEdit = (id: string) => {
        setEditingCardId(id)
        setIsModalOpen(true)
    }

    const rollInitiative = (card: Card) => {
        if (card.isPlayer) {
            const input = window.prompt(`Введите инициативу для ${card.name}:`, '0')
            return Math.max(0, Math.min(1000, Number(input)));
        }
        else {
            const init = Math.floor(Math.random() * 20 + 1)

            if (card.initiativeBonus) {
                return init + card.initiativeBonus
            }
            else {
                return init
            }
        }
    }

    const addUserToBattle = (id:string) => {
        const card = cards.find(c => c.id === id);

        if (!card) return

        const initiative = rollInitiative(card);

        const newBattleCard = {
            ...card,
            initiative,
            currentHits: card.currentHits
        }

        setBattleCards(prev => {
            const upd = [...prev, newBattleCard]
            upd.sort((a, b) => b.initiative - a.initiative)
            return upd
        })
    }

    const startFight = () => {
        const newBattleCards: BattleCard[] = [];

        for (const card of cards) {
            const initiative = rollInitiative(card);

            newBattleCards.push({
                ...card,
                initiative,
                currentHits: card.currentHits
            })
        }

        newBattleCards.sort((a, b) => b.initiative - a.initiative);
        setBattleCards(newBattleCards);
        setIsBattle(true);
        setTurnCounter(0);
        setCurrentTurnIndex(0);
        setRound(1);
        setTimer(0);
    }

    const getOutOfBattle = (id: string) => {
        setBattleCards(prevBattle => {
            const leavingCard = prevBattle.find(c => c.id === id);
            if (!leavingCard) return prevBattle;

            setCards(prevCards => {
                const exists = prevCards.some(c => c.id === leavingCard.id);
                if (exists) return prevCards;
                return [...prevCards, leavingCard];
            });

            const updatedBattle = prevBattle.filter(c => c.id !== id);

            if (updatedBattle.length === 0) {
                setIsBattle(false);
            }

            return updatedBattle;
        });
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        setTimer(prev => prev + turnDuration);

        setTurnCounter(prev => {
            const newTurn = prev + 1;
            const totalCards = battleCards.length;

            // вычисляем индекс текущей карты через остаток от деления
            const newIndex = newTurn % totalCards;
            setCurrentTurnIndex(newIndex);

            // вычисляем раунд через полные циклы
            const newRound = Math.floor(newTurn / totalCards) + 1;
            setRound(newRound);

            return newTurn;
        });
    };

    const editingCard = cards.find(card => card.id === editingCardId)

    return (
        <>
            <Header onAddCard={openModal}/>

            <div className='container'>
                <Times
                    isBattle={isBattle}
                    turnCounter={turnCounter}
                    timer={timer}
                    round={round}
                />
                <BattleField
                    isBattle={isBattle}
                    countCards={cards.length}
                    cards={battleCards}
                    startFight={startFight}
                    getOutOfBattle={getOutOfBattle}
                    currentTurnIndex={currentTurnIndex}
                    nextMove={nextMove}

                />
                <CardsList
                    cards={cards}
                    battleCards={battleCards}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isBattle={isBattle}
                    addUserToBattle={addUserToBattle}
                />
            </div>

            <CreateCardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialValues={
                    editingCard
                        ? {
                            name: editingCard.name,
                            maxHits: editingCard.maxHits,
                            currentHits: editingCard.currentHits,
                            ac: editingCard.ac,
                            isPlayer: editingCard.isPlayer,
                            initiativeBonus: editingCard.initiativeBonus,
                            note: editingCard.note,
                            color: editingCard.color
                        }
                        : undefined
                }
            />
        </>
    )
}

export default App
