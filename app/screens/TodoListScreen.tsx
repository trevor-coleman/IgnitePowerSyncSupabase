import { Button, Icon, ListItem, Screen, Text, TextField } from "app/components"
import { SignedInNavigatorProp } from "app/navigators"
import { TodoRecord } from "app/services/database/schema"
import { useList } from "app/services/database/use-list"
import { colors, spacing } from "app/theme"
import React, { FC, useCallback } from "react"
import { FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface TodoListScreenProps extends SignedInNavigatorProp<"TodoList"> {}

export const TodoListScreen: FC<TodoListScreenProps> = function TodoListScreen({
  navigation,
  route: {
    params: { listId },
  },
}) {
  const { list, todos, addTodo, removeTodo, setTodoCompleted } = useList(listId)
  const [newTodo, setNewTodo] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const handleAddTodo = useCallback(async () => {
    const { error } = await addTodo(newTodo)
    if (error) {
      setError(error)
    }
  }, [newTodo])

  const handleRemoveTodo = useCallback(
    async (id: string) => {
      const { error } = await removeTodo(id)
      if (error) {
        setError(error)
      }
    },
    [removeTodo, setError],
  )

  const renderItem = useCallback(
    ({ item }: { item: TodoRecord }) => {
      return (
        <ListItem
          containerStyle={$listItemContainer}
          textStyle={[$listItemText, item.completed && $strikeThrough]}
          text={`${item.description}`}
          RightComponent={
            <Pressable style={$deleteIcon} onPress={() => handleRemoveTodo(item.id)}>
              <Icon icon={"x"} />
            </Pressable>
          }
          onPress={() => setTodoCompleted(item.id, !item.completed)}
        />
      )
    },
    [handleRemoveTodo],
  )

  return (
    <Screen style={$root} preset="fixed">
      <SafeAreaView style={$header} edges={["top"]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon icon={"back"} size={44}></Icon>
        </Pressable>
        <Text style={$listName} preset={"heading"} text={list?.name} />
      </SafeAreaView>
      <View style={$addTodoContainer}>
        <Text preset={"subheading"}>Add a list</Text>
        <View style={$form}>
          <TextField
            placeholder="New todo..."
            containerStyle={$textField}
            inputWrapperStyle={$textInput}
            onChangeText={setNewTodo}
            value={newTodo}
          />
          <Button text="ADD" style={$button} onPress={handleAddTodo} />
        </View>
        {error && <Text style={$error}>{error}</Text>}
      </View>
      <View style={$container}>
        <FlatList
          data={todos}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={$separator} />}
          ListEmptyComponent={<Text style={$emptyList}>List is Empty</Text>}
        />
      </View>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
const $listItemContainer: ViewStyle = {
  alignItems: "center",
}

const $strikeThrough: TextStyle = { textDecorationLine: "line-through" }

const $form: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}

const $separator: ViewStyle = { height: 1, backgroundColor: colors.border }
const $emptyList: TextStyle = {
  color: colors.textDim,
  opacity: 0.5,
  padding: spacing.lg,
  fontSize: 24,
}

const $textField: ViewStyle = {
  flex: 1,
}

const $textInput: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
}

const $button: ViewStyle = {
  marginHorizontal: spacing.xs,
  padding: 0,
  paddingHorizontal: spacing.xs,
  paddingVertical: 0,
}

const $addTodoContainer: ViewStyle = {
  padding: spacing.md,
  backgroundColor: colors.palette.neutral300,
}
const $header: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.secondary200,
  paddingBottom: spacing.md,
}

const $listName: TextStyle = {
  marginLeft: spacing.sm,
  flex: 1,
}

const $error: TextStyle = {
  color: colors.error,
  marginTop: spacing.sm,
}

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $listItemText: TextStyle = {
  height: 44,
  verticalAlign: "middle",
}

const $deleteIcon: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 44,
  marginVertical: spacing.xxs,
}
