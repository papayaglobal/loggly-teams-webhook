import ApiBuilder from 'claudia-api-builder';
import get from 'lodash.get';

const body = { alert_name: 'werwer'};

const summary = get(body, 'alert_name');


console.log({summary});