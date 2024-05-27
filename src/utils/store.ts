import { create } from 'zustand';

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

export const store = create<ToDoStore>((set, get) => ({
    tasks: [
        {
            id: 'abds',
            title: 'Buy milk',
            createdAt: new Date()
        }
       
    ],
    addTask: (title) => {

        const { tasks } = get();
        cos
        console.log(tasks);
    },
    updateTask: (id, title) => {},
    removeTask: (id) => {},
    
}));