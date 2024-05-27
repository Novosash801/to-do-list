import React, { useEffect } from 'react';

import store  from '../../utils/store';

import styles from './app.module.scss';
import InputPlus from '../InputPlus/InputPlus';
import InputTask from '../InputTask/InputTask';

const App: React.FC = () => {

    const [tasks, addTask, updateTask, removeTask] = store(state => 
        [
            state.tasks,
            state.addTask,
            state.updateTask,
            state.removeTask,
        ]);
    
    // console.log(tasks);

    return (
        <>
            <article className={styles.article}>
                <h1 className={styles.title}>To Do App</h1>
                <section className={styles.section}>
                    <InputPlus onAdd={title => {
                        if (title) {
                            addTask(title);
                        
                        }
                    }}/>
                </section>
                <section className={styles.taskSection}>
                    {!tasks.length && (
                        <p className={styles.articleText}>No tasks here</p>
                    
                    )}
                    {tasks.map(task => (
                        <InputTask
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            onDone={title => {
                                if (title) {
                                    updateTask(task.id, title);

                                }
                            }}
                            onEdited={updateTask}
                            onRemoved={removeTask}
                        />
                    ))}
                </section>
            </article>
        </>
    );
};

export default App;
