import React, { useEffect, useState } from 'react';

import store from '../../utils/store';

import styles from './app.module.scss';
import InputPlus from '../InputPlus/InputPlus';
import InputTask from '../InputTask/InputTask';
import { FavoriteTasks } from '../FavoriteTasks/FavoriteTasks';

const App: React.FC = () => {
    
    fetch('https://cms.dev-land.host/api/tasks')
        .then(res => {
            return res.json();
        })
        .then(res => console.log('Массив', res));

    const [filter, setFilter] = useState<'All' | 'Completed' | 'Incompleted' | 'Favorite'>('All');
    const [tasks, addTask, updateTask, removeTask, updateTaskCategory] = store(state => [
        state.tasks,
        state.addTask,
        state.updateTask,
        state.removeTask,
        state.updateTaskCategory,
    ]);

    const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.category === filter);

    return (
        <>
            <article className={styles.article}>
                <h1 className={styles.articleTitle}>🗓️ To Do App 🗓️</h1>

                <section className={styles.articleSection}>
                    <select
                        className={styles.articleSectionSelect}
                        onChange={e =>
                            setFilter(
                                e.target.value as 'All' | 'Completed' | 'Incompleted' | 'Favorite',
                            )
                        }>
                        <option value='All'>Все</option>
                        <option value='Completed'>Выполненные</option>
                        <option value='Incompleted'>Невыполненные</option>
                        <option value='Favorite'>Избранные</option>
                    </select>
                    <InputPlus
                        onAdd={title => {
                            if (title) {
                                addTask(title);
                            }
                        }}
                    />
                </section>
                {/* <hr /> */}
                <section>
                    {(!filteredTasks.length && (
                        <p className={styles.articleNoTasks}>No tasks here... 😴</p>
                    )) ||
                        (filteredTasks.length > 0 && (
                            <p className={styles.articleActiveTasks}>Active Tasks 🗃️:</p>
                        ))}
                    {filteredTasks.map(task => (
                        <InputTask
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            onDone={removeTask}
                            onEdited={updateTask}
                            onRemoved={removeTask}
                            category={task.category}
                            onCategoryChange={updateTaskCategory}
                        />
                    ))}
                </section>
            </article>
            <FavoriteTasks />
        </>
    );
};

export default App;
