import { TodoItemProps } from '../../types/todo';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="group relative transition-all duration-200 hover:bg-accent/50">
      <div className="flex items-center justify-between gap-4 py-4 px-6">
        <div className="flex items-center min-w-0 flex-1 gap-4">
          <div className="flex-shrink-0">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle()}
              className={cn(
                "h-5 w-5 transition-all duration-200",
                "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-200",
                  todo.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}
              >
                {todo.title}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground/70">
              创建于 {new Date(todo.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200",
              "hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">删除</span>
          </Button>
        </div>
      </div>
    </li>
  );
}; 