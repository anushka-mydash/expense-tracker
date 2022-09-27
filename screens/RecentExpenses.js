import { useContext, useEffect, useState } from 'react'

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'
import { ExpensesContext } from '../store/expensesContext'
import { getDateMinusDays } from '../utils/date';
import { fetchExpenses } from '../utils/api';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

export default function RecentExpenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const expensesContext = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses();
        expensesContext.setExpenses(expenses);
      } catch (error) {
        setError('Could not fetch expenses!')
      }
      setIsLoading(false)
    }

    getExpenses();
  }, [])

  if (error && !isLoading) {
    return <ErrorOverlay message={error} />
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

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