import React, { useEffect, useState } from 'react';

import store from '../../utils/store';

import styles from './app.module.scss';
import InputPlus from '../InputPlus/InputPlus';
import InputTask from '../InputTask/InputTask';

import { FavoriteTasks } from '../FavoriteTasks/FavoriteTasks';

const App: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Completed' | 'Incompleted' | 'Favorite'>('All');
    const [tasks, addTask, updateTask, removeTask, updateTaskCategory, loadTasksFromJSON] = store(state => [
        state.tasks,
        state.addTask,
        state.updateTask,
        state.removeTask,
        state.updateTaskCategory,
        state.loadTasksFromJSON
    ]);

    useEffect(() => {
        const jsonData = {
            data: [
                {
                    id: 44,
                    attributes: {
                        title: 'Уже сделано',
                        description: 'Парампампам',
                        status: 'completed',
                        createdAt: '2024-05-26T20:24:33.499Z',
                        updatedAt: '2024-05-28T04:21:14.814Z',
                        publishedAt: '2024-05-26T20:24:33.498Z',
                    },
                },
                {
                    id: 74,
                    attributes: {
                        title: 'Сделать что-то',
                        description: 'Парампампам',
                        status: 'active',
                        createdAt: '2024-05-27T15:33:45.227Z',
                        updatedAt: '2024-05-28T09:42:36.809Z',
                        publishedAt: '2024-05-27T15:33:45.227Z',
                    },
                },
            ],
            meta: {
                pagination: {
                    page: 1,
                    pageSize: 25,
                    pageCount: 1,
                    total: 2,
                },
            },
        };
        loadTasksFromJSON(jsonData);
    }, [loadTasksFromJSON]);

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

                <section>
                    {(!tasks.length && (
                        <p className={styles.articleNoTasks}>No tasks here... 😴</p>
                    )) ||
                        (tasks.length > 0 && (
                            <p className={styles.articleActiveTasks}>Active Tasks 🗃️:</p>
                        ))}
                    {tasks.map(task => (
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
