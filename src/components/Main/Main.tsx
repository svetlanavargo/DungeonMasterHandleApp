import type {Card} from '../../App.tsx';
import CardItem from '../UI/Card/CardItem.tsx';
import styles from './Main.module.css';

interface MainProps {
    cards: Card[],
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function Main({cards, onEdit, onDelete}: MainProps) {
    return (
        <div className={styles.main}>
            {cards.length === 0 ? (
                <p>Нет карточек. Добавьте новую.</p>
            ) : (
                <div className={styles.cardWrapper}>
                    {cards.map(card => card && (
                        <CardItem
                            key={card.id}
                            card={card}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Main