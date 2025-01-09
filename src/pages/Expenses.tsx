import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

export function Expenses() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data: expenses, isLoading } = useQuery(
    ['expenses', user?.id],
    async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    {
      enabled: !!user,
    }
  );

  if (isLoading) return <Loader />;

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900">Expenses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Record New Expense'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Total Expenses</h2>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Record New Expense</h2>
          </CardHeader>
          <CardContent>
            <ExpenseForm />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {expenses?.map((expense) => (
          <Card key={expense.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{expense.category}</h2>
                <span className="flex items-center text-primary-600">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {expense.amount.toFixed(2)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-neutral-600">{expense.description}</p>
              <div className="text-sm text-neutral-500">
                {format(new Date(expense.date), 'PPP')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}