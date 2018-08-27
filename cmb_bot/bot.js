'use strict';
if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
//=============================================================================
/**
* dependencies
*/
//=============================================================================
const
  P = require('puppeteer'),
  Sentiment = require('sentiment'),
  colors = require('colors/safe'),
  Promise = require('bluebird');

// variables

const
  sentiment = new Sentiment(),
  BLOG_PAGE = 'https://dejiolowe.com/about/',
  LINKEDIN = 'https://www.linkedin.com/in/adedejiolowe/',
  LINKEDIN_EMAIL_SELECTOR = '#login-email',
  LINKEDIN_PWD_SELECTOR = '#login-password',
  LINKEDIN_SIGNIN_BUTTON_SELECTOR = '#login-submit',
  SHOW_MORE_BUTTON_SELECTOR = 'button.pv-top-card-section__summary-toggle-button',
  SHOW_1_MORE_BUTTON_SELECTOR = 'button.pv-profile-section__see-more-inline.pv-profile-section__text-truncate-toggle.link',
  OPEN_BANKING_SELECTOR = 'span.pv-entity__secondary-title',
  GOOGLE = 'https://www.google.com/',
  GMAIL_SELECTOR = '#gb_23 > span.gbts',
  EMAIL_SELECTOR = '#Email',
  MOVE_TO_PASSWORD_SELECTOR = '#next',
  PASSWORD_SELECTOR = '#Passwd',
  {
    GMAIL_PWD,
    LINKEDIN_EMAIL,
    LINKEDIN_PWD
  } = process.env,
  SIGN_IN_SELECTOR = '#signIn',
  COMPOSE_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(1) > table.m > tbody > tr:nth-child(1) > td > b > a',
  TO_SELECTOR = '#to',
  CC_SELECTOR = '#cc',
  SUBJECT_SELCTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(4) > td:nth-child(2) > input',
  MSG_BODY_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table.compose > tbody > tr:nth-child(8) > td:nth-child(2) > textarea',
  SEND_EMAIL_SELECTOR = 'body > table:nth-child(17) > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td:nth-child(2) > form > table:nth-child(6) > tbody > tr > td > input[type="submit"]:nth-child(1)';

const DATA = `

Mr Adédèjì Olówè postgraduate in Engineering, Business Management at King’s College London. Mr Adédèjì Olówè electrical engineer member of the Institute of Electrical and Electronics Engineers.

Mr Adédèjì Olówè a Chartered Fellow of the British Computer Society and a Project Management Professional. Mr Adédèjì Olówè area of specialty Business Performance and Business Intelligence and Data Warehousing.

Mr Adédèjì Olówè likes reading Malcolm Gladwell. Mr Adédèjì Olówè volunteers as a trustee at Open Banking Nigeria. Mr Adédèjì Olówè speaks English and Yoruba.

Work History:

·      Executive Director, Products and Services at System Specs (Duration Feb 2017 – Mar 2018)

·      Head, Cards and Digital Payments at Atlas Mara Ltd (Oct 2016 – Feb 2017)

·      Divisional Head, Electronic Banking at Fidelity Bank PLC (Jun 2014 – Sep 2016)
·      Innovation; Developed a three years Electronic Banking transformation strategy at Fidelity Bank PLC  (Apr 2014 – Jun     2015)
·      Advisory Board Member at Verve International (Member of Interswitch Group) (Oct 2013 – Sep 2016  )

·      Head, Cards at United Bank of Africa (Nov 2011 – Mar 2014)

·      Head, Performance Management Initiatives at United Bank of Africa (Mar 2008 – Nov 2011)

·      Head, Business Automation at First City Monument Bank (Mar 2006 – Jan 2008)

·      Head, Electronic Banking and Web Management at Access Bank Plc (Oct 2002 – Feb 2006)

·      Relationship Manager, Internet Banking at Standard Trust Bank (Merged with UBA Group) (Jun 2001 – May 2002)

Articles written by Mr Adédèjì Olówè

- Blackberry uptake in Nigeria. A market analysis for Business Day Nigeria. January 2010
- ColdFusion to the Rescue. ColdFusion Developer Journal (CFDJ) October 2006
- ColdFusion can save you big buck. ColdFusion Developer Journal (CFDJ) August 2006
- Leveraging on Active Directory for Users Administration and Security Profiling. ColdFusion DeveloperJournal (CFDJ) December 2005`;
let
  recipient,
  extraEmails,
  OUTPUT_ARR,
  pos_lines = [],
  neg_lines = [],
  neut_lines = [];

// HELPER FUNCTIONS
async function getLinkedinSignInSelector(page) {
  let LINKEDIN_SIGNIN_SELECTOR;
  const FIRST_SELECTOR = await page.waitForSelector('#join-form > p.form-subtext.login > a', {timeout: 30000});
  if(!!FIRST_SELECTOR) {
    LINKEDIN_SIGNIN_SELECTOR = '#join-form > p.form-subtext.login > a';
  }
  else {
    LINKEDIN_SIGNIN_SELECTOR = '#uno-reg-join > div > div > div > div.content-container > div.reg-content-wrapper.single > div.join-form-container.form-container > div.join-form-wrapper.form-wrapper > p > a';
  }
  return LINKEDIN_SIGNIN_SELECTOR;
}

