import type { Card } from '../../../App.tsx';
import Btn from '../Btn/Btn.tsx';
import styles from './Card.module.css';

interface CardProps {
    card: Card;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function CardItem({ card, onEdit, onDelete }:CardProps) {
    const { id, name, hits, ac, isPlayer, color, note } = card;
    let colorClass;

    if (isPlayer && color) {
        if (color === 'red') colorClass = styles.red;
        else if (color === 'blue') colorClass = styles.blue;
        else if (color === 'green') colorClass = styles.green;
    }

    return (
        <div className={`${styles.card} ${colorClass}`}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardName}>
                    {name} {!isPlayer && "- NPC"}
                </h2>
                <div className={styles.btns}>
                    <Btn onClick={() => onEdit(id)} classBtn='edit'/>
                    <Btn onClick={() => onDelete(id)} classBtn='delete'/>
                </div>
            </div>
            <div>
                <p className={styles.description}>Хиты: <b>{hits}</b></p>
                <p className={styles.description}>КД: <b>{ac}</b></p>
                {note ?
                    (<p className={styles.note}>{note}</p>) : null
                }
            </div>
        </div>
    )
}

export default CardItem