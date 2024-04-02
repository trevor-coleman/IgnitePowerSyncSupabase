import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList } from "app/navigators/AppNavigator"
import { colors } from "app/theme"
import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { AuthScreen } from "app/screens"

export type AuthNavigatorParamList = {
  Auth: undefined
}

export type AuthNavigatorScreenProps<T extends keyof AuthNavigatorParamList> = CompositeScreenProps<
  NativeStackScreenProps<AuthNavigatorParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>

const Stack = createNativeStackNavigator<AuthNavigatorParamList>()
export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  )
}
