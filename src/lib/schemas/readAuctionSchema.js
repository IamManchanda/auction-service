export default {
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["OPEN", "CLOSED"],
          default: "OPEN",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};
