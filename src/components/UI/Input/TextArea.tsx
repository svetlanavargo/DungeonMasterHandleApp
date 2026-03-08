import React, { type ReactNode } from 'react';
import styles from "./Input.module.css";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    children: ReactNode;
}

function TextArea({ children, ...props }: TextAreaProps) {
    return (
        <label className={styles.label}>
            {children}
            <textarea rows={3} {...props} />
        </label>
    );
}

export default TextArea;