/**
 *
 * NN-Police-Socrata
 *
 * Created by Jason Wilson <jason@wilsons.io>
 *
 * 9/30/17.
 *
 * MIT License
 */

// index.js

// Call required modules
const CronJob = require('cron').CronJob
const csv = require('csv-parse')
const express = require('express')
const server = express()
const path = require('path')

// Load local ENV file if ENV variables not set
if (!process.env.API_KEY) {
  require('dotenv').config()
}

// Use PUG as the view engine
server.set('view engine', 'pug')

// Set pug template path
server.set('views', path.join(__dirname, 'public/views'));

// constants
const port = process.env.PORT
const sourceData = {
  ACCIDENTS: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Accidents_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 0 0-23/12 * * *' // Run automatically at Midnight and Noon
  },
  DAILY_ARRESTS: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Arrests_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 5 0-23/12 * * *' // Run automatically at five after Midnight and Noon
  },
  DAILY_JUVENILE: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Juvenile_Report_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 10 0-23/12 * * *' // Run automatically at ten after Midnight and Noon
  },
  DAILY_OFFENSES: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Offenses_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 15 0-23/12 * * *' // Run automatically at quarter after Midnight and Noon
  },
  DAILY_FIELD_CONTACTS: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Field_Contacts_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 20 0-23/12 * * *' // Run automatically at twenty after Midnight and Noon
  },
  THEFT_FROM_VEHICLE: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/Daily_Theft_From_Vehicle_Public&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 25 0-23/12 * * *' // Run automatically at twenty-five after Midnight and Noon
  },
  TOW_IMPOUND: {
    URI: 'https://gis2.nngov.com/ssrs/report/?rs:Name=/12-Police/NNPD_Tow_Impound&rs:Command=Render&rs:Format=CSV',
    cronPattern: '0 30 0-23/12 */7 * *' // Run automatically at half past Midnight and Noon every seven days
  }
}

// Variables
let crons = [] // Provide an array to house the cron jobs

// Helper Methods
const syndicate = function (source) {
  console.log(`I'll syndicate ${source} once I'm fully coded`)
  // Fetch the csv file
  
  // Log some csv data to verify file recieved
  
  // Eventually translate the file to socrata format
}

// Define Cron Jobs and save them to crons
Object.keys(sourceData).forEach(job => {
  crons[job] = new CronJob(
    sourceData[job].cronPattern,
    function () {
      console.log(`[DATA COLLECTION] ${job} - Job Started ${new Date().toString()}`)
      syndicate(sourceData[job].URI) // go and get the data file and push it to Socrata
    },
    function () {
      console.log(`[DATA COLLECTION] ${job} - Job Stopped ${new Date().toString()}`)
    },
    false, // Do not start automatically, wait for start command
    'America/New_York' // timezone
  )
})

// Server for handling admin requests

server.param('key', (req, res, next, key) => {
  // Verify key match
  if (key === process.env.API_KEY) {
    req.lock = { unlocked: true, msg: `API key validated` }
  } else {
    req.lock = { unlocked: false, msg: `Incorrect key value` }
  }
  return next()
})

server.get('/:key/:cron/start', function (req, res) {
  if (req.lock.unlocked) {
    try {
      crons[req.params.cron].start()
      res.send(`${req.lock.msg}, starting ${req.params.cron}...`)
    } catch (err) {
      res.send(`There was a problem starting ${req.params.cron}, the error received was: \n ${err}`)
    }
  } else {
    res.send(`${req.lock.msg}, no actions will be performed.`)
  }
})

server.get('/:key/:cron/stop', function (req, res) {
  if (req.lock.unlocked) {
    try {
      crons[req.params.cron].stop()
      res.send(`${req.lock.msg}, stopping ${req.params.cron}...`)
    } catch (err) {
      res.send(`There was a problem stopping ${req.params.cron}, the error received was: \n ${err}`)
    }
  } else {
    res.send(`${req.lock.msg}, no actions will be performed.`)
  }
})

server.get('/:key/start', function (req, res) {
  if (req.lock.unlocked) {
    Object.keys(crons).forEach(job => {
      try {
        crons[job].start()
        console.log(`${job} started: ${crons[job].running}`)
      } catch (err) {
        console.log(`There was a problem starting the jobs, the error received was: \n ${err}`)
      }
    })
    res.send(`${req.lock.msg}, starting all crons...`)
  } else {
    res.send(`${req.lock.msg}, no actions will be performed.`)
  }
})

server.get('/:key/stop', function (req, res) {
  if (req.lock.unlocked) {
    Object.keys(crons).forEach(job => {
      try {
        crons[job].stop()
      } catch (err) {
        console.log(`There was a problem starting the jobs, the error received was: \n ${err}`)
      }
    })
    res.send(`${req.lock.msg}, stopping all crons...`)
  } else {
    res.send(`${req.lock.msg}, no actions will be performed.`)
  }
})

server.get('/:key', function (req, res) { // Help Page
  if (req.lock.unlocked) {
    res.render(`help`, {
      jobs: Object.keys(sourceData)
    })
  } else {
    res.send(`${req.lock.msg}, no actions will be performed.`)
  }
})

server.listen(port, function () {
  console.log(`Code4HR NN Police Open Data transport listening on port ${port}!`)
})
