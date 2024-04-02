import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Lists } from "app/components"
import { DatabaseProvider } from "app/services/database/database"
import { useAuth } from "app/services/database/use-auth"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { SignedInNavigatorParamList } from "../navigators"
import { colors, spacing } from "../theme"

interface WelcomeScreenProps
  extends NativeStackScreenProps<SignedInNavigatorParamList, "Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const { signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <DatabaseProvider>
      <SafeAreaView style={$container}>
        <Lists />
        <View style={$signOut}>
          <Button text="Sign Out" onPress={handleSignOut} />
        </View>
      </SafeAreaView>
    </DatabaseProvider>
  )
})

const $signOut: ViewStyle = {
  padding: spacing.md,
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral300,
  display: "flex",
  justifyContent: "flex-start",
  height: "100%",
  flexDirection: "column",
}
