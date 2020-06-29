module.exports = [
  {
    id: 'line',
    regex: /.*/,
    transform: (match, agg) => {
      const [line] = match
      agg.line = line
      return line
    }
  },
  {
    id: 'time',
    regex: /^\[(.{8})\] (.*)$/,
    transform: (match, agg) => {
      const [matchLine, time, restLine] = match
      agg.time = time
      return restLine
    }
  },
  {
    id: 'threadInfo',
    regex: /^\[(.*)\]: (.*)$/,
    transform: (match, agg) => {
      const [matchLine, threadInfo, restLine] = match
      agg.threadInfo = threadInfo
      return restLine
    }
  },
  {
    id: 'command',
    regex: /^(\S+) issued server command: \/(\S+)? ?(.*)$/,
    transform: (match, agg) => {
      const [matchLine, playerName, command, args] = match
      agg.player = playerName
      agg.command = command
      agg.args = args
      return ''
    }
  },
  {
    id: 'chat',
    regex: /^((\**)([^[].*)|\[(no-faction)\]) <(\S+)> (.+)$/,
    test: (line, agg) => {
      return agg.threadInfo.startsWith("Async Chat Thread - #")
    },
    transform: (match, agg) => {
      const [matchLine, fullFaction, rank, faction, noFaction, playerName, message] = match
      agg.player = playerName
      agg.faction = faction || noFaction
      agg.factionRank = (rank || '').length
      agg.message = message
      return ''
    }
  },
  {
    id: 'uuid',
    regex: /^UUID of player (\S+) is (\S+)$/,
  }
]