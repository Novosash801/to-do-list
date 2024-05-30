import React, { useState, useEffect, useRef } from 'react';

import styles from './inputTask.module.scss';

import editSvg from '../../assets/icons/edit.svg';
import removeSvg from '../../assets/icons/trash.svg';
import checkSvg from '../../assets/icons/check.svg';
import starSvg from '../../assets/icons/star.svg';

interface InputTaskProps {
    id: string;
    title: string;
    onDone: (id: string) => void;
    onEdited: (id: string, title: string) => void;
    onRemoved: (id: string) => void;
    category: 'All' | 'Completed' | 'Incompleted' | 'Favorite';
    onCategoryChange: (
        id: string,
        category: 'All' | 'Completed' | 'Incompleted' | 'Favorite',
    ) => void;
}

const InputTask: React.FC<InputTaskProps> = ({id, title, onEdited, onRemoved, category, onCategoryChange}) => {
    const [checked, setChecked] = useState(category === 'Completed');
    const [isEditMode, setIsEditMode] = useState(false);
    const [value, setValue] = useState(title);
    const editTitleInputRef = useRef<HTMLInputElement>(null); // для фокуса после edit таски

    useEffect(() => {
        if (isEditMode) {
            editTitleInputRef?.current?.focus();
        }
    }, [isEditMode]);

    return (
        <div className={styles.inputTask}>
            <label className={styles.inputTaskLabel}>
                <input
                    type='checkbox'
                    disabled={isEditMode}
                    checked={checked}
                    className={styles.inputTaskCheckbox}
                    onChange={e => {
                        setChecked(e.target.checked);
                        onCategoryChange(id, e.target.checked ? 'Completed' : 'Incompleted');
                    }}
                />

                {isEditMode ? (
                    <input
                        ref={editTitleInputRef} // для фокуса после edit таски
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                onEdited(id, value);
                                setIsEditMode(false);
                            }
                        }}
                        className={styles.inputTaskTitleEdit}
                    />
                ) : (
                    <p className={styles.inputTaskTitle}>{title}</p>
                )}
            </label>

            {isEditMode ? (
                <button
                    className={styles.inputTaskSave}
                    aria-label='Save'
                    onClick={() => {
                        onEdited(id, value);
                        setIsEditMode(false);
                    }}>
                    <img src={checkSvg} alt='edit button' />
                </button>
            ) : (
                <button
                    aria-label='Edit'
                    className={styles.inputTaskEdit}
                    onClick={() => {
                        setIsEditMode(true);
                    }}>
                    <img src={editSvg} alt='edit button' />
                </button>
            )}

            <button
                aria-label='Remove'
                onClick={() => {
                    window.confirm('Вы уверены?') && onRemoved(id);
                }}
                className={styles.inputTaskRemove}>
                <img src={removeSvg} alt='remove button' />
            </button>

            <button
                className={styles.inputTaskFavorite}
                aria-label='Favorite'
                onClick={() => {
                    onCategoryChange(id, category === 'Favorite' ? 'Incompleted' : 'Favorite');
                }}>
                <img src={starSvg} alt='favorite button' />
            </button>
        </div>
    );
};
export default InputTask;
