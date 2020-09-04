import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import jsonErrorHandler from "middy-middleware-json-error-handler";
import httpCors from "@middy/http-cors";

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(),
    httpEventNormalizer(),
    jsonErrorHandler(),
    httpCors(),
  ]);
