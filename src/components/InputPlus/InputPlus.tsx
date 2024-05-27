import React, { useState, useEffect, useCallback } from 'react';

import styles from './inputplus.module.scss';

import plusSvg from '../../assets/icons/plus.svg';

interface InputPlusProps {
    onAdd: (title: string) => void;
}

const InputPlus: React.FC<InputPlusProps> = ({
    onAdd, 
}) => {

    const [inputValue, setInputValue] = useState('');
    const addTask = useCallback(() => {
        onAdd(inputValue);
        setInputValue('');
    }, [inputValue, onAdd]);

    return (
        <div className={styles.inputPlus}>
            <input 
                type='text'
                className={styles.inputPlusValue} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Введите текст...'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        addTask();
                    }
                }}
            />
            <button
                onClick={addTask}
                aria-label='Add'
                className={styles.inputPlusButton}>
                <img src={plusSvg} alt="input button"/>    
            </button>
        </div>
    );
};
export default InputPlus;
