import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default async ({ id }) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id,
    },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamodb.update(params).promise();
  return result;
};