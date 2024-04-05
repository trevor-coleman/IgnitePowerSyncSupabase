import { SupabaseClient } from "@supabase/supabase-js"
import { useAuth } from "app/services/database/use-auth"
import React, { PropsWithChildren, useEffect } from "react"
import {
  AbstractPowerSyncDatabase,
  PowerSyncContext,
  RNQSPowerSyncDatabaseOpenFactory,
} from "@journeyapps/powersync-sdk-react-native"
import { supabase, supabaseConnector } from "./supabase" // Adjust the path as needed
import { AppSchema } from "./schema" // Adjust the path as needed
import { logger } from "app/services/logger"

const dbLog = logger.extend("database:Database")
const providerLog = logger.extend("database:DatabaseProvider")

export class Database {
  // We expose the PowerSync and Supabase instances for easy access elsewhere in the app
  powersync: AbstractPowerSyncDatabase
  supabase: SupabaseClient = supabase

  /**
   * Initialize the Database class with a new PowerSync instance
   */
  constructor() {
    const factory = new RNQSPowerSyncDatabaseOpenFactory({
      schema: AppSchema,
      dbFilename: "sqlite.db",
    })
    this.powersync = factory.getInstance()
  }

  /**
   * Initialize the PowerSync instance and connect it to the Supabase backend.
   * This will call `fetchCredentials` on the Supabase connector to get the session token.
   * So if your database requires authentication, the user will need to be signed in before this is
   * called.
   */
  async init() {
    dbLog.info("Initializing Database...")
    dbLog.debug("  Initializing Powersync...")
    await this.powersync.init()
    dbLog.debug("  Connecting Powersync to Supabase...")
    await this.powersync.connect(supabaseConnector)
    dbLog.info("Powersync connected.")
  }

  async disconnect() {
    dbLog.info("Disconnecting Powersync...")
    await this.powersync.disconnectAndClear()
    dbLog.info("Powersync disconnected.")
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
  const { user } = useAuth()
  useEffect(() => {
    if (user) {
      providerLog.info(`(useEffect) ${user.email} signed in, initializing Database()`)
      database
        .init()
        .then(() => providerLog.debug("...initialized"))
        .catch(console.error)
    } else {
      providerLog.info("(useEffect) User signed out, disconnecting Powersync")
      if (database.powersync.connected) {
        try {
          ;(async () => {
            await database.disconnect()
            providerLog.info("...disconnected")
          })()
        } catch (error) {
          providerLog.error(error)
        }
      } else {
        providerLog.debug("   ...already disconnected, skipping disconnect")
      }
    }
  }, [user, database])
  return (
    <DatabaseContext.Provider value={database}>
      <PowerSyncContext.Provider value={database.powersync}>{children}</PowerSyncContext.Provider>
    </DatabaseContext.Provider>
  )
}
