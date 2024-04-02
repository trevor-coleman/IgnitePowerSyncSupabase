import { usePowerSyncWatchedQuery } from "@journeyapps/powersync-sdk-react-native"
import { useAuth } from "app/services/database/use-auth"
import { useCallback } from "react"
import { useDatabase } from "app/services/database/database"
import { LIST_TABLE, ListRecord, TODO_TABLE } from "app/services/database/schema"
import { randomUUID } from "expo-crypto"

export type ListItemRecord = ListRecord & { total_tasks: number; completed_tasks: number }

export const useLists = () => {
  const { user } = useAuth()
  const { powersync } = useDatabase()

  // List fetching logic here. You can modify it as per your needs.
  const lists = usePowerSyncWatchedQuery<ListItemRecord>(`
      SELECT ${LIST_TABLE}.*,
             COUNT(${TODO_TABLE}.id)                                         AS total_tasks,
             SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM ${LIST_TABLE}
               LEFT JOIN ${TODO_TABLE} ON ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
      GROUP BY ${LIST_TABLE}.id;
  `)

  const createList = useCallback(
    async (name: string) => {
      if (!user) {
        throw new Error("Can't add list -- user is undefined")
      }
      return powersync.execute(
        `
          INSERT INTO ${LIST_TABLE}
              (id, name, created_at, owner_id)
          VALUES (?, ?, ?, ?)`,
        [randomUUID(), name, new Date().toISOString(), user?.id],
      )
    },
    [user, powersync],
  )

  const deleteList = useCallback(
    async (id: string) => {
      console.log("Deleting list", id)
      return powersync.execute(
        `DELETE
                             FROM ${LIST_TABLE}
                             WHERE id = ?`,
        [id],
      )
    },
    [powersync],
  )

  return { lists, createList, deleteList }
}
