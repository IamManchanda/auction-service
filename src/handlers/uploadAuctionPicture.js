import AWS from "aws-sdk";

const uploadAuctionPicture = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = uploadAuctionPicture;
