const winston = require("winston");
const expressWinston = require("express-winston");

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

module.exports = {
  logger,
  expressLogger: expressWinston.logger({
    transports: [new winston.transports.Console()],
    //   format: winston.format.combine(
    //     winston.format.colorize(),
    //     winston.format.json()
    //   ),
    colorize: true,
  }),
};
