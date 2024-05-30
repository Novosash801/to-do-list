import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import generatedId from './helpers';
interface Task {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'active';
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    category: 'All' | 'Completed' | 'Incompleted' | 'Favorite';
}

interface FilterFunction {
    (task: Task): boolean;
}

interface ToDoStore {
    tasks: Task[];
    favoriteTasks: Task[];
    addTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    removeTask: (id: string) => void;
    filterTasks: (filter: FilterFunction) => Task[];
    updateTaskCategory: (id: string, category: Task['category']) => void;
    loadFavoriteTasks: () => void;
    loadTasksFromServer: () => Promise<void>;
   
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
                    title,
                    id: generatedId(),
                    description: '',
                    status: 'active',
                    updatedAt: new Date(),
                    publishedAt: new Date(),
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
                            title,
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

            loadTasksFromServer: async () => {
                const response = await fetch('https://cms.dev-land.host/api/tasks');
                const jsonData = await response.json();
                const tasks = jsonData.data.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.attributes.title,
                    description: item.attributes.description,
                    status: item.attributes.status,
                    createdAt: new Date(item.attributes.createdAt),
                    updatedAt: new Date(item.attributes.updatedAt),
                    publishedAt: new Date(item.attributes.publishedAt),
                    category: item.attributes.status === 'completed' ? 'Completed' : 'Incompleted',
                }));
    
                set({ tasks });
            },
    
            loadFavoriteTasks: () => {
                const favoriteTasks = JSON.parse(localStorage.getItem('favoriteTasks') || '[]');
                set({ favoriteTasks });
            },

        }),
    ),
);

export default store;
