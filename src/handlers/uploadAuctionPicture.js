import AWS from "aws-sdk";
import middy from "@middy/core";
import jsonErrorHandler from "middy-middleware-json-error-handler";
import createError from "http-errors";

import { readAuctionById } from "./readAuction";
import uploadPictureToS3 from "../lib/uploadPictureToS3";
import setAuctionPictureUrl from "../lib/setAuctionPictureUrl";

const uploadAuctionPicture = async (event, context) => {
  const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;

  // Validate Auction Ownership
  if (auction.seller !== email) {
    throw new createError.Forbidden(`You are not the seller of this auction`);
  }

  const auction = await readAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(`${auction.id}.jpg`, buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = middy(uploadAuctionPicture).use(jsonErrorHandler());
