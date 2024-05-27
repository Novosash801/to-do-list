import React, { useEffect } from 'react';

import store  from '../../utils/store';

import styles from './app.module.scss';
import InputPlus from '../InputPlus/InputPlus';

const App: React.FC = () => {

    const [tasks, addTask, updateTask, removeTask] = store(state => 
        [
            state.tasks,
            state.addTask,
            state.updateTask,
            state.removeTask,
        ]);
    
    console.log(tasks);

    return (
        <>
            <article className={styles.article}>
                <h1 className={styles.title}>To Do App</h1>
                <section className={styles.section}>
                    <InputPlus onAdd={(title) => {
                        if (title) {
                            addTask(title);
                        
                        }
                    }}/>
                </section>
                <section className={styles.section}>
                    
                </section>
            </article>
        </>
    );
};

export default App;
