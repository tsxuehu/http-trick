module.exports = {
    'gateway-daily': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "gateway-daily",
        "description": "daily",
        "content": "192.168.66.241 *.youzan.com"
    },
    'gateway-qa': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "gateway-qa",
        "description": "qa",
        "content": "192.168.66.239 *.youzan.com"
    },
    'gateway-pre': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "gateway-pre",
        "description": "pre",
        "content": "192.168.66.240 *.youzan.com"
    },
}