function getMsgSentiment(msg) {
  const SCORE = sentiment.analyze(msg).comparative;
  let OUTPUT;
  if(SCORE > 0) {
    OUTPUT = colors.green(msg);
    pos_lines.push(msg);
  }
  if(SCORE < 0) {
    OUTPUT = colors.red(msg);
    neg_lines.push(msg);
  }
  if(SCORE === 0) {
    OUTPUT = colors.blue(msg);
    neut_lines.push(msg);
  }
  console.log(OUTPUT);
}

// OPEN DEJI BLOG
async function openBlog() {
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
  // open deji blog
  await page.goto(BLOG_PAGE, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // wait 5 seconds
  await page.waitFor(5*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight * 0.6;
    return window.scrollBy(0, HEIGHT);
  });
  await page.waitFor(5*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight * 0.6;
    return window.scrollBy(HEIGHT, HEIGHT * 0.6);
  });
  await page.waitFor(5*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight * 0.6;
    return window.scrollBy(HEIGHT * 0.6, HEIGHT);
  });
  // wait for 5 seconds
  await page.waitFor(5*1000);
  // close page
  await page.close();
  await browser.close();
}
// OPEN DEJI LINKEDIN
async function openLinkedin() {
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
  // navigate to LINKEDIN
  await page.goto(LINKEDIN, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  // ensure LINKEDIN_SIGNIN_SELECTOR available and select it
  const SIGN_IN_SELECTOR = await getLinkedinSignInSelector(page);
  await page.click(SIGN_IN_SELECTOR);
  await page.waitFor(2*1000);
  // ensure LINKEDIN_EMAIL_SELECTOR exists
  await page.waitForSelector(LINKEDIN_EMAIL_SELECTOR, {timeout: 30000});
  // enter the email
  await page.type(LINKEDIN_EMAIL_SELECTOR, LINKEDIN_EMAIL, {delay: 100});
  await page.waitFor(2*1000);
  // ensure LINKEDIN_PWD_SELECTOR exists
  await page.waitForSelector(LINKEDIN_PWD_SELECTOR, {timeout: 30000});
  await page.type(LINKEDIN_PWD_SELECTOR, LINKEDIN_PWD, {delay: 100});
  await page.waitFor(5*1000);
  // ensure LINKEDIN_SIGNIN_BUTTON_SELECTOR available
  await page.waitForSelector(LINKEDIN_SIGNIN_BUTTON_SELECTOR, {timeout: 30000});
  await page.click(LINKEDIN_SIGNIN_BUTTON_SELECTOR);
  await page.waitFor(15*1000);
  // ensure SHOW_MORE_BUTTON_SELECTOR available
  await page.waitForSelector(SHOW_MORE_BUTTON_SELECTOR, {timeout: 30000});
  await page.click(SHOW_MORE_BUTTON_SELECTOR);
  await page.waitFor(10*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight * 0.75;
    return window.scrollBy(0, HEIGHT);
  });
  await page.waitFor(7*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight;
    return window.scrollBy(HEIGHT * 0.75, HEIGHT * 1.45);
  });
  await page.waitFor(7*1000);
  // scroll to 0.6 of window height
  await page.evaluate(_ => {
    const HEIGHT = window.innerHeight;
    return window.scrollBy(HEIGHT * 1.45, HEIGHT * 1.75);
  });
  // wait for 5 seconds
  await page.waitFor(5*1000);
  // close page
  await page.close();
  await browser.close();
}

if(process.argv.length > 2) {
  // set email recipient
  recipient = process.argv[2];
  // set copied recipients
  if(process.argv.length > 3) {
    extraEmails = process.argv.slice(3).join(', ');
  }
}
// send GMAIL
async function sendDataViaGmail() {
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
  await page.type(MSG_BODY_SELECTOR, `Hello There!

  This is the TSS Bot, I have retrieved the following information:

    ${DATA}

    Basic Sentiment Analysis has been performed on the preceding information. The results follow:

    Total number of positive lines: ${pos_lines.length}.
    Total number of negative lines: ${neg_lines.length}.
    Total number of neutral lines: ${neut_lines.length}
    Total number of lines: ${OUTPUT_ARR.length}

    Kind Regards`, {delay: 20});
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

openBlog()
  .then(() => openLinkedin())
  .then(() => {
    const DATA_ARR = DATA.split('\n');
    OUTPUT_ARR = DATA_ARR.filter(el => !!el);
    OUTPUT_ARR.forEach(el => getMsgSentiment(el));
    return Promise.resolve(true);
  })
  .then(ok => sendDataViaGmail())
  .catch(err => console.log(err));
