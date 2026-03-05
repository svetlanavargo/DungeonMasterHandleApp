import { useState, useEffect, useCallback } from 'react';
import type { Card } from '../../App.tsx';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import styles from './CreateCardModal.module.css';

interface CardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Card, 'id'>) => void;
    initialValues?: Omit<Card, 'id'>;
}

type FormValues = {
    name: string;
    maxHits: string;
    currentHits: string;
    ac: string;
    note: string;
    isPlayer: boolean;
    initiativeBonus: string,
    color?: 'red' | 'blue' | 'green';
};

const defaultForm: FormValues = {
    name: '',
    maxHits: '10',
    currentHits: '',
    ac: '10',
    note: '',
    isPlayer: false,
    initiativeBonus: '0',
    color: undefined
};

function CreateCardModal({ isOpen, onClose, onSubmit, initialValues }: CardModalProps) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);

    const initializeForm = useCallback(() => {
        if (initialValues) {
            setFormValues({
                name: initialValues.name,
                maxHits: initialValues.maxHits.toString(),
                currentHits: '',
                ac: initialValues.ac.toString(),
                note: initialValues.note ?? '',
                isPlayer: initialValues.isPlayer,
                initiativeBonus: initialValues.initiativeBonus.toString(),
                color: initialValues.color
            });
        } else {
            setFormValues(defaultForm);
        }
    }, [initialValues]);

    useEffect(() => {
        if (!isOpen) return;
        const id = setTimeout(() => initializeForm(), 0);
        return () => clearTimeout(id);
    }, [isOpen, initializeForm]);

    const handleChange = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
        setFormValues(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'isPlayer' && value === false) {
                updated.color = undefined;
            }
            return updated;
        });
    };

    const handleSubmit = () => {
        const data: Omit<Card, 'id'> = {
            name: formValues.name,
            maxHits: Number(formValues.maxHits),
            currentHits: formValues.currentHits === '' ? Number(formValues.maxHits) : Number(formValues.currentHits),
            ac: Number(formValues.ac),
            note: formValues.note,
            isPlayer: formValues.isPlayer,
            initiativeBonus: Number(formValues.initiativeBonus),
            color: formValues.color
        };
        onSubmit(data);
        setFormValues(defaultForm);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
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
                    value={formValues.maxHits}
                    onChange={e => handleChange('maxHits', e.target.value.replace(/\D/g, ''))}
                >
                    Максимум хитов:
                </Input>

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.currentHits}
                    onChange={e => handleChange('currentHits', e.target.value.replace(/\D/g, ''))}
                >
                    Текущие хиты:
                </Input>

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.ac}
                    onChange={e => handleChange('ac', e.target.value.replace(/\D/g, ''))}
                >
                    КД:
                </Input>

                <Input
                    type="text"
                    value={formValues.note}
                    onChange={e => handleChange('note', e.target.value)}
                >
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

                {!formValues.isPlayer && (
                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.initiativeBonus}
                        onChange={e => handleChange('initiativeBonus', e.target.value.replace(/\D/g, ''))}
                    >
                        Бонус инициативы:
                    </Input>
                )}

                {formValues.isPlayer && (
                    <label>
                        <select
                            value={formValues.color || ''}
                            onChange={e =>
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
                    <Btn onClick={handleSubmit}>{initialValues ? 'Сохранить' : 'Готово'}</Btn>
                </div>
            </div>
        </div>
    );
}

export default CreateCardModal;