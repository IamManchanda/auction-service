import readEndedAuctions from "../lib/readEndedAuctions";

const processAuctions = async (event, context) => {
  const auctionsToClose = await readEndedAuctions();
  console.log(auctionsToClose);
};

export const handler = processAuctions;
