export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface TodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
} 