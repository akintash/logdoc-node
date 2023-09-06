import { Protocol, Config, Level } from '../';

import HttpTransport from './http';
import UdpTransport from './udp';
import TcpTransport from './tcp';

export type Message = {
  msg: string;
  tsrc: string;
  lvl: Level;
  ip: string;
  pid: string | number;
  src: string;
  [k: string]: string | number | boolean;
};

export interface Transport {
  send: (message: Message) => void;
}

export function initTransport(config: Config): Transport {
  switch (config.protocol) {
    case Protocol.HTTP:
    case Protocol.HTTPS:
      return new HttpTransport(config);
    case Protocol.UDP:
      return new UdpTransport(config);
    case Protocol.TCP:
      return new TcpTransport(config);
    default:
      return new HttpTransport(config);
  }
}
