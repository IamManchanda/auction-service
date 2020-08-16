const createAuction = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      event,
      context,
    }),
  };
};

export const handler = createAuction;
