import AWS from "aws-sdk";
import createError from "http-errors";

import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const readAuctionById = async (id) => {
  let auction;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id,
    },
  };

  try {
    const result = await dynamodb.get(params).promise();
    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found`);
  }

  return auction;
};

const readAuction = async (event, context) => {
  const { id } = event.pathParameters;
  const auction = await readAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(readAuction);
