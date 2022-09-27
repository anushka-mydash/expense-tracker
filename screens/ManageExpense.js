import { View, StyleSheet } from 'react-native'
import { useLayoutEffect, useContext, useState } from 'react'

import IconButton from '../components/UI/IconButton'
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expensesContext'
import { storeExpense, updateExpense, deleteExpense } from '../utils/api'

export default function ManageExpense({ route, navigation }) {
  const expensesContext = useContext(ExpensesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const editedExpenseId = route.params?.expenseId
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesContext.expenses.find(expense => expense.id === editedExpenseId)

  async function deleteExpenseHandler() {
    setIsLoading(true)
    try {
      await deleteExpense(editedExpenseId);
      expensesContext.deleteExpense(editedExpenseId)
      navigation.goBack();
    } catch (error) {
      setError('Could not delete expense - please try again.')
      setIsLoading(false)
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsLoading(true)
    try {
      if (isEditing) {
        await updateExpense(editedExpenseId, expenseData);
        expensesContext.updateExpense(editedExpenseId, expenseData)
      } else {
        const id = await storeExpense(expenseData)
        expensesContext.addExpense({ id: id, ...expenseData })
      }
      navigation.goBack();
    }
    catch (error) {
      setError('Could not save data - please try again.')
      setIsLoading(false)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense'
    })
  }, [navigation, isEditing])

  if (error && !isLoading) {
    return <ErrorOverlay message={error} />
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon='trash'
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
})