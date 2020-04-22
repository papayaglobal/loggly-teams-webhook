# Loggly - MS Teams Webhhok
AWS lambda function with [Claudia.js](https://claudiajs.com) that sets a webhook used to translate loggly alerts to MS teams messages and send them to an MS teams webhook.

## How to use

1. [Create a webhook in MS teams](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using#setting-up-a-custom-incoming-webhook)
2. Clone the repo and run `npm i`
3. Create the `TEAMS_WEBHOOK_URL` environment variable with the webhhok URL `export  TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/replace-with-real-webhook`
4. Run `npm create`
5. Use the webhook URL to create an HTTP POST [alert endpoint](https://www.loggly.com/docs/alert-endpoints/) in loggly. you should append `/loggly` to the HTTP endpoint for example: `https://1234678.execute-api.us-west-1.amazonaws.com/latest/loggly`.