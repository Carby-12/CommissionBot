# Installation

The application can be run either locally or deployed in the cloud. Current document provides instructions for deployment application to [Heroku](https://heroku.com) or locally.

## Prerequisites

- [Git](https://git-scm.com/) and [GitHub](https://github.com) account
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and [Heroku](https://heroku.com) account
- [Node 12 or newer](https://nodejs.org/)
- [Trello](https://trello.com/) Account

## Self-hosting Installation
Self-hosting is recommended for advanced users only who are experienced with the Node.js ecosystem.

1. To get the bot ready to run locally, the first step is to clone this repository onto the machine you wish to run it on.
2. **Node.js version 12 r newer is recommended to run this bot.**
3. Use NPM to install the dependencies from the project folder: `npm install`
4. Edit the file `config.json` and insert your [bot token](https://discordapp.com/developers/applications/me).
5. Start the bot from the index file: `node index.js`
6. You should set up a process manager like [PM2](http://pm2.keymetrics.io/) or forever.js to ensure that the bot remains online.

## Heroku Installation

Create Heroku application:

- Login to [Heroku](https://heroku.com) and [create new app](https://dashboard.heroku.com/new-app)
- Fill *App name* field with any name and choose appropriate region
- Click on *Create App* button

Set environment variables for your application:

- Open dashboard of your Heroku application
- Go to *Settings* tab
- Click on *Reveal Config Vars* button
- Add `TOKEN`, `TRELLO_APP_KEY`, `TRELLO_TOKEN` and `BANS_LIST_ID` keys with appropriate credentials, see below.

Login to Heroku CLI:

```
$ heroku login
```

Add a remote to git repository for your Heroku application:

```
$ git remote add heroku https://git.heroku.com/<YOUR-HEROKU-APP-NAME>.git
```

Deploy your master branch to Heroku:

```
$ git push heroku master
```

This command will automatically build and deploy your application.

## Credentials Setup

### config.json

|           |                                                                                                             |
|--------------|----------------------------------------------------------------------------------------------------------------|
|     token    |           Discord bot token, you can acquire one [here](https://discord.com/developers/applications)           |
|  trelloToken |        Your Trello token, you can get your trello token [here](trekhttps://trello.com/1/appKey/generate)       |
| trelloAppKey |          Your Trello application key, you can acquire one [here](https://trello.com/1/appKey/generate)         |
| bansListId   | Bans list ID for Trello bans, instructions on how to get a list id from the a Trello board can be found below. |

### Environment Variables

|             |                                                                                                             |
|----------------|----------------------------------------------------------------------------------------------------------------|
|      TOKEN     |           Discord bot token, you can acquire one [here](https://discord.com/developers/applications)           |
|  TRELLO_TOKEN  |        Your Trello token, you can get your trello token [here](trekhttps://trello.com/1/appKey/generate)       |
| TRELLO_APP_KEY |          Your Trello application key, you can acquire one [here](https://trello.com/1/appKey/generate)         |
| BANS_LIST_ID   | Bans list ID for Trello bans, instructions on how to get a list id from the a Trello board can be found below. |
## Getting Trello List ID

1. Open the board that contains your chosen list.
2. Add one card to that list (if one does not exist already).
3. Open the card and copy the URL that you see in the address bar.
4. It should be short URL that looks like
 https://trello.com/c/DcqBrqdx/1-target-card
5. Take that URL and add “.json” to the end, like this: https://trello.com/c/DcqBrqdx/1-target-card.json
6. Go to this URL. In the code, you will see a field called idList.
7. Copy the idList:
![Picture](https://customer.io/wp-content/uploads/2018/02/actions-trello-idlist.png)
