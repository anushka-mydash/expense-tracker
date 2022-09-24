import { useContext } from 'react'
import { ExpensesContext } from '../store/expensesContext'

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput'

export default function AllExpenses() {
  const expensesContext = useContext(ExpensesContext)
  return (
    <ExpensesOutput
      expenses={expensesContext.expenses}
      expensesPeriod='Total'
      fallbackText={'No expenses found.'}
    />
  )
}