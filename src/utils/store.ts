import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import generatedId from './helpers';
interface Task {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'active';
    category: 'All' | 'Completed' | 'Incompleted' | 'Favorite';
}

interface ToDoStore {
    tasks: Task[];
    favoriteTasks: Task[];
    currentFilter: Task['category'];
    addTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    filterTasks: () => Task[];
    removeTask: (id: string) => void;
    updateTaskCategory: (id: string, category: Task['category']) => void;
    setFilter: (filter: Task['category']) => void;
    loadFavoriteTasks: () => void;
    loadTasksFromServer: () => Promise<void>;
    loadMoreTasksFromServer: () => Promise<void>;
    hasMore: boolean; // для отслеживания наличия дополнительных задач
   
}

const store = create<ToDoStore>()(
    devtools(
        // persist(
        (set, get) => ({
            tasks: [],
            favoriteTasks: JSON.parse(localStorage.getItem('favoriteTasks') || '[]'),
            currentFilter: 'All',
            hasMore: true,

            addTask: title => {
                const { tasks } = get();
                const newTask: Task = {
                    title,
                    id: generatedId(),
                    description: '',
                    status: 'active',
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

            filterTasks: () => {
                const { tasks, currentFilter } = get();
                if (currentFilter === 'All') return tasks;
                return tasks.filter(task => task.category === currentFilter);
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

            setFilter: (filter: Task['category']) => {
                set({ currentFilter: filter });
            },

            loadTasksFromServer: async () => {
                const response = await fetch('https://cms.dev-land.host/api/tasks');
                const jsonData = await response.json();
                const tasks = jsonData.data.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.attributes.title,
                    description: item.attributes.description,
                    status: item.attributes.status,
                    category: item.attributes.status === 'completed' ? 'Completed' : 'Incompleted',
                }));
    
                set({ tasks });
            },
    
            loadFavoriteTasks: () => {
                const favoriteTasks = JSON.parse(localStorage.getItem('favoriteTasks') || '[]');
                set({ favoriteTasks });
            },

            loadMoreTasksFromServer: async () => {
                const { tasks } = get();
                const limit = 10;
                const response = await fetch(`https://cms.dev-land.host/api/tasks?start=${tasks.length}&limit=${limit}`);
                const jsonData = await response.json();
                const newTasks = jsonData.data.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.attributes.title,
                    description: item.attributes.description,
                    status: item.attributes.status,
                    category: item.attributes.status === 'completed' ? 'Completed' : 'Incompleted',
                }));

                if (newTasks.length < 10) {
                    set({ hasMore: false });
                }

                set({ tasks: [...tasks, ...newTasks] });
            },
        }),
    ),
);

export default store;
