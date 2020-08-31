import createError from "http-errors";

import readEndedAuctions from "../lib/readEndedAuctions";
import closeAuction from "../lib/closeAuction";

const processAuctions = async (event, context) => {
  try {
    const auctionsToClose = await readEndedAuctions();
    const auctionsToClosePromises = auctionsToClose.map((auction) =>
      closeAuction(auction),
    );
    await Promise.all(auctionsToClosePromises);
    return {
      closed: auctionsToClosePromises.length,
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

export const handler = processAuctions;
