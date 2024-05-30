import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

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
}

const store = create<ToDoStore>()(
    devtools(
        persist(
            (set, get) => ({
                tasks: [],

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
                updateTaskCategory: (id: string, category: Task['category']) => { // Функция для обновления категории
                    
                    const { tasks } = get();
                    const updatedTasks = tasks.map(task => {
                        if (task.id === id) {
                            return {
                                ...task,
                                category,
                            };
                        }
                        return task;
                    });

                    set({ tasks: updatedTasks });
                },
            }),
            {
                name: 'todo-app',
                storage: createJSONStorage(() => localStorage),
            },
        ),
    ),
);

export default store;
