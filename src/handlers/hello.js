const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World by Harry Manchanda" }),
  };
};

export const handler = hello;
