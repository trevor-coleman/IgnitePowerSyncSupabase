import {
  usePowerSyncQuery,
  usePowerSyncWatchedQuery,
} from "@journeyapps/powersync-sdk-react-native"
import { useDatabase } from "app/services/database/database"
import { LIST_TABLE, ListRecord, TODO_TABLE, TodoRecord } from "app/services/database/schema"
import { useAuth } from "app/services/database/use-auth"
import { useCallback } from "react"
import { randomUUID } from "expo-crypto"

export function useList(listId: string) {
  const { user } = useAuth()
  const { powersync } = useDatabase()

  const listRecords = usePowerSyncQuery<ListRecord>(
    `
      SELECT *
      FROM ${LIST_TABLE}
      WHERE id = ?;
  `,
    [listId],
  )

  // we only expect one list record
  const list = listRecords[0]

  const todos = usePowerSyncWatchedQuery<TodoRecord>(
    `
      SELECT *
      FROM ${TODO_TABLE}
      WHERE list_id = ?;
  `,
    [listId],
  )

  const addTodo = useCallback(
    async (description: string): Promise<{ error: string | null }> => {
      if (!user) {
        throw new Error("Can't add todo -- user is undefined")
      }
      try {
        await powersync.execute(
          `INSERT INTO ${TODO_TABLE}
             (id, description, created_at, list_id, created_by, completed)
         VALUES (?, ?, ?, ?, ?, ?)`,
          [randomUUID(), description, new Date().toISOString(), listId, user?.id, 0],
        )

        return { error: null }
      } catch (error: any) {
        return { error: `Error adding todo: ${error?.message}` }
      }
    },
    [user, powersync, listId],
  )

  const removeTodo = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      try {
        await powersync.execute(
          `DELETE
                                FROM ${TODO_TABLE}
                                WHERE id = ?`,
          [id],
        )
        return { error: null }
      } catch (error: any) {
        console.error("Error removing todo", error)
        return { error: `Error removing todo: ${error?.message}` }
      }
    },
    [powersync],
  )

  const setTodoCompleted = useCallback(
    async (id: string, completed: boolean): Promise<{ error: string | null }> => {
      const completedAt = completed ? new Date().toISOString() : null
      const completedBy = completed ? user?.id : null

      try {
        await powersync.execute(
          `
          UPDATE ${TODO_TABLE}
          SET completed    = ?,
              completed_at = ?,
              completed_by = ?
          WHERE id = ?
      `,
          [completed, completedAt, completedBy, id],
        )

        return { error: null }
      } catch (error: any) {
        console.error("Error toggling todo", error)
        return { error: `Error toggling todo: ${error?.message}` }
      }
    },
    [powersync],
  )

  return { list, todos, addTodo, removeTodo, setTodoCompleted }
}
