import { TodoListProps } from '../../types/todo';
import { TodoItem } from './TodoItem';
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  const { t } = useTranslation('todos');

  if (todos.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
        <div className="rounded-full bg-muted p-3 ring-2 ring-muted">
          <ClipboardList className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-medium text-foreground">{t('list.empty')}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('list.empty_description')}
        </p>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-border/50 border-dashed hover:border-solid transition-all duration-300">
      <ul className="divide-y divide-border/50">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggle(todo.id)}
            onDelete={() => onDelete(todo.id)}
          />
        ))}
      </ul>
    </Card>
  );
}; 