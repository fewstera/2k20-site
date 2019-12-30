import AWS from 'aws-sdk'

type MessageServiceOptions = {
  dynamodbDocClient: AWS.DynamoDB.DocumentClient,
  messagesTable: string
}

export class MessageService {
  private messagesTable: string
  private dynamodbDocClient: AWS.DynamoDB.DocumentClient

  constructor({ dynamodbDocClient, messagesTable }: MessageServiceOptions) {
    this.messagesTable = messagesTable
    this.dynamodbDocClient = dynamodbDocClient

  }
  async addMessage({ from, message } : { from: string, message: string }) {
    await this.dynamodbDocClient.put({
      TableName: this.messagesTable,
      Item: {
        isPurged: 'false',
        timestamp: new Date().getTime(),
        from,
        message,
      }
    }).promise()
  }

  async getMessages({ since = 0 } : { since: number }) {
    const result = await this.dynamodbDocClient.query({
      TableName: this.messagesTable,
      KeyConditionExpression: 'isPurged = :isPurged AND #timestamp > :since',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
        '#from': 'from'
      },
      ExpressionAttributeValues: {
        ':isPurged': 'false',
        ':since': since
      },
      ProjectionExpression: '#timestamp,#from,message'
    }).promise()

    return result.Items
  }
}
