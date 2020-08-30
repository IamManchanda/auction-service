import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event, context) => {
  const { title } = event.body;
  const now = new Date();
  const auction = {
    id: uuidv4(),
    title,
    status: "Open",
    created_at: now.toISOString(),
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
