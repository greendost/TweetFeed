# TweetFeed

Portfolio web app for organizing Twitter handles and queries into lists. Built with React, Redux, and Typescript, and also featuring a simple Node/Express backend to cover for the Twitter API calls as well as set up the limited 15 minute session via Redis.

If the app is running, you can check it out at [https://www.tweetfeed.app/](https://www.tweetfeed.app/)

## Getting Started

These instructions will allow you to setup and build the project on your local machine for development and testing purposes.

### Prerequisites

Node, NPM for development, and [Twitter key](https://developer.twitter.com/en/apply-for-access). If there are any problems, please let me know.

### Installing

- Clone repository
- Run `npm install`
- Create .env file in project root folder
  e.g.

  ```
  NODE_ENV=development
  PORT=5000
  REDIS_PORT=6379
  REDIS_HOST=127.0.0.1
  TW_CONSUMER_KEY=<your Twitter consumer key>
  TW_CONSUMER_SECRET_KEY=<your Twitter consumer secret key>
  TIMEOUT=<number of minutes e.g. 20>
  LOGIN_DELAY_SECONDS=1
  ```

- Run `npm run dev` in a dedicated terminal session to start Express server
- Open `localhost:<PORT>` in a modern browser, where port is what you specified in the .env file

## Running the tests

npm test

## Deployment

I have this application running (as of 2018) on an AWS instance.

## Built With

React, Redux, Typescript. Makes use of React Router, CSS Grid & Flexbox, CSS modules with PostCSS, and Jest/Enzyme. Backend with Node, Express, and Redis.

## Contributing

Looking forward to any contributions, thoughts, and feedback - in visual design, UX, or development. Also, please feel free to reach out if interested in user testing.

## Versioning

Hmmm.. maybe 1.0

## Authors

- **Harteg Wariyar** - _Initial work_ - [greendost](https://github.com/greendost)

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

Too many to thank, but certainly this code stands on the shoulders of many: web developers, web browser developers, Node / NPM package saints, PostCSS wizards, testing tool developers (jest, enzyme), etc.
