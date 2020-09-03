import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export default async (auction) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id: auction.id,
    },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  await dynamodb.update(params).promise();

  const { title, seller, highest_bid } = auction;
  const { amount, bidder } = highest_bid;

  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          recipient: seller,
          subject: "No bids on your auction item :(",
          body: `Oh no! Your item "${title}" didn't get any bids. Better luck next time!`,
        }),
      })
      .promise();
    return;
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        recipient: seller,
        subject: "Your item has been sold!",
        body: `Wohoo! Your item "${title}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        recipient: bidder,
        subject: "You won an auction!",
        body: `What a Great Deal! You got yourself a "${title}" for $${amount}.`,
      }),
    })
    .promise();

  return Promise.all([notifySeller, notifyBidder]);
};
