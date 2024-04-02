import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Button, Text, TextField } from "app/components"
import { AppStackParamList, AuthNavigatorParamList } from "app/navigators"
import { useAuth } from "app/services/database/use-auth"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing } from "../theme"

interface AuthScreenProps
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthNavigatorParamList, "Auth">,
    NativeStackScreenProps<AppStackParamList>
  > {}

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { signUp, signIn, loading, error, user } = useAuth()
  const [email, setEmail] = useState("trevor@infinitered.com")
  const [password, setPassword] = useState("password")

  const handleSignIn = async () => {
    signIn(email, password)
  }

  const handleSignUp = async () => {
    signUp(email, password)
  }

  useEffect(() => {
    if (user) {
      navigation.navigate("SignedInNavigator", { screen: "Welcome" })
    }
  }, [user])

  return (
    <SafeAreaView style={$container}>
      <KeyboardAvoidingView behavior={"padding"} style={$container}>
        <Text preset={"heading"}>Sign in or Create Account</Text>
        <TextField
          inputWrapperStyle={$inputWrapper}
          containerStyle={$inputContainer}
          label={"Email"}
          value={email}
          inputMode={"email"}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize={"none"}
        />
        <TextField
          containerStyle={$inputContainer}
          inputWrapperStyle={$inputWrapper}
          label={"Password"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={$buttonContainer}>
          <Button
            disabled={loading}
            text={"Sign In"}
            onPress={handleSignIn}
            style={$button}
            preset={"reversed"}
          />

          <Button
            disabled={loading}
            text={"Register New Account"}
            onPress={handleSignUp}
            style={$button}
          />
        </View>
        {error ? <Text style={$error} text={error} /> : null}
      </KeyboardAvoidingView>
      <Modal transparent visible={loading}>
        <View style={$modalBackground}>
          <ActivityIndicator size="large" color={colors.palette.primary500} />
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $inputContainer: TextStyle = {
  marginTop: spacing.md,
}

const $inputWrapper: TextStyle = {
  backgroundColor: colors.palette.neutral100,
}
const $modalBackground: ViewStyle = {
  alignItems: "center",
  backgroundColor: "#00000040",
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-around",
}

const $error: TextStyle = {
  color: colors.error,
  marginVertical: spacing.md,
  textAlign: "center",
  width: "100%",
  fontSize: 20,
}

const $buttonContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginVertical: spacing.md,
}

const $button: ViewStyle = {
  marginTop: spacing.xs,
}
