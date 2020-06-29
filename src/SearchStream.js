const fs = require('fs')
const Path = require('path')
const readline = require('readline')
const { createGunzip } = require('zlib')
const { executeMatchers, getYMD } = require('./utils')
const args = process.argv.slice(2)

/**
 * 
 * @param {string} dir - directory to get files from
 * @param {object} search - search object containing from and to dates
 * @param {string} search.fromDate - yyyy-mm-dd start date
 * @param {string} search.toDate - yyyy-mm-dd end date
 * @returns {string[]}
 */
function getFilePaths(dir, search) {
  const now = new Date()
  const nowDate = getYMD(now)
  let { fromDate, toDate } = search
  if(!fromDate) fromDate = '1970-01-01';
  if(!toDate) toDate = nowDate;

  const logFiles = fs.readdirSync(dir)

  return logFiles.filter(file => {
    if(file === 'latest.log' && toDate >= nowDate) {
      return true
    } else {
      return file >= fromDate && file <= toDate
    }
  })
}

class SearchStream {
  search = {}
  constructor(search) {
    console.log('Creating SearchStream from search: ', search)
    const serverPath = args[0]
    this.search = search
    this.basePath = Path.join(serverPath, 'logs')
    this.filePaths = getFilePaths(this.basePath, search)
  }

  async getContent() {
    console.log('Getting contents from files: ', this.filePaths)
    let results = []
    if(this.filePaths.length === 0) return results;

    for(let i = 0; i < this.filePaths.length; i++) {
      const currentFile = this.filePaths[i]
      const currentPath = Path.join(this.basePath, currentFile)
      const fileStream = fs.createReadStream(currentPath)

      const rl = readline.createInterface({
        input: currentFile === 'latest.log'
          ? fileStream
          : fileStream.pipe(createGunzip())
      })

      await this.searchLines(results, rl, currentFile)
    }

    return results
  }

  async searchLines(results, rl, fileName) {
    return new Promise((resolve, reject) => {
      rl.on('line', (line) => {
        const result = executeMatchers(this.search, line, fileName)
        if(result) {
          results.push(result)
        }
      })

      rl.on('close', resolve)
    })
    .catch((error) => console.error('Caught an error when searching for lines: ', error))
  }
}

module.exports = SearchStream