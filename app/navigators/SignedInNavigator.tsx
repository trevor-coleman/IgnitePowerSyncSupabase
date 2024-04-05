import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList } from "app/navigators/AppNavigator"
import * as Screens from "app/screens"
import { colors } from "app/theme"
import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

export type SignedInNavigatorParamList = {
  Welcome: undefined
  TodoList: { listId: string }
}

const Stack = createNativeStackNavigator<SignedInNavigatorParamList>()

export type SignedInNavigatorProp<T extends keyof SignedInNavigatorParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SignedInNavigatorParamList, T>,
    NativeStackScreenProps<AppStackParamList>
  >

export const SignedInNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Screen name="TodoList" component={Screens.TodoListScreen} />
    </Stack.Navigator>
  )
}
