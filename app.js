const ApiBuilder = require("claudia-api-builder");
const get = require("lodash.get");
const https = require("https");
const URL = require("url").URL;
const jsesc = require("jsesc");

const api = new ApiBuilder();
module.exports = api;

const LOG_LEVEL_IMAGES = {
  error:
    "https://github.com/papayaglobal/loggly-teams-webhook/raw/master/images/error.png",
  warn:
    "https://github.com/papayaglobal/loggly-teams-webhook/raw/master/images/warn.png",
  info:
    "https://github.com/papayaglobal/loggly-teams-webhook/raw/master/images/info.png",
  log:
    "https://github.com/papayaglobal/loggly-teams-webhook/raw/master/images/question.png",
};
const stringifyEscaped = (data) => {
  return jsesc(JSON.stringify(data, null, 2), {
    quotes: "double",
  }).replace(/\\[nr]/g, "\\n\\n");
};

const createTeamsMsg = (body) => {
  const summary = get(body, "alert_name");
  const logText = get(body, "recent_hits[0]");
  const log = !!logText ? JSON.parse(logText) : {};
  const title = get(log, "msg") || "";
  const logLevel = get(log, "level") || "log";
  const searchLink = get(body, "search_link");
  const snoozeLink = get(body, "snooze_link");
  const image = LOG_LEVEL_IMAGES[logLevel] || LOG_LEVEL_IMAGES.log;

  return `
  {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "summary": "${summary}",
    "sections": [
      {
        "activityTitle": "${summary}",
        "activitySubtitle": "${stringifyEscaped(title)}",
        "activityImage": "${image}",
        "text": "${stringifyEscaped(log)}"
      }
    ],
    "potentialAction": [
      {
        "@type": "OpenUri",
        "name": "View in loggly",
        "targets": [
          {
            "os": "default",
            "uri": "${searchLink}"
          }
        ]
      },
      {
        "@type": "HttpPOST",
        "name": "Snooze",
        "targets": [
          {
            "os": "default",
            "uri": "${snoozeLink}"
          }
        ]
      }
    ]
  }
  `;
};

const sendMsg = (msg, webhookURL) => {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookURL);
    const post_options = {
      host: url.host,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(msg),
      },
    };

    const post = https.request(post_options, (res) => {
      res.on("data", (d) => {
        console.log(d.toString());
        resolve();
      });
    });
    post.on("error", (e) => {
      reject(e);
    });
    post.write(msg);
    post.end(() => {});
  });
};

api.post("/loggly", function (request) {
  return sendMsg(createTeamsMsg(request.body), request.env["WEBHOOK_URL"]);
});

api.addPostDeployConfig(
  "WEBHOOK_URL",
  "Enter the webhook URL:",
  "teams-webhook-url"
);
