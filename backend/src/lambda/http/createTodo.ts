import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
// import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { createTodo } from '../../helpers/todosAcess'
// import { buildTodo } from '../../helpers/todos';
// import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const newTodo: CreateTodoRequest = JSON.parse(event.body)
//     // TODO: Implement creating a new TODO item
//     const todo = buildTodo(newTodo, event)
//     const todoCreated = await createTodo(todo);
    
//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         todoCreated
//       })
//     }
    
//   }
// )

// handler.use(
//   cors({
//     credentials: true
//   })
// )

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const createdTodo = await createTodo(newTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      createdTodo
    })
  }
})
