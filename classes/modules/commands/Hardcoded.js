"use strict"
const util = require('util')
const si = require('systeminformation')
//CLASSES
const ApiFunctions = require('../../api/ApiFunctions.js')
const DiscordLog = require('./../DiscordLog')
const Helper = require('./Helper')
const UserLevels = require("../../../ENUMS/UserLevels")

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 4700 })

wss.on('connection', function connection (ws) {
  console.log("-----------------")
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
  })
})

module.exports = class Hardcoded {
  constructor (bot) {
    this.bot = bot

  }

  /**
   * Handles hardcoded commands
   * @param messageObj created in PrivMsg.createRawMessageObj
   * @returns {boolean} don't allow further commands
   */
  handle (messageObj) {
    if (messageObj.userLevel === UserLevels.BOTADMIN
      && messageObj.message.startsWith("<tts ")) {

      wss.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({message: messageObj.message.substr(messageObj.message.indexOf(" ") + 1)}))
        }
      })

      return true
    }
    if (messageObj.userLevel === UserLevels.BOTADMIN
      && messageObj.message.startsWith("<ttsD ")) {

      wss.clients.forEach(function each (client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({message: messageObj.message.substr(messageObj.message.indexOf(" ") + 1), voice: "Justin"}))
        }
      })

      return true
    }

    /* Shutting down the bot */
    if (messageObj.userLevel === UserLevels.BOTADMIN
      && messageObj.message.startsWith("<s ")) {

      this.bot.TwitchIRCConnection.say(messageObj.channel, "Shutting down FeelsBadMan")
      setTimeout(function () {
        process.exit(0)
      }, 1200)
      return true
    }

    /* eval */
    if (messageObj.userLevel === UserLevels.BOTADMIN
        && messageObj.message.startsWith("<eval ")) {

      let msg
      let evalString = messageObj.message.split(" ").slice(1).join(" ")
      console.log(evalString)
      if (evalString) {
        try {
          let ss = (x) => {
            this.bot.TwitchIRCConnection.queue.sayWithMsgObj(messageObj, x.toString())
          }
          let so = (x) => {
            this.bot.TwitchIRCConnection.queue.sayWithMsgObj(messageObj, util.inspect(x))
          }
          msg = (eval(evalString) || "").toString()
        } catch (err) {
          msg = err.message
        }

        if (["mysql", "identity", "oauth", "host", "password", "appid", "waAppid"].find(
          x => msg.toLowerCase().includes(x) || evalString.toLowerCase().includes(x)
        )) {
          console.warn("Eval match: " + msg)
          msg = "***"
        }

      } else {
        msg = messageObj.username + ", Nothing to eval given..."
      }
      this.bot.TwitchIRCConnection.queue.sayWithMsgObj(messageObj, msg)
    }

    return false
  }
}
