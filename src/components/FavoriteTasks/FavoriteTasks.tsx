import React, {useEffect} from 'react';

import store from '../../utils/store';

import styles from './favoriteTasks.module.scss';

export const FavoriteTasks: React.FC = () => {

    const favoriteTasks = store(state => state.favoriteTasks);
    const loadFavoriteTasks = store(state => state.loadFavoriteTasks);

    useEffect(() => {
        loadFavoriteTasks();
    }, [loadFavoriteTasks]);

    return (
        <article className={styles.article}>
            <p className={styles.articleTitle}>⭐Favorite tasks⭐</p>
            {!favoriteTasks.length && (
                <p className={styles.articleText}>There is no favorite task.</p>
            )}
            {favoriteTasks.map((task, index) => (
                <p
                    key={task.id}
                    className={styles.articleTextLeft}
                >{index + 1}. {task.title}</p>
            ))}
        </article>
    );
};
