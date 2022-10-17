import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate} from '../models/TodoUpdate'
import { createTodo as createTodoAccess } from '../helpers/todosAccess'
import { getAllTodos as getAllTodosAccess } from '../helpers/todosAccess'
import { updateTodo as updateTodoAccess } from '../helpers/todosAccess'
import { deleteTodo as deleteTodoAccess } from '../helpers/todosAccess'
import { getTodoById as getTodoByIdAccess } from '../helpers/todosAccess'
// import { createAttachmentPresignedUrl as generateUrlAccess } from '../helpers/attachmentUtils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId as getUserId } from '../auth/utils'

// const todoAccess = new TodoAccess()

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  
    const userId = getUserId(jwtToken)
    return await getAllTodosAccess(userId) 
    
}
export async function getTodoById(todoId: string): Promise<TodoItem> {
  
    return await getTodoByIdAccess(todoId) 
    
}
export async function createTodo(todo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    const userId = getUserId(jwtToken)
  
    return await createTodoAccess({
      todoId: itemId,
      createdAt: new Date().toISOString(),
      userId: userId,
      done: false,
      attachmentUrl: '',
      ...todo
  }) as TodoItem
}

export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  return await updateTodoAccess(todo)
    
}
export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
  
  const userId = getUserId(jwtToken)
  return await deleteTodoAccess(todoId, userId)
    
}
// export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
  
  // return await generateUrlAccess(todoId)
    
// }
