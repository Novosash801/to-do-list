import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import store from '../../utils/store';

import styles from './app.module.scss';
import InputPlus from '../InputPlus/InputPlus';
import InputTask from '../InputTask/InputTask';

import { FavoriteTasks } from '../FavoriteTasks/FavoriteTasks';

const App: React.FC = () => {
    const [
        tasks,
        addTask,
        updateTask,
        removeTask,
        filterTasks,
        updateTaskCategory,
        setFilter,
        loadMoreTasksFromServer,
        hasMore,
    ] = store(state => [
        state.tasks,
        state.addTask,
        state.updateTask,
        state.removeTask,
        state.filterTasks,
        state.updateTaskCategory,
        state.setFilter,
        state.loadMoreTasksFromServer,
        state.hasMore,
    ]);

    const filteredTasks = filterTasks();

    useEffect(() => {
        store.getState().loadTasksFromServer();
    }, []);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value as 'All' | 'Completed' | 'Incompleted' | 'Favorite');
    };

    return (
        <>
            <article className={styles.article}>
                <h1 className={styles.articleTitle}>🗓️ To Do App 🗓️</h1>

                <section className={styles.articleSection}>
                    <select className={styles.articleSectionSelect} onChange={handleCategoryChange}>
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
                    <InfiniteScroll
                        dataLength={filteredTasks.length}
                        next={loadMoreTasksFromServer}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                        endMessage={<p>Yay! You have seen it all</p>}>
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
                    </InfiniteScroll>
                </section>
            </article>
            <FavoriteTasks />
        </>
    );
};

export default App;
