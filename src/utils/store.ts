import { create } from 'zustand';
import generatedId from './helpers';
interface Task {
    id: string;
    title: string;
    createdAt: Date;
}

interface ToDoStore {
    tasks: Task[];
    addTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    removeTask: (id: string) => void;

}

const store = create<ToDoStore>((set, get) => ({
    tasks: [
        {
            id: 'aboba',
            title: 'My first task',
            createdAt: new Date()
        },
        {
            id: 'beebee',
            title: 'My second task',
            createdAt: new Date()
        },
    ],

    addTask: (title) => {
        const { tasks } = get();
        const newTask = {
            id: generatedId(),
            title,
            createdAt: new Date()
        
        };

        set({ 
            tasks: [...tasks, newTask] 
        });
    },

    updateTask: (id: string, title: string) => {
        const { tasks } = get();
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return {
                    ...task,
                    title: task.id === id? title : task.title,
                };
            }
            return task;
        });

        set({ tasks: updatedTasks });
    
    },
    removeTask: (id: string) => {
        const { tasks } = get();
        const updatedTasks = tasks.filter((task) => task.id !== id);

        set({ tasks: updatedTasks });
    
    },
    
}));

export default store;