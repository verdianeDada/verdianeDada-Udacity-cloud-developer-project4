import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { updateTodo } from '../../businessLogic/todos'
import { getUploadUrl } from '../../helpers/attachmentUtils'
import { getTodoById } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
const s3BucketName = process.env.S3_BUCKET_NAME

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId)
    todo.attachmentUrl = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    await updateTodo(todo)
    // const uploadedUrl = await  createAttachmentPresignedUrl(todoId)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const URL = await getUploadUrl(todoId)
    return {
      statusCode: 202,
      body: JSON.stringify({
        uploadedUrl: URL
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
