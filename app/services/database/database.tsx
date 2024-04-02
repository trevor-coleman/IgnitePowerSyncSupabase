import { SupabaseClient } from "@supabase/supabase-js"
import React, { PropsWithChildren, useEffect } from "react"
import {
  AbstractPowerSyncDatabase,
  PowerSyncContext,
  RNQSPowerSyncDatabaseOpenFactory,
} from "@journeyapps/powersync-sdk-react-native"
import { supabase, supabaseConnector } from "./supabase" // Adjust the path as needed
import { AppSchema } from "./schema" // Adjust the path as needed

export class Database {
  // We expose the PowerSync and Supabase instances for easy access elsewhere in the app
  powersync: AbstractPowerSyncDatabase
  supabase: SupabaseClient

  /**
   * Initialize the Database class with a new PowerSync instance
   */
  constructor() {
    const factory = new RNQSPowerSyncDatabaseOpenFactory({
      schema: AppSchema,
      dbFilename: "sqlite.db",
    })
    this.powersync = factory.getInstance()
    this.supabase = supabase
  }

  /**
   * Initialize the PowerSync instance and connect it to the Supabase backend.
   * This will call `fetchCredentials` on the Supabase connector to get the session token.
   * So if your database requires authentication, the user will need to be signed in before this is called.
   */
  async init() {
    await this.powersync.init()
    // Connect the PowerSync instance to the Supabase backend through the connector
    await this.powersync.connect(supabaseConnector)
  }
}

const database = new Database()

// A context to provide our singleton to the rest of the app
const DatabaseContext = React.createContext<Database | null>(null)

export const useDatabase = () => {
  const context: Database | null = React.useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider")
  }
  return context
}

// Finally, we create a provider component that initializes the database and provides it to the app
export function DatabaseProvider<T>({ children }: PropsWithChildren<T>) {
  useEffect(() => {
    database.init().catch(console.error)
  }, [])

  return (
    <DatabaseContext.Provider value={database}>
      <PowerSyncContext.Provider value={database.powersync}>{children}</PowerSyncContext.Provider>
    </DatabaseContext.Provider>
  )
}
