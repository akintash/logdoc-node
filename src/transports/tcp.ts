import { Config } from '../';
import { Message } from './';
import * as net from 'net';

class TcpTransport {
  private client: net.Socket;
  private config: Config;
  constructor(config: Config) {
    this.client = new net.Socket();
    this.config = config;
  }

  #writeInt(value: string | number | boolean) {
    const size = Buffer.byteLength(`${value}`);
    return Buffer.alloc(4).write(`${size}`);
  }

  #writeComplexPair(
    key: string,
    value: string | number | boolean,
    buffer: number[],
  ) {
    const newBuffer = [] as number[];
    newBuffer
      .concat(Array.from(Buffer.from(key, 'utf8')))
      .concat(Array.from(Buffer.from('\n', 'utf8')))
      .concat(this.#writeInt(value))
      .concat(Array.from(Buffer.from(`${value}`, 'utf8')));
    return buffer.concat(newBuffer);
  }
  #writeSimplePair(
    key: string,
    value: string | number | boolean,
    buffer: number[],
  ) {
    return buffer.concat(
      Array.from(Buffer.from(key + '=' + value + '\n', 'utf8')),
    );
  }

  // TODO Сделадь мультистрочные
  #writePair(key: string, value: string | number | boolean, buffer: number[]) {
    // if (value && typeof value === "string" && value?.indexOf('\n')) {
    //     return this.#writeComplexPair(key, value, buffer)
    // }else {
    return this.#writeSimplePair(key, value, buffer);
    // }
  }

  #prepareTCPMessage(message: Message): number[] {
    let arrayOfBytes = [6, 3];
    for (const key in message) {
      arrayOfBytes = this.#writePair(key, message[key], arrayOfBytes);
    }
    arrayOfBytes = arrayOfBytes.concat(Array.from(Buffer.from('\n', 'utf8')));
    return arrayOfBytes;
  }

  send(message: Message) {
    const readyMessage = this.#prepareTCPMessage(message);
    this.client.connect(this.config.port, this.config.host, () => {
      this.client.write(new Uint8Array(readyMessage));
      this.client.destroy();
    });

    this.client.on('data', () => {
      this.client.destroy();
    });

    this.client.on('close', () => {
      console.log('🤡');
    });
    return;
  }
}
export default TcpTransport;
