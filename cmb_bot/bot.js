'use strict';
if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
//=============================================================================
/**
* dependencies
*/
//=============================================================================
const P = require('puppeteer');

// variables

const
  BLOOMBERG = 'https://www.bloomberg.com/research/stocks/private/person.asp?personId=560299433&privcapId=324778401&previousCapId=324778401&previousTitle=Coronation%20Merchant%20Bank',
  FULL_BACKGROUND_SELECTOR = '#columnLeft > div > div:nth-child(9) > div > a',
  CONTENT_DIV_SELECTOR = '#columnLeft > div > div:nth-child(9)',
  GOOGLE = 'https://www.google.com/',
  GMAIL_SELECTOR = '#gb_23 > span.gbts',
  EMAIL_SELECTOR = '#Email',
  MOVE_TO_PASSWORD_SELECTOR = '#next',
  PASSWORD_SELECTOR = '#Passwd',
  {GMAIL_PWD} = process.env,
  SIGN_IN_SELECTOR = '#signIn',
  //LATEST_GMAIL_UI_SELECTOR = '#maia-main > form > p > a',
  COMPOSE_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(1) > table.m > tbody > tr:nth-child(1) > td > b > a',
  TO_SELECTOR = '#to',
  CC_SELECTOR = '#cc',
  SUBJECT_SELCTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(4) > td:nth-child(2) > input',
  MSG_BODY_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(8) > td:nth-child(2) > textarea',
  SEND_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table:nth-child(6) > tbody > tr > td > input[type="submit"]:nth-child(1)';

let extraEmails;

// GET DATA FROM BLOOMBERG
async function getBloombergData() {
  // instantiate browser
  const browser = await P.launch({
    headless: false,
    timeout: 180000
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({width: 1366, height: 768});
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to BLOOMBERG
  await page.goto(BLOOMBERG, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // ensure FULL_BACKGROUND_SELECTOR available
  await page.waitForSelector(FULL_BACKGROUND_SELECTOR, {timeout: 30000});
  // click on FULL_BACKGROUND_SELECTOR
  await page.click(FULL_BACKGROUND_SELECTOR);
  await page.waitFor(2*1000);
  // ensure CONTENT_DIV_SELECTOR available
  await page.waitForSelector(CONTENT_DIV_SELECTOR, {timeout: 30000});
  // get text content
  const TXT = await page.$eval(CONTENT_DIV_SELECTOR, target => target.innerText);
  console.log(`TXT: ${TXT}`);
  // remove 'Collapse Detail' from TXT
  const OUTPUT = TXT.replace('Collapse Detail', '');
  console.log(`OUTPUT: ${OUTPUT}`);
  // return OUTPUT
  await page.waitFor(10*1000);
  await page.close();
  await browser.close();
  return OUTPUT;
}
console.log(`process.argv.length: ${process.argv.length}`);

if(process.argv.length > 2) {
  extraEmails = process.argv.slice(2).join(', ');
  console.log(`extra emails: ${extraEmails}`);
  console.log(`typeof(extraEmails): ${typeof(extraEmails)}`);
}
// send GMAIL
async function sendDataViaGmail(data) {
  console.log(`data:`);
  console.log(data);
  // instantiate browser
  const browser = await P.launch({
    headless: false,
    timeout: 180000
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({width: 1366, height: 768});
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to GOOGLE
  await page.goto(GOOGLE, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // ensure GMAIL_SELECTOR available
  await page.waitForSelector(GMAIL_SELECTOR, {timeout: 30000});
  // click on FULL_BACKGROUND_SELECTOR
  await page.click(GMAIL_SELECTOR);
  await page.waitFor(2*1000);
  // ensure EMAIL_SELECTOR available
  await page.waitForSelector(EMAIL_SELECTOR, {timeout: 30000});
  // type email address
  await page.type(EMAIL_SELECTOR, 'tss@tssdevs.com', {delay: 100});
  await page.waitFor(2*1000);
  // ensure MOVE_TO_PASSWORD_SELECTOR available and click on it
  await page.waitForSelector(MOVE_TO_PASSWORD_SELECTOR, {timeout: 30000});
  await page.click(MOVE_TO_PASSWORD_SELECTOR);
  // ensure PASSWORD_SELECTOR available
  await page.waitForSelector(PASSWORD_SELECTOR, {timeout: 30000});
  // type email address
  await page.type(PASSWORD_SELECTOR, GMAIL_PWD, {delay: 100});
  await page.waitFor(2*1000);
  // ensure SIGN_IN_SELECTOR available and click on it
  await page.waitForSelector(SIGN_IN_SELECTOR, {timeout: 30000});
  await page.click(SIGN_IN_SELECTOR);
  await page.waitFor(6*1000);
  // ensure COMPOSE_EMAIL_SELECTOR is available and click on it
  await page.waitForSelector(COMPOSE_EMAIL_SELECTOR, {timeout: 30000});
  await page.click(COMPOSE_EMAIL_SELECTOR);
  await page.waitFor(2*1000);
  // ensure TO_SELECTOR is available and fill it
  await page.waitForSelector(TO_SELECTOR, {timeout: 30000});
  await page.type(TO_SELECTOR, 'demilade@tssdevs.com', {delay: 100});
  await page.waitFor(2*1000);
  if(!!extraEmails) {
    // ensure CC_SELECTOR is available and fill it
    await page.waitForSelector(CC_SELECTOR, {timeout: 30000});
    await page.type(CC_SELECTOR, extraEmails, {delay: 100});
    await page.waitFor(2*1000);
  }
  // ensure SUBJECT_SELCTOR is available and fill it
  await page.waitForSelector(SUBJECT_SELCTOR, {timeout: 30000});
  await page.type(SUBJECT_SELCTOR, 'Background info', {delay: 100});
  await page.waitFor(2*1000);
  // ensure MSG_BODY_SELECTOR is available and fill it
  await page.waitForSelector(MSG_BODY_SELECTOR, {timeout: 30000});
  await page.type(MSG_BODY_SELECTOR, `Hi,

    Please find below the information you requested.

    ${data}`, {delay: 20});
  await page.waitFor(2*1000);
  // ensure SEND_EMAIL_SELECTOR and click it
  await page.waitForSelector(SEND_EMAIL_SELECTOR, {timeout: 30000});
  await page.click(SEND_EMAIL_SELECTOR);
  return setTimeout(async () => {
    await page.close();
    await browser.close();
    return process.exit(0);
  }, 5000);
}

getBloombergData()
  .then(data => sendDataViaGmail(data))
  .catch(err => console.log(err));
