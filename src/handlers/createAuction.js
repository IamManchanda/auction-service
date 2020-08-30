import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  const auction = {
    id: uuidv4(),
    title,
    status: "Open",
    created_at: now.toISOString(),
  };
  await dynamoDB
    .put({
      TableName: "AuctionsTable",
      Item: auction,
    })
    .promise();
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;
