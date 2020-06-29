const validations = {
  generalQuery(value, matcherResults) {
    return matcherResults.line.toUpperCase().indexOf(value.toUpperCase()) >= 0
  },
  fromDate(value, matcherResults, search) {
    return matcherResults.date >= value
  },
  fromTime(value, matcherResults, search) {
    return matcherResults.date > search.fromDate ||
      (
        matcherResults.date === search.fromDate &&
        matcherResults.time >= value
      )
  },
  toDate(value, matcherResults, search) {
    return matcherResults.date <= value
  },
  toTime(value, matcherResults, search) {
    return matcherResults.date < search.toDate ||
      (
        matcherResults.date === search.toDate &&
        matcherResults.time <= value
      )
  },
}

function validate(key, value, matcherResults, search) {
  const validationFn = validations[key]
  if(validationFn) {
    return validationFn(value, matcherResults, search)
  } else {
    return true
  }
}

module.exports = {
  validate
}