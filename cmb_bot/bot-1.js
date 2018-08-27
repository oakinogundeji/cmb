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
  BLOG_PAGE = 'https://dejiolowe.com/2018/07/26/three-reasons-why-current-accounts-are-for-dinosaurs/',
  TOPIC_SELECTOR = '#post-2283 > h2',
  CONTENT_SELECTOR = '#post-2283 > div',
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

let
  recipient,
  extraEmails,
  TOPIC_INFO;

// GET DATA FROM BLOG_PAGE
async function getBlogContent() {
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
  // navigate to BLOG_PAGE
  await page.goto(BLOG_PAGE, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // ensure TOPIC_SELECTOR available
  await page.waitForSelector(TOPIC_SELECTOR, {timeout: 30000});
  // extract topic from TOPIC_SELECTOR
  TOPIC_INFO = await page.$eval(TOPIC_SELECTOR, target => target.innerText);
  await page.waitFor(2*1000);
  // ensure CONTENT_SELECTOR available
  await page.waitForSelector(CONTENT_SELECTOR, {timeout: 30000});
  // get text content
  const TXT = await page.$eval(CONTENT_SELECTOR, target => {
    // declare variables
    let
      textArray = [],
      blogContent;
    // isolate all content paragraphs
    const PARAS = target.querySelectorAll('p');
    console.log('PARAS');
    console.log(PARAS);
    // filter PARAS for desired content
    PARAS.forEach(para => {
      if(!para.className) {
        let TXT = para.textContent;
        TXT += ' \n \n';
        textArray.push(TXT);
      }
    });
    console.log('textArray');
    console.log(textArray);
    // set blogContent to value of generated string
    blogContent = textArray.join(' ')
    console.log(`blogContent: ${blogContent}`);
    // return blogContent
    return blogContent;
  });
  console.log(`TXT: ${TXT}`);
  await page.waitFor(10*1000);
  await page.close();
  await browser.close();
  return TXT;
}
// console.log(`process.argv.length: ${process.argv.length}`);

if(process.argv.length > 2) {
  // set email recipient
  recipient = process.argv[2];
  // set copied recipients
  if(process.argv.length > 3) {
    extraEmails = process.argv.slice(3).join(', ');
  }
  console.log(`recipient: ${recipient}`);
  console.log(`extra emails: ${extraEmails}`);
}
// send GMAIL
async function sendDataViaGmail(data) {
  //console.log(`data:`);
  //console.log(data);
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
  // click on TOPIC_SELECTOR
  await page.click(GMAIL_SELECTOR);
  await page.waitFor(2*1000);
  // ensure EMAIL_SELECTOR available
  await page.waitForSelector(EMAIL_SELECTOR, {timeout: 30000});
  // type email address
  await page.type(EMAIL_SELECTOR, 'teliosdevservices@gmail.com', {delay: 100});
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
  await page.type(TO_SELECTOR, recipient, {delay: 100});
  await page.waitFor(2*1000);
  if(!!extraEmails) {
    // ensure CC_SELECTOR is available and fill it
    await page.waitForSelector(CC_SELECTOR, {timeout: 30000});
    await page.type(CC_SELECTOR, extraEmails, {delay: 100});
    await page.waitFor(2*1000);
  }
  // ensure SUBJECT_SELCTOR is available and fill it
  await page.waitForSelector(SUBJECT_SELCTOR, {timeout: 30000});
  await page.type(SUBJECT_SELCTOR, 'End of Telios Services Bot demo.', {delay: 100});
  await page.waitFor(2*1000);
  // ensure MSG_BODY_SELECTOR is available and fill it
  await page.waitForSelector(MSG_BODY_SELECTOR, {timeout: 30000});
  await page.type(MSG_BODY_SELECTOR, `Hi,

    The Telios bot retrieved information on ${TOPIC_INFO} from the blog of Adédèjì Olówè. This blog article can be found at ${BLOG_PAGE}. The content of the article follows:

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

getBlogContent()
  .then(data => sendDataViaGmail(data))
  .catch(err => console.log(err));
