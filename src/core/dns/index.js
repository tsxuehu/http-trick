const dgram = require('dgram')
const EventEmitter = require('events').EventEmitter
const NDP = require('native-dns-packet');
const DNSUtils = require('./utils');

module.exports.createServer = function (port = 53, addr) {

    let dnsServerEvent = new EventEmitter()
    this.server = dgram.createSocket('udp4')

    this.server.on('error', error => {

        dnsServerEvent.emit('error', error)
        return dnsServerEvent

    })

    this.server.on('listening', () => {

        dnsServerEvent.emit('listening', this.server)
        return dnsServerEvent

    })

    this.server.on('message', (message, rinfo) => {
        const query = NDP.parse(message);
        let domain = query.question[0].name;

        let respond = buf => {
            this.server.send(buf, 0, buf.length, rinfo.port, rinfo.address)
        }

        dnsServerEvent.emit('message', domain, ip => {
            let response = new NDP();
            response.header.id = query.header.id;
            response.header.qr = 1;
            response.question = query.question;
            response.answer.push(DNSUtils.A({
                name: domain,
                address: ip,
                ttl: 600,
            }));
            let buff = new Buffer(512);
            NDP.write(buff, response);
            respond(buff);

        }, proxy => {

            let proxySoket = dgram.createSocket('udp4')

            proxySoket.on('error', err => {
                dnsServerEvent.emit('error', err)
            });

            proxySoket.on('message', response => {
                respond(response);
                proxySoket.close()
            });

            proxySoket.send(message, 0, message.length, 53, proxy)

        });

        return dnsServerEvent

    });

    if (addr) {
        this.server.bind(port, addr)
    } else {
        this.server.bind(port)
    }

    return dnsServerEvent

}

