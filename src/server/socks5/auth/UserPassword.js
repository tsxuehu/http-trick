var STATE_VERSION = 0,
    // server
    STATE_ULEN = 1,
    STATE_UNAME = 2,
    STATE_PLEN = 3,
    STATE_PASSWD = 4,
    // client
    STATE_STATUS = 5;

// server
var BUF_SUCCESS = Buffer.from([0x01, 0x00]),
    BUF_FAILURE = Buffer.from([0x01, 0x01]);

function authHandle(user,passworld, cb) {
    cb && cb(true)
}

module.exports = function UserPasswordAuthHandlers() {
    return {
        needUserName: true,
        METHOD: 0x02,
        server: function serverHandler(stream, cb) {
            var state = STATE_VERSION,
                user = '',
                pass = '',
                userp = 0,
                passp = 0;

            function onData(chunk) {
                var i = 0,
                    len = chunk.length,
                    left,
                    chunkLeft,
                    minLen;

                while (i < len) {
                    switch (state) {
                        /*
                          +----+------+----------+------+----------+
                          |VER | ULEN |  UNAME   | PLEN |  PASSWD  |
                          +----+------+----------+------+----------+
                          | 1  |  1   | 1 to 255 |  1   | 1 to 255 |
                          +----+------+----------+------+----------+
                        */
                        case STATE_VERSION:
                            if (chunk[i] !== 0x01) {
                                stream.removeListener('data', onData);
                                cb(new Error('Unsupported auth request version: ' + chunk[i]));
                                return;
                            }
                            ++i;
                            ++state;
                            break;
                        case STATE_ULEN:
                            var ulen = chunk[i];
                            if (ulen === 0) {
                                stream.removeListener('data', onData);
                                cb(new Error('Bad username length (0)'));
                                return;
                            }
                            ++i;
                            ++state;
                            user = Buffer.alloc(ulen);
                            userp = 0;
                            break;
                        case STATE_UNAME:
                            left = user.length - userp;
                            chunkLeft = len - i;
                            minLen = (left < chunkLeft ? left : chunkLeft);
                            chunk.copy(user,
                                userp,
                                i,
                                i + minLen);
                            userp += minLen;
                            i += minLen;
                            if (userp === user.length) {
                                user = user.toString('utf8');
                                ++state;
                            }
                            break;
                        case STATE_PLEN:
                            var plen = chunk[i];
                            if (plen === 0) {
                                stream.removeListener('data', onData);
                                cb(new Error('Bad password length (0)'));
                                return;
                            }
                            ++i;
                            ++state;
                            pass = Buffer.alloc(plen);
                            passp = 0;
                            break;
                        case STATE_PASSWD:
                            left = pass.length - passp;
                            chunkLeft = len - i;
                            minLen = (left < chunkLeft ? left : chunkLeft);
                            chunk.copy(pass,
                                passp,
                                i,
                                i + minLen);
                            passp += minLen;
                            i += minLen;
                            if (passp === pass.length) {
                                stream.removeListener('data', onData);
                                pass = pass.toString('utf8');
                                state = STATE_VERSION;
                                if (i < len)
                                    stream.unshift(chunk.slice(i));
                                authHandle(user, pass, function (success) {
                                    if (stream.writable) {
                                        if (success)
                                            stream.write(BUF_SUCCESS);
                                        else
                                            stream.write(BUF_FAILURE);
                                        cb(success, user, pass);
                                    }
                                });
                                return;
                            }
                            break;
                        // ===================================================================
                    }
                }
            }

            stream.on('data', onData);
        }
    };
};
