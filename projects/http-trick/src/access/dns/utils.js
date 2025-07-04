const consts = require('native-dns-packet').consts;
let definedTypes = [
    'A',
    'AAAA',
    'NS',
    'CNAME',
    'PTR',
    'NAPTR',
    'TXT',
    'MX',
    'SRV',
    'SOA',
    'TLSA',
];

definedTypes.forEach(function (type) {
    exports[type] = function (opts) {
        var obj = {};
        opts = opts || {};
        obj.type = consts.nameToQtype(type);
        obj.class = consts.NAME_TO_QCLASS.IN;
        Object.keys(opts).forEach(function (k) {
            if (opts.hasOwnProperty(k) && ['type', 'class'].indexOf(k) == -1) {
                obj[k] = opts[k];
            }
        });
        return obj;
    };
});
