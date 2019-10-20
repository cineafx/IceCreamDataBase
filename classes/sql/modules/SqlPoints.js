"use strict"
const sqlPool = require('../Sql').pool
const util = require('util')

module.exports = class SqlPoints {
  constructor () {
  }

  static async setPoints (userID, channelID, points) {
    let results = await sqlPool.query(`
        INSERT INTO pointsWallet (userID, channelID, balance)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            balance = balance + ?;
        ;`, userID, channelID, points, points)

  }

  static async addPoints (userID, channelID, points) {
    let results = await sqlPool.query(`
        INSERT INTO pointsWallet (userID, channelID, balance)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            balance = ?;
        ;`, userID, channelID, points, points)

  }

  static async getPoints (userID, channelID) {
    let results = await sqlPool.query(`
        SELECT balance
        FROM pointsWallet
        WHERE userID = ?
        AND channelID = ?
        ;`, userID, channelID)

    return results.balance || 0
  }
}
