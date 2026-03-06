import { useState, useEffect, useRef } from 'react';
import type { Condition } from '../../hooks/useBattle';
import styles from './Modals.module.css';
import Input from "../UI/Input/Input.tsx";
import Btn from "../UI/Btn/Btn.tsx";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (condition: Condition) => void;
}

export default function ConditionModal({ isOpen, onClose, onAdd }: Props) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'round' | 'time'>('round');
    const [duration, setDuration] = useState(1);

    const nameInputRef = useRef<HTMLInputElement>(null);

    // Автофокус на поле "Название состояния"
    useEffect(() => {
        if (isOpen) {
            const id = setTimeout(() => {
                nameInputRef.current?.focus();
            }, 0);
            return () => clearTimeout(id);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            name,
            type,
            duration,
            remaining: duration
        });
        setName('');
        setDuration(1);
        setType('round');
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>Добавить состояние</h2>

                <Input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                >
                    Название состояния:
                </Input>

                <label>
                    Тип:
                    <select value={type} onChange={e => setType(e.target.value as 'round' | 'time')}>
                        <option value="round">Раунды</option>
                        <option value="time">Минуты</option>
                    </select>
                </label>

                <label>
                    Продолжительность:
                    <input
                        type="number"
                        min={1}
                        value={duration}
                        onChange={e => setDuration(Number(e.target.value))}
                    />
                </label>

                <div className={styles.modalButtons}>
                    <Btn onClick={handleSubmit}>Добавить</Btn>
                </div>
            </div>
        </div>
    );
}