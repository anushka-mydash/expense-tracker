import { useContext, useEffect, useState } from 'react'

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'
import { ExpensesContext } from '../store/expensesContext'
import { getDateMinusDays } from '../utils/date';
import { fetchExpenses } from '../utils/api';

export default function RecentExpenses() {
  const expensesContext = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      const expenses = await fetchExpenses();
      expensesContext.setExpenses(expenses);
    }

    getExpenses();
  }, [])

  const recentExpenses = expensesContext.expenses.filter(expense => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date >= date7DaysAgo;
  })

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod='Last 7 Days'
      fallbackText={'No expenses found.'}
    />
  )
}