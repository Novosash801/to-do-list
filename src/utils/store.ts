import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { persist, createJSONStorage } from 'zustand/middleware';

import generatedId from './helpers';
interface Task {
    id: string;
    title: string;
    createdAt: Date;
    category: 'All' | 'Completed' | 'Incompleted' | 'Favorite';
}

interface FilterFunction {
    (task: Task): boolean;
}

interface ToDoStore {
    tasks: Task[];
    addTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    removeTask: (id: string) => void;
    filterTasks: (filter: FilterFunction) => Task[];
    updateTaskCategory: (id: string, category: Task['category']) => void;
    saveFavoriteTasks: () => void;
    loadFavoriteTasks: () => void;
    favoriteTasks: Task[];
}

const store = create<ToDoStore>()(
    devtools(
        // persist(
        (set, get) => ({
            tasks: [],
            favoriteTasks: JSON.parse(localStorage.getItem('favoriteTasks') || '[]'),

            addTask: title => {
                const { tasks } = get();
                const newTask: Task = {
                    id: generatedId(),
                    title,
                    createdAt: new Date(),
                    category: 'Incompleted', // Устанавливаем категорию по умолчанию
                };

                set({
                    tasks: [newTask, ...tasks],
                });
            },

            updateTask: (id: string, title: string) => {
                const { tasks } = get();
                const updatedTasks = tasks.map(task => {
                    if (task.id === id) {
                        return {
                            ...task,
                            title: task.id === id ? title : task.title,
                        };
                    }
                    return task;
                });

                set({ tasks: updatedTasks });
            },

            removeTask: (id: string) => {
                const { tasks } = get();
                const updatedTasks = tasks.filter(task => task.id !== id);

                set({ tasks: updatedTasks });
            },

            filterTasks: filter => {
                const { tasks } = get();
                return tasks.filter(filter);
            },

            updateTaskCategory: (id: string, category: Task['category']) => {
                const { tasks, favoriteTasks } = get();
                const updatedTasks = tasks.map(task => {
                    if (task.id === id) {
                        if (task.category === 'Favorite') {
                            const updatedFavoriteTasks = favoriteTasks.filter(
                                favTask => favTask.id !== id,
                            );
                            localStorage.setItem(
                                'favoriteTasks',
                                JSON.stringify(updatedFavoriteTasks),
                            );
                            set({ favoriteTasks: updatedFavoriteTasks });
                        }
                        const updatedTask = {
                            ...task,
                            category,
                        };
                        if (category === 'Favorite') {
                            const newFavoriteTasks = [...favoriteTasks, updatedTask];
                            localStorage.setItem('favoriteTasks', JSON.stringify(newFavoriteTasks));
                            set({ favoriteTasks: newFavoriteTasks });
                        }
                        return updatedTask;
                    }
                    return task;
                });

                set({ tasks: updatedTasks });
            },

            loadFavoriteTasks: () => {
                const favoriteTasks = JSON.parse(localStorage.getItem('favoriteTasks') || '[]');
                set({ favoriteTasks });
            },

            saveFavoriteTasks: () => {
                const { favoriteTasks } = get();
                localStorage.setItem('favoriteTasks', JSON.stringify(favoriteTasks));
            },
        }),
    ),
    // ),
);

export default store;
