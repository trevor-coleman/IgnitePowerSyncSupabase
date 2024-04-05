import { logger as log, consoleTransport } from "react-native-logs"

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: "debug",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: "white",
      info: "blue",
      warn: "yellowBright",
      error: "redBright",
    },
  },

  async: true,
  printLevel: true,
  printDate: false,
  fixedExtLvlLength: true,
  enabled: true,
}

const highlightConfig = {
  ...config,
  async: true,
  printLevel: false,
  transportOptions: {
    ...config.transportOptions,
    colors: {
      debug: "whiteBright",
      info: "cyanBright",
      warn: "yellowBright",
      error: "redBright",
    },
  },
}

export const logger = log.createLogger(config)
export const highlight = log.createLogger(highlightConfig)
