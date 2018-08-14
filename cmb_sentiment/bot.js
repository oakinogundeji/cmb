'use strict';
if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
// dependencies
const
  Twit = require('twit'),
  Sentiment = require('sentiment'),
  colors = require('colors/safe'),
  emailer = require('./emailer');

// variables
const
  {
    C_KEY,
    C_SECRET,
    A_TOKEN,
    A_SECRET
  } = process.env,
  T_OPTIONS = {
    consumer_key: C_KEY,
    consumer_secret: C_SECRET,
    access_token: A_TOKEN,
    access_token_secret: A_SECRET,
    timeout_ms: 60 * 1000
  };


// console.log(`C_KEY: ${C_KEY}, C_SECRET: ${C_SECRET}, A_TOKEN: ${A_TOKEN}, A_SECRET: ${A_SECRET}`);

// instantiate Twit and sentiment
const
  T = new Twit(T_OPTIONS),
  sentiment = new Sentiment();

let
  KWORD = 'nigeria',
  tweet_counter = 0,
  pos_tweets = [],
  neg_tweets = [],
  neut_tweets = [];

let extraEmails;

if(process.argv.length >= 3) {
  KWORD = process.argv[2];
  extraEmails = process.argv.slice(3).join(', ');
  console.log(`KWORD: ${KWORD}`);
  console.log(`extra emails: ${extraEmails}`);
  console.log(`typeof(extraEmails): ${typeof(extraEmails)}`);
}

// cr8 a stream of tweets

// const T_STREAM = T.stream('statuses/filter', { track: ['nodejs']});

// const T_STREAM = T.stream('statuses/filter', { track: ['@coronationmb']});

const T_STREAM = T.stream('statuses/filter', { track: [`${KWORD}`]});

// handle streaming events

T_STREAM.on('tweet', tweet => {
  console.log(`tweet_counter: ${tweet_counter}`);
  if(tweet_counter == 20) {
    console.log('20 tweets seen');
    /*console.log('pos_tweets');
    console.log(pos_tweets);
    console.log('neg_tweets');
    console.log(neg_tweets);
    console.log('neut_tweets');
    console.log(neut_tweets);*/
    T_STREAM.stop();
    return emailer({
      pos: pos_tweets,
      neg: neg_tweets,
      neut: neut_tweets,
      kword: KWORD,
      extraEmails
    });
  }
  console.log(`new tweet created at: ${tweet['created_at']} by: ${tweet.user.name} with handle: ${tweet.user['screen_name']} located at: ${tweet.user.location}`);
  //console.log(tweet);
  if(!!tweet['retweeted_status']) {
    console.log('retweeted...');
    if(!!tweet['retweeted_status']['extended_tweet']) {
      console.log('retweeted extended text..');
      const msg = tweet['retweeted_status']['extended_tweet']['full_text'];
      const SCORE = sentiment.analyze(msg).comparative;
      let OUTPUT;
      if(SCORE > 0) {
        OUTPUT = colors.green(msg);
        pos_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE < 0) {
        OUTPUT = colors.red(msg);
        neg_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE === 0) {
        OUTPUT = colors.blue(msg);
        neut_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      console.log(OUTPUT);
      tweet_counter++;
    }
    else {
      console.log('normal retweeted...');
      const msg = tweet['retweeted_status'].text;
      const SCORE = sentiment.analyze(msg).comparative;
      let OUTPUT;
      if(SCORE > 0) {
        OUTPUT = colors.green(msg);
        pos_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE < 0) {
        OUTPUT = colors.red(msg);
        neg_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      if(SCORE === 0) {
        OUTPUT = colors.blue(msg);
        neut_tweets.push({
          date: tweet['created_at'],
          handle: tweet.user['screen_name'],
          location: tweet.user.location,
          msg
        });
      }
      console.log(OUTPUT);
      tweet_counter++;
    }
  }
  if(!!tweet['extended_tweet']) {
    console.log('extended...');
    const msg = tweet['extended_tweet']['full_text'];
    const SCORE = sentiment.analyze(msg).comparative;
    let OUTPUT;
    if(SCORE > 0) {
      OUTPUT = colors.green(msg);
      pos_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    if(SCORE < 0) {
      OUTPUT = colors.red(msg);
      neg_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    if(SCORE === 0) {
      OUTPUT = colors.blue(msg);
      neut_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    console.log(OUTPUT);
    tweet_counter++;
  }
  if((!tweet['extended_tweet']) && (!tweet['retweeted_status'])) {
    console.log('normal...');
    const msg = tweet.text;
    const SCORE = sentiment.analyze(msg).comparative;
    let OUTPUT;
    if(SCORE > 0) {
      OUTPUT = colors.green(msg);
      pos_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    if(SCORE < 0) {
      OUTPUT = colors.red(msg);
      neg_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    if(SCORE === 0) {
      OUTPUT = colors.blue(msg);
      neut_tweets.push({
        date: tweet['created_at'],
        handle: tweet.user['screen_name'],
        location: tweet.user.location,
        msg
      });
    }
    console.log(OUTPUT);
    tweet_counter++;
  }
});
