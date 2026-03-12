import type {ReactNode} from 'react';
import styles from './Burger.module.css';

interface BurgerProps {
    children: ReactNode
    isOpen: boolean;
    toggleMenu: () => void
}

export default function BurgerMenu({children, toggleMenu, isOpen}: BurgerProps) {
    return (
        <div className={styles.burgerWrapper}>
            <button
                className={`${styles.burger} ${isOpen ? styles.open : ""}`}
                onClick={toggleMenu}
            >
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>

            <nav className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
                {children}
            </nav>
        </div>
    );
}