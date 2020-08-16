const createAuction = async (event, context) => {
  const { title } = JSON.parse(event.body);
  const status = "Open";
  const now = new Date();
  const createdAt = now.toISOString();
  const auction = { title, status, createdAt };
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = createAuction;
