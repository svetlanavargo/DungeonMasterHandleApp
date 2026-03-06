import Btn from '../UI/Btn/Btn.tsx';
import styles from './Header.module.css';

interface HeaderProps {
    onAddCard: () => void;
    longRest: () => void;
}

function Header({onAddCard, longRest}: HeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.btnWrapper}>
                <Btn onClick={longRest} classBtn='reset'/>
                <Btn classBtn='addCard' onClick={onAddCard}/>
            </div>
        </div>
    )
}

export default Header