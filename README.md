# Node js appender for  LogDoc

`LogDoc` is a system for collecting, analyzing and storing logs.

Logs are sent via the network in any format using any protocol to `LogDoc`, where they are structured, analyzed and stored.


## @logdoc/node

## Motivation

`LogDoc` An open SDK and a simple protocol make it possible to support system formats (Syslog/Journald), industry standards (Java/Python/Go logging), monitoring (collection of metrics), and any proprietary product.

`LogDoc` uses the ClickHouse database as its main storage, which is great for analytics. But in addition, LogDoc also provides a toolkit for integration with SIEM systems, which allows you to analyze data structures on the fly, without waiting for them to enter the storage, and take appropriate actions earlier.

An important advantage of LogDoc is its flexibility and customizability. Working with data relies on structures rather than search, which significantly speeds up the overall process and allows you to get rigorous results.

By default, LogDoc implements its own role model of users and groups, but can also be integrated with any corporate access control system.

`LogDoc` supports two types of plug-ins: sink (listening to incoming data) and pipe (reacting to data in structures), which means that it is possible to implement any integration with any information system.

## Simple Usage

```js
npm i @logdoc/node
```


``` js
import LogDoc, { Protocol } from '@logdoc/node'
const logger = new LogDoc({ host: "example.host", port: 5555, protocol: Protocol.UDP,, app: 'name app', source: 'source app' })

logger.sendLog({
    msg: "Hello Wordl",
    tsrc: new Date(),
    lvl: "ERROR",
    ip: '234.234.234.23',
    pid: 12,
    src: 'Node src',
    fields: {
        custom: 'odin',
        jios: 'ddd',
        kkssss: 'ndddd'
    }
})
```

Logger creation parameters.:

| Name          | Default          | Description                                                          |
|---------------|------------------|----------------------------------------------------------------------|
| `host`         | `example.host`   | The path to the connection host where to raise LogDoc                |
| `port`        | `5555`           | Port LogDoc                                                          |
| `protocol`         | `tcp`            | Required parameter. Enum type. Valid values `tcp` or `udp` or `http` |
| `app`          | `` | An optional parameter specifying the app name.                       |



A logger accepts the following parameters message:

| Name          | Default                     | Description                                                                                                          |
|---------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------|
| `msg`         | `'info'`                    | The message body parameter. Required. If he is not. The message will not be delivered.                               |
| `tsrc`        | `new Date()`                | Source time, optional                                                                                                |
| `lvl`         | `INFO`                      | Required parameter. Enum type. Valid values `INFO` or `PANIC` or `FATAL` or `ERROR` or `WARN` or `DEBUG` or `ERROR`, |
| `ip`          | `000.000.000.00`            | An optional parameter specifying the source `IP`.                                                                      |
| `pid` | `process.pid`               | An optional parameter specifying the `pid` of the source                                                        |
| `src`      | `os.hostname()`             | Optional parameter                                                                             |
| ------------- | --------------------------- | ---------------                                                                                                      |
| `fields`         | `{}`                        | Optional parameter in which you can specify any fields              |


## Working with winston

``` js
const winston = require('winston')

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => '{level}: {message}'),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    new LogdocTransport(),
  ],
})

module.exports = logger
```

``` js

import LogDoc from '@logdoc/node'
import config from './config'

const Transport = require('winston-transport')

const normalizeLog = (level) => {
  if (level.includes('info')) {
    return 'info'
  }
  if (level.includes('panic')) {
    return 'panic'
  }
  if (level.includes('fatal')) {
    return 'fatal'
  }
  if (level.includes('error')) {
    return 'error'
  }
  if (level.includes('warn')) {
    return 'warn'
  }
  if (level.includes('debug')) {
    return 'debug'
  }
  if (level.includes('trace')) {
    return 'trace'
  }
}

class LogDocTransport extends Transport {
  constructor(opts) {
    super(opts)
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    const { message } = info
   
    logger.sendLog({
    msg: message,
    tsrc: new Date(),
    lvl: normalizeLog(info.level),
    ip: '234.234.234.23',
    pid: 12,
    src: 'Node src',
    fields: {
        custom: 'odin',
        jios: 'ddd',
        kkssss: 'ndddd'
    }
})

    callback()
  }
}

module.exports = LogDocTransport                              
```