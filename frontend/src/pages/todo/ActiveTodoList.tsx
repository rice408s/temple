import { TodoList } from '../../components/common/TodoList';
import { useTodos } from '../../hooks/useTodos';
import { Loader2, AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

const ActiveTodoList: React.FC = () => {
  const { todos, loading, error, toggleTodo, deleteTodo } = useTodos();
  const activeTodos = todos.filter(todo => !todo.completed);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {typeof error === 'string' ? error : error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      <Card className="p-6 md:p-8 border-none bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Loader className="h-5 w-5 text-primary animate-spin" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              进行中
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              正在进行的待办事项
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">进行中的待办</h2>
            <p className="text-sm text-muted-foreground">
              共 {activeTodos.length} 项待办正在进行中
            </p>
          </div>
        </div>

        <TodoList
          todos={activeTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
};

export default ActiveTodoList; 