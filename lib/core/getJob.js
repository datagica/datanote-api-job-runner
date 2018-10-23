

module.exports = function (api) {
  return function(oldJob) {
    return api.worker(oldJob)
  }
}
