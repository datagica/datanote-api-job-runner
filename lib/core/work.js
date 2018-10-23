
const { getText, getResult } = require('@datagica/datanote-api-engine')

/*
work(job) may return:

 - success: { id, result }
 - processing error: { id, error }
 - invalid job id: { error }
*/
async function work (job) {
  // console.log("[work] got a job: "+JSON.stringify(job, null, 2))
  if (!job || typeof job !== 'object' || !job.id || !job.user) {
    console.error("received an invalid job")
    return { error: 'invalid job' }
  }
  try {

    //console.log("[work] params: "+JSON.stringify(job.params, null, 2))

    //console.log("[work] calling getText..")
    // we need to define a format:
    // ex. job.input
    // job.options
    const text = await getText(job.input)
    //console.log("[work] got text: "+JSON.stringify(text, null, 2))

    const result = await getResult(text, job.params)
    //console.log("[work] got doc: "+JSON.stringify(result, null, 2))
    return { id: job.id, user: job.user, result: result }
  } catch (error) {
    console.error(error)
    return { id: job.id, user: job.user, error: error }
  }
}

module.exports = work
