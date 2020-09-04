import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";

import commonMiddleware from "../lib/commonMiddleware";
import placeBidSchema from "../lib/schemas/placeBidSchema";
import { readAuctionById } from "./readAuction";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;
  const auction = await readAuctionById(id);

  // Bid Identity Validation
  if (email === auction.seller) {
    throw new createError.Forbidden("You can not bid on your own auctions");
  }

  // Avoid Double Bidding
  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden("You are already the highest bidder");
  }

  // Auction Status Validation
  if (auction.status === "CLOSED") {
    throw new createError.Forbidden("You cannot bid on closed auctions.");
  }

  // Bid Amount Validation
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`,
    );
  }

  let updatedAuction;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id,
    },
    UpdateExpression:
      "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder": email,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid).use(
  validator({
    inputSchema: placeBidSchema,
    useDefaults: true,
  }),
);
