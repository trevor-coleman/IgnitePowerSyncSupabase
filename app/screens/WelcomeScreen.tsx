import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Lists, SignOutButton } from "app/components"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { SignedInNavigatorParamList } from "../navigators"
import { colors } from "../theme"

interface WelcomeScreenProps
  extends NativeStackScreenProps<SignedInNavigatorParamList, "Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  return (
    <SafeAreaView style={$container}>
      <Lists />
      <SignOutButton />
    </SafeAreaView>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral300,
  display: "flex",
  justifyContent: "flex-start",
  height: "100%",
  flexDirection: "column",
}
