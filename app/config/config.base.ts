export interface ConfigBaseProps {
  persistNavigation: "always" | "dev" | "prod" | "never"
  catchErrors: "always" | "dev" | "prod" | "never"
  exitRoutes: string[]
  supabaseUrl: string
  supabaseAnonKey: string
  powersyncUrl: string
}

export type PersistNavigationConfig = ConfigBaseProps["persistNavigation"]

const BaseConfig: ConfigBaseProps = {
  // This feature is particularly useful in development mode, but
  // can be used in production as well if you prefer.
  persistNavigation: "dev",

  /**
   * Only enable if we're catching errors in the right environment
   */
  catchErrors: "always",

  /**
   * This is a list of all the route names that will exit the app if the back button
   * is pressed while in that screen. Only affects Android.
   */
  exitRoutes: ["Welcome"],
  supabaseUrl: "https://iajynenlwfqpjvospgif.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhanluZW5sd2ZxcGp2b3NwZ2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NTk0NjgsImV4cCI6MjAyNjQzNTQ2OH0.D9GR_fE49Ha0FGParNToBWZ779Pk8J42Tl9yEnoapEs",
  powersyncUrl: "https://65f9a5e7cf63351096476faf.powersync.journeyapps.com",
}

export default BaseConfig
