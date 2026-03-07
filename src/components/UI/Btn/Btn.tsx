import type {ReactNode} from 'react';
import styles from './Btn.module.css';

interface BtnProps {
    children?: ReactNode,
    onClick?: () => void,
    classBtn?: string,
    type?: 'submit' | 'button'
}

function Btn({children, onClick, classBtn, type='button'}: BtnProps) {
    return (
        <button
            type={type}
            className={classBtn ? styles[classBtn] : ''}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Btn
