import {useState} from 'react';
import Header from './components/Header/Header.tsx';
import Main from './components/Main/Main.tsx';
import CreateCardModal from './components/CreateCardModal/CreateCardModal.tsx';
import './App.css'

export interface Card {
    id: string,
    name: string,
    hits: number,
    ac: number,
    note?: string,
    isPlayer: boolean,
    color?: 'red' | 'blue' | 'green'
}

function App() {
    const [cards, setCards] = useState<Card[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCardId, setEditingCardId] = useState<string | null>(null);

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

    const editingCard = cards.find(card => card.id === editingCardId)

    return (
        <>
            <Header onAddCard={openModal}/>

            <Main
                cards={cards}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateCardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialValues={
                    editingCard
                        ? {
                            name: editingCard.name,
                            hits: editingCard.hits,
                            ac: editingCard.ac,
                            isPlayer: editingCard.isPlayer,
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
