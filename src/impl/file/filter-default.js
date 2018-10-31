module.exports = [
    {
        "name": "将deviceId放入header中x-forwarded-for",
        "key": "cbd8a63e-9afe-486c-81ea-01d6e5ea1c5b",
        "method": "",
        "match": "",
        "checked": true,
        "readonly": true,
        "default": true,
        "actionList": [
            {
                "type": "addRequestHeader",
                "data": {
                    "target": "",
                    "dataId": "",
                    "modifyResponseType": "",
                    "callbackName": "",
                    "cookieKey": "",
                    "cookieValue": "",
                    "reqHeaderKey": "x-forwarded-for",
                    "reqHeaderValue": "$deviceId",
                    "resHeaderKey": "",
                    "resHeaderValue": "",
                    "queryKey": "",
                    "queryValue": "",
                    "modifyRequestScript": "",
                    "modifyResponseScript": ""
                }
            }
        ]
    }
]

