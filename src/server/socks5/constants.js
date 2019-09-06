exports.CMD = {
    CONNECT: 0x01,
    BIND: 0x02,
    UDP: 0x03 // 请求udp协议通信， 未实UDP通信
};

exports.ATYP = {
    IPv4: 0x01,
    NAME: 0x03,
    IPv6: 0x04
};

exports.REP = {
    SUCCESS: 0x00, // succeeded
    GENFAIL: 0x01, // general SOCKS server failure
    DISALLOW: 0x02, // connection not allowed by ruleset
    NETUNREACH: 0x03, // Network unreachable
    HOSTUNREACH: 0x04, // Host unreachable
    CONNREFUSED: 0x05, // Connection refused
    TTLEXPIRED: 0x06, // TTL expired
    CMDUNSUPP: 0x07, // Command not supported
    ATYPUNSUPP: 0x08 // Address type not supported
};
