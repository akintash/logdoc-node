import * as os from 'os';
import { dateToLogDocTime } from './utils/formatting';
import { Transport, Message, initTransport } from './transports';

export type Fields = {
  [k: string]: string | number | boolean;
};

export enum Level {
  ERROR = 'error',
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  SYSTEM = 'system',
}

export type LogMain = {
  msg: string;
  tsrc?: Date;
  lvl: Level;
  ip?: string;
  pid?: string | number;
  src?: string;
  fields?: Fields;
};
export enum Protocol {
  HTTP = 'http',
  HTTPS = 'https',
  UDP = 'udp',
  TCP = 'tcp',
}

export type Config = {
  host: string;
  port: number;
  protocol: Protocol;
  app: string;
  source?: string;
};
class LogDoc {
  private config: Config;
  private transport: Transport;
  constructor(config: Config) {
    this.transport = initTransport(config);
    this.config = config;
  }

  #makeMessage({ msg, tsrc, lvl, ip, pid, src, fields }: LogMain): Message {
    const message = {
      msg,
      app: this.config.app,
      tsrc: tsrc
        ? `${dateToLogDocTime(tsrc)}`
        : `${dateToLogDocTime(new Date())}`,
      lvl: lvl || Level.INFO,
      ip: ip || '000.000.000.00',
      pid: pid || process.pid,
      src: src || os.hostname(),
      ...fields,
    };

    return message;
  }

  sendLog(args: LogMain) {
    const message = this.#makeMessage(args);
    this.transport.send(message);
    return;
  }
}
export default LogDoc;
