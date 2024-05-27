import React from 'react';

import { store } from '../../utils/store';

import style from './app.module.scss';

const App: React.FC = () => {

    const [tasks, addTask, updateTask, removeTask] = store(state=> [
        state.tasks,
        state.addTask,
        state.updateTask,
        state.removeTask,
    ]);

    addTask('Learn TS');

    return (
        <>
            <article className={style.article}>
                <h1 className={style.title}>To Do App</h1>
                <section className={style.section}></section>
                <section className={style.section}></section>
            </article>
        </>
    );
};

export default App;
