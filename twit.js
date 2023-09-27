const Twit = require('twit');

const T = new Twit({
    consumer_key: 'F4hyohV9m3zjxSu7uXdcMemqp',
    consumer_secret: 'tix2hnv4OXkNYIUyofsUEKWBcncYapt1NwKOovpgtQ7KyIvzNe',
    access_token: '1704750802483757056-JCggU2227fjCvsyjZN5UrlbZ6LIL7u',
    access_token_secret: 'izmYLhawNIxrfe5fHlSpuxkCxdedwMRdF2uRXiZbQqQ4a',
    timeout_ms: 60*1000,
    strictSSL: true
});

var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })
 
stream.on('tweet', function (tweet) {
  console.log(tweet)
})

stream.on('error', (error) => {
    console.error('Error:', error);
});