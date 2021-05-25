import os from 'os';
import Transport from 'winston-transport';
import { defaultParser, defaultParserJSON, defaultMaxListeners } from './defaults';
import { MESSAGE } from './constants';

export default class ArrayTransport extends Transport {
    constructor(options = {}) {
        super(options);
        this.name = options.name || this.constructor.name;
        this.eol = options.eol || os.EOL;
        this.array = options.array || [];
        this.levels = options.levels || {};
        this.parser = options.parser || options.json && defaultParserJSON || defaultParser;
        this.limit = options.limit;
        this.setMaxListeners(options.maxListeners || defaultMaxListeners);
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        const message = info[MESSAGE];

        this.array.push(this.parser(message));
        if (this.limit && this.array.length > this.limit) this.array.shift();
        callback();
    }
}
