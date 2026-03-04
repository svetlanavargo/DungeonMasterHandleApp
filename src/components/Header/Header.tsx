import Btn from '../UI/Btn/Btn.tsx';
import styles from './Header.module.css';

interface HeaderProps {
    onAddCard: () => void
}

function Header({onAddCard}: HeaderProps) {
    return (
        <div className={styles.header}>
            <div>
                <Btn classBtn='addCard' onClick={onAddCard}/>
            </div>
        </div>
    )
}

export default Header