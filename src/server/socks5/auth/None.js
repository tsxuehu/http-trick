module.exports = function NoneAuthHandlers() {
    return {
        needUserName: false,
        METHOD: 0x00,
        server: function serverHandler(stream, cb) {
            cb(true, '', '');
        }
    };
};
