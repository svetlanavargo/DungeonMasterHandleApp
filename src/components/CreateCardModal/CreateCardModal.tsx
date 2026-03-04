import { useState, useEffect } from 'react';
import type {Card} from '../../App.tsx';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import styles from './CreateCardModal.module.css';

interface CardModalProps {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: Omit<Card, 'id'>) => void;
    initialValues?: Omit<Card, 'id'>;
}

function CreateCardModal({isOpen, onClose, onSubmit, initialValues}: CardModalProps)  {
    const [formValues, setFormValues] = useState<Omit<Card, 'id'>>({
        name: '',
        hits: 10,
        ac: 10,
        isPlayer: false,
        note: '',
        color: undefined
    });

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            setFormValues(initialValues || { name: '', hits: 10, ac: 10, isPlayer: false, note: '' });
        }, 0);

        return () => clearTimeout(timer);
    }, [initialValues, isOpen]);

    const handleChange = <K extends keyof Omit<Card, 'id'>>(
        field: K,
        value: Omit<Card, 'id'>[K]
    ) => {
        setFormValues(prev => {
            const updated = { ...prev, [field]: value };

            if (field === 'isPlayer' && value === false) {
                updated.color = undefined;
            }

            return updated;
        });
    };

    const handleSubmit = () => {
        onSubmit(formValues);
        setFormValues(initialValues || {
            name: '',
            hits: 10,
            ac: 10,
            isPlayer: false,
            note: '',
            color: undefined
        });
    }

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{initialValues ? 'Редактировать карточку' : 'Новая карточка'}</h2>

                <Input
                    type="text"
                    value={formValues.name}
                    onChange={e => handleChange('name', e.target.value)}
                >
                    Имя:
                </Input>
                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.hits}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        handleChange('hits', value === '' ? 0 : Number(value))
                    }}
                >
                    Хиты:
                </Input>
                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.ac}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        handleChange('ac',  value === '' ? 0 : Number(value))
                    }}
                >
                    КД:
                </Input>
                <Input
                    type="text"
                    value={formValues.note}
                    onChange={e => handleChange('note', e.target.value)}                >
                    Заметка:
                </Input>
                <label>
                    Это игрок?
                    <input
                        type="checkbox"
                        checked={formValues.isPlayer}
                        onChange={e => handleChange('isPlayer', e.target.checked)}
                    />
                </label>
                {formValues.isPlayer && (
                    <label>
                        <select
                            value={formValues.color || ''}
                            onChange={(e) =>
                                handleChange('color', e.target.value as 'red' | 'blue' | 'green')
                            }
                        >
                            <option value="">Выбрать цвет</option>
                            <option value="red">🔴</option>
                            <option value="blue">🔵</option>
                            <option value="green">🟢</option>
                        </select>
                    </label>
                )}

                <div className={styles.modalButtons}>
                    <Btn onClick={onClose} classBtn='btn' >Отмена</Btn>
                    <Btn onClick={handleSubmit} classBtn='btn' >{initialValues ? 'Сохранить' : 'Готово'}</Btn>
                </div>
            </div>
        </div>
    )
}

export default CreateCardModal