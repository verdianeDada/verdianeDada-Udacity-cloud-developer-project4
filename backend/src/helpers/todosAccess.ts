import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
// import { constants } from 'http2';
const AWSXRay = require('aws-xray-sdk') 

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
// const createdAtIndex = process.env.TODOS_CREATED_AT_INDEX

// const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient()

const index = process.env.TODOS_CREATED_AT_INDEX


 export async function getAllTodos(userId:string): Promise<TodoItem[]> {

  const params = {
    TableName: todosTable,
    // IndexName: createdAtIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }
   const result = await docClient.query(params).promise()
     const todos = result.Items
     return todos as TodoItem[]
  }
 export async function getTodoById(todoId:string): Promise<TodoItem> {

  const params = {
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }
   const result = await docClient.query(params).promise()
   const items = result.Items
    if (items.length !== 0)
      return items[0] as TodoItem
    else
    return null
  }

 export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: todosTable,
      Item: todo
    }
    await docClient.put(params, function(err, data) {
      if (err) {
        console.log("Error", err)
      } else {
        console.log("Success", data)
      }
    }).promise()
    return todo
    
  }
  
  export async function updateTodo( todo: TodoItem): Promise<TodoItem>{

    const params = {
      TableName: todosTable,
      Key: {
        'todoId': todo.todoId,
        'userId': todo.userId,
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': todo.attachmentUrl
      }
  }
 
const updatedTodo = await docClient.update(params, function(err, data) {
    if (err) {
      console.log("Error", err)
    } else {
      console.log("Success", data)
    }
  }).promise()
  
  return updatedTodo.Attributes as TodoItem
}
  export async function deleteTodo( todoId: string, userId: string): Promise<string>{

    const params = {
      TableName: todosTable,
      Key: {
        'todoId': todoId,
        'userId': userId,
      }
    }
 
 const deletedTodo = await docClient.delete(params, function(err, data) {
    if (err) {
      console.log("Error", err)
    } else {
      console.log("Success", data)
    }
  }).promise()

  console.log(deletedTodo)  
  return "Todo successfully deleted"
}

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }