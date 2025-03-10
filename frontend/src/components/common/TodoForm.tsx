import { useState, FormEvent } from 'react';
import { TodoFormProps } from '../../types/todo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onAdd(title);
      setTitle('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 border-dashed hover:border-solid transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none text-muted-foreground">
            添加新的待办事项
          </label>
          <div className="flex gap-3">
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入待办事项..."
              disabled={submitting}
              className={cn(
                "flex-1 transition-all duration-200",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "border border-input hover:border-accent",
                "focus-visible:border-accent focus-visible:bg-accent/5"
              )}
            />
            <Button
              type="submit"
              disabled={submitting || !title.trim()}
              className="min-w-[100px] transition-all duration-200"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  添加中
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  添加
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}; 