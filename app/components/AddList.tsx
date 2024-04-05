import { Button, Text, TextField } from "app/components"
import { useLists } from "app/services/database/use-lists"
import { colors, spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import React from "react"
import { Keyboard, TextStyle, View, ViewStyle } from "react-native"

/**
 * Display a form to add a new list
 */
export const AddList = observer(function AddList() {
  const [newListName, setNewListName] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const { createList } = useLists()

  const handleAddList = React.useCallback(async () => {
    if (!newListName) {
      Keyboard.dismiss()
      return
    }
    try {
      await createList(newListName)
      setNewListName("")
    } catch (e: any) {
      setError(`Failed to create list: ${e?.message ?? "unknown error"}`)
    }
    Keyboard.dismiss()
  }, [createList, newListName])

  return (
    <View style={$container}>
      <Text preset={"subheading"}>Add a List</Text>
      <View style={$form}>
        <TextField
          placeholder="Enter a list name"
          containerStyle={$textField}
          inputWrapperStyle={$textInput}
          onChangeText={setNewListName}
          value={newListName}
          onSubmitEditing={handleAddList}
        />
        <Button text="Add List" style={$button} onPress={handleAddList} />
      </View>
      {error && <Text style={$error}>{error}</Text>}
    </View>
  )
})

const $container: ViewStyle = {
  padding: spacing.md,
  backgroundColor: colors.palette.neutral200,
}

const $form: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
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
  minHeight: 44,
}

const $error: TextStyle = {
  color: colors.error,
  marginTop: spacing.sm,
}
