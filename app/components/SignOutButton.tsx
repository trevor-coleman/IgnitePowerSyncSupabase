import { Button } from "app/components/Button"
import { useAuth } from "app/services/database/use-auth"
import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { spacing } from "app/theme"
import { logger } from "app/services/logger"

const log = logger.extend("SignOutButton")

export interface SignOutButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const SignOutButton = observer(function SignOutButton(props: SignOutButtonProps) {
  const { style } = props
  const $styles = [$container, style]

  const { signOut } = useAuth()

  const handleSignOut = async () => {
    log.info("Signing out...")
    await signOut()
    log.info("Signed out.")
  }

  return (
    <View style={$styles}>
      <Button text="Sign Out" onPress={handleSignOut} />
    </View>
  )
})

const $container: ViewStyle = {
  padding: spacing.md,
}
