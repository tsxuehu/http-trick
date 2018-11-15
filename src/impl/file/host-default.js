module.exports = {
    'daily': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "daily",
        "description": "daily",
        "content": "192.168.66.241 *.youzan.com"
    },
    'qa': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "qa",
        "description": "qa",
        "content": "192.168.66.239 *.youzan.com"
    },
    'pre': {
        "meta": {
            "local": true
        },
        "checked": false,
        "readonly": false,
        "default": true,
        "name": "pre",
        "description": "pre",
        "content": "192.168.66.240 *.youzan.com"
    },
}
