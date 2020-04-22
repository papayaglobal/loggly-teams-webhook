const ApiBuilder = require("claudia-api-builder");
const get = require("lodash.get");

const api = new ApiBuilder();
module.exports = api;

const createTeamsMsg = (body) => {
  const summary = get(body, "alert_name");
  const logText = get(body, "recent_hits[0]");
  const log = !!logText ? JSON.parse(logText) : {};
  const title = get(log, "msg") | "";
  const logLevel = get(log, "level") | "log";
  const searchLink = get(body, "search_link");
  const snoozeLink = get(body,"snooze_link");

  return `
  {
    "contentType": "application/vnd.microsoft.teams.card.o365connector",
    "content": {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "summary": "${summary}",
      "sections": [
          {
              "activityTitle": "${title}",
              "activitySubtitle": "${logLevel}",
              "activityText": "${JSON.stringify(log, null, 2)}",
              "activityImage": "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg"
          }
      ],
      "potentialAction": [
          {
              "@context": "http://schema.org",
              "@type": "OpenUri",
              "name": "View in loggly",
              "target": [
                  "${searchLink}"
              ]
          },
          {
            "@context": "http://schema.org",
            "@type": "HttpPOST",
            "name": "Snooze",
            "target": [
                "${snoozeLink}"
            ]
        }
      ]
    }
  }
  `;
};

api.post("/loggly", function (request) {
  const msg = createTeamsMsg(request.body);
});

api.addPostDeployConfig("webhook URL", "Enter a message:", "teams-webhook-url");
