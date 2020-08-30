import AWS from "aws-sdk";
import createError from "http-errors";

import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const readAuctions = async (event, context) => {
  let auctions;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = commonMiddleware(readAuctions);
