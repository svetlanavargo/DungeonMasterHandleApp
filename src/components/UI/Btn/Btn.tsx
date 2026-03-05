import type {ReactNode} from 'react';
import styles from './Btn.module.css';

interface BtnProps {
    children?: ReactNode,
    onClick: () => void,
    classBtn?: string
}

function Btn({children, onClick, classBtn}: BtnProps) {
    return (
        <button
            className={classBtn ? styles[classBtn] : ''}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Btn
