import React from 'react';
import styles from './Input.module.css';

interface InputProps {
    children: React.ReactNode,
    type: "text" | "number",
    inputMode?: "text" | "numeric",
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({children, ...props}: InputProps) {
    return(
        <label className={styles.label}>
            {children}
            <input {...props}/>
        </label>
    )
}

export default Input