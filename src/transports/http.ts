import { Message } from '.';
import { Config } from '../';
import * as http from 'http';
import * as https from 'https';
import * as qs from 'querystring';
class HttpTransport {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  send(message: Message) {
    const postData = qs.stringify(message);

    const options = {
      method: 'POST',
      hostname: this.config.host,
      port: this.config.port,
      path: '/',
      headers: {
        'Content-Length': postData.length,
      },
      maxRedirects: 20,
    };

    const client = this.config.protocol === 'https' ? https : http;

    const req = client.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('error', function (error) {
        console.error(error);
      });
    });

    req.write(postData);

    req.end();
  }
}

export default HttpTransport;
