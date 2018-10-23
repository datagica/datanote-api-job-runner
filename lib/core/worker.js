'use strict'

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const getSocket = require('./getSocket')
const getJobFactory = require('./getJob')
const work = require('./work')

async function worker (config) {

  // context
  const api = await getSocket(config)
  const getJob = await getJobFactory(api)

  const stats = {
    nbErrors: 0,
    pendingJobs: 0,
    subscribed: false
  }

  function tryToSubscribe() {
    // here we cannot really check if we are already subscribed, because a
    // disconnect might have already unsubscribed us
    try {
      api.subscribe('newJob')
      stats.subscribed = true
    } catch(err) {
      // ignored because it can happen if we are disconnected
    }
  }

  function tryToUnsubscribe() {
    if (stats.subscribed) {
      try {
        api.unsubscribe('newJob')
        stats.subscribed = false
      } catch(err) {
        // ignored because it can happen if we are disconnected
      }
    }
  }

  function doJob(job) {

    tryToUnsubscribe()

    work(job).then(maybeCompletedJob => {
      stats.pendingJobs--
      console.error(`done job #${job.id} for ${JSON.stringify(job.user)}`)
      setTimeout(() => { findJob(maybeCompletedJob) }, 1)
    })
  }

  function findJob(maybeCompletedJob) {

    tryToUnsubscribe()

    if (stats.pendingJobs) {
      console.log("no need to find a job now, already got one")
      return
    }
    stats.pendingJobs++
    getJob(maybeCompletedJob).then(maybeNewJob => {
      // console.log(`result of getJob: ${JSON.stringify(maybeNewJob, null, 2)}`)
      if (maybeNewJob && maybeNewJob.id) {
        console.log(`new job #${maybeNewJob.id} from ${JSON.stringify(maybeNewJob.user)}`)
        setTimeout(() => doJob(maybeNewJob), 1)
      } else {
        stats.pendingJobs--
        // console.log(`no new job yet, going to sleep.. (stats.pendingJobs=${stats.pendingJobs})`)
        tryToSubscribe()
      }
    }).catch(err => {

      const msg = err && err.data ? err.data : err.message

      console.error("cannot get job: "+msg)
      stats.pendingJobs--

      if (stats.nbErrors++ > config.maxErrors) {
        console.error("too many errors, exiting..")
        try {
          api.close()
        } catch (err) {
          console.error("cannot close socket")
        }
        setTimeout(() => {
          process.exit(1)
        }, 5000)
        return
      }

      tryToSubscribe()

    })
  }

  // try to be the first to get a job when a new one is posted on the board

  api.on('newJob', () => findJob())
  tryToSubscribe()

  // also check for job from time to time, in case we missed the announce
  // (eg. after disconnect)
  // setInterval(() => findJob(), 30000)


  // also try to get any waiting job now, as we just joined
  findJob()
}

module.exports = worker
