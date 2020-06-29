
const matchers = require('./matchers')
const { validate } = require('./validation')

let last = 0
function generateId() {
  const next = Date.now()
  if(last >= next) {
    last++
  } else {
    last = next
  }

  return last.toString(36)
}

function executeMatchers(search, line, fileName) {
  const matcherResults = { date: getDateFromFile(fileName) }
  matchers.reduce((agg, matcher) => {
    const matcherTest = matcher.test
    const testResult = matcherTest instanceof Function
      ? matcherTest(line, agg)
      : true
    const regexMatch = testResult && matcher.regex.exec(line)
    if(regexMatch) {
      line = matcher.transform(regexMatch, agg)
    }
    
    return agg
  }, matcherResults)

  if(matchesSearch(matcherResults, search)) {
    return matcherResults
  }
}

function getDateFromFile(fileName) {
  if(fileName === 'latest.log') {
    const now = new Date()
    return getYMD(now)
  } else {
    return fileName.slice(0, 10)
  }
}

function matchesSearch(matcherResults, search) {
  return Object.entries(search)
    .filter(([key, value]) => value)
    .every(([key, value]) => validate(key, value, matcherResults, search))
}

function getYMD(date) {
  const year = date.getFullYear()
  let month = date.getMonth()
  month = month.toString().length === 1
    ? `0${month+1}`
    : month+1
  let day = date.getDate()
  day = day.toString().length === 1
  ? `0${day}`
  : day
  return `${year}-${month}-${day}`
}

module.exports = {
  generateId,
  executeMatchers,
  getYMD
}