import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";

import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title } = event.body;
  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(startTime.getHours() + 1);

  const auction = {
    id: uuidv4(),
    title,
    status: "OPEN",
    created_at: startTime.toISOString(),
    ending_at: endTime.toISOString(),
    highest_bid: {
      amount: 0,
    },
  };
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(createAuction);
