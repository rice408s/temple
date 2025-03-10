import { TodoForm } from '../../components/common/TodoForm';
import { TodoList } from '../../components/common/TodoList';
import { useTodos } from '../../hooks/useTodos';
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

const TodoListPage: React.FC = () => {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();

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
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Todo App
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            管理你的所有待办事项
          </p>
        </div>
      </Card>

      <div className="space-y-6">
        <TodoForm onAdd={addTodo} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">待办列表</h2>
              <p className="text-sm text-muted-foreground">
                共 {todos.length} 项待办，{todos.filter(todo => todo.completed).length} 项已完成
              </p>
            </div>
          </div>

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoListPage; 