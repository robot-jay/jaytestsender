import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  output,
} from "@azure/functions";

const eventQueue = output.serviceBusQueue({
  queueName: "jaytest-events",
  connection: "ServiceBusConnection",
});

app.http("sendTestEvent", {
  methods: ["GET"],
  authLevel: "anonymous",
  extraOutputs: [eventQueue],

  handler: async (
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> => {
    const event = {
      eventType: "JayTestRequested",
      occurredAtUtc: new Date().toISOString(),
      source: "jaytestsender",
      value: 1,
    };

    context.extraOutputs.set(eventQueue, event);

    return {
      status: 202,
      jsonBody: {
        message: "Event published",
        event,
      },
    };
  },
});