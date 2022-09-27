import { View, StyleSheet } from 'react-native'
import { useLayoutEffect, useContext } from 'react'

import IconButton from '../components/UI/IconButton'
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expensesContext'

export default function ManageExpense({ route, navigation }) {
  const expensesContext = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesContext.expenses.find(expense => expense.id === editedExpenseId)

  function deleteExpenseHandler() {
    expensesContext.deleteExpense(editedExpenseId)
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function confirmHandler(expenseData) {
    if (isEditing) {
      expensesContext.updateExpense(editedExpenseId, expenseData)
    } else {
      expensesContext.addExpense(expenseData)
    }
    navigation.goBack();
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense'
    })
  }, [navigation, isEditing])

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