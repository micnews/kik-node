'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('util');
var rp = require('request-promise');

var API_REMOTE_SCAN_CODE_CREATE = '/v1/codes';
var API_MESSAGES_PATH_BASE = '/v1/';
var API_USER_INFO_PATH = '/v1/user/';
var API_CONFIG_PATH = '/v1/config';

var DEFAULT_SCAN_CODE_WIDTH = 1200;
var DEFAULT_SCAN_CODE_HEIGHT = 1200;

function _sendMessages(endpoint, domain, username, apiKey, messages) {
    var data = { 'messages': messages };

    return rp({
        method: 'POST',
        uri: domain + API_MESSAGES_PATH_BASE + endpoint,
        body: data,
        json: true,
        auth: { user: username, pass: apiKey },
        headers: { 'Content-Type': 'application/json' }
    });
}

var API = function () {
    function API() {
        _classCallCheck(this, API);
    }

    _createClass(API, null, [{
        key: 'dataScanCode',
        value: function dataScanCode(domain, botUsername, options) {
            var payload = {
                'type': 'username',
                'payload': {
                    'username': botUsername, 'nonce': 0, 'data': JSON.stringify(options.data)
                }
            };

            return rp({
                method: 'POST',
                uri: domain + API_REMOTE_SCAN_CODE_CREATE,
                body: payload,
                json: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return {
                    id: response.id,
                    url: 'https://scancode.kik.com/api/v1/images/remote/' + response.id + '/' + (options.width || options.size || DEFAULT_SCAN_CODE_WIDTH) + 'x' + (options.height || options.size || DEFAULT_SCAN_CODE_HEIGHT) + '.png' + (options.color ? '?c=' + options.color : '')
                };
            });
        }
    }, {
        key: 'updateConfiguration',
        value: function updateConfiguration(domain, botUsername, apiKey, configuration) {
            return rp({
                method: 'POST',
                uri: domain + API_CONFIG_PATH,
                body: configuration,
                json: true,
                auth: {
                    user: botUsername,
                    pass: apiKey
                }
            });
        }
    }, {
        key: 'getConfiguration',
        value: function getConfiguration(domain, botUsername, apiKey) {
            return rp({
                method: 'GET',
                uri: domain + API_CONFIG_PATH,
                json: true,
                auth: {
                    user: botUsername,
                    pass: apiKey
                }
            });
        }
    }, {
        key: 'usernameScanCode',
        value: function usernameScanCode(botUsername, options) {
            var url = 'https://scancode.kik.com/api/v1/images/username/' + botUsername + '/' + (options.width || options.size || DEFAULT_SCAN_CODE_WIDTH) + 'x' + (options.height || options.size || DEFAULT_SCAN_CODE_HEIGHT) + '.png' + (options.color ? '?c=' + options.color : '');
            return Promise.resolve({ url: url });
        }
    }, {
        key: 'userInfo',
        value: function userInfo(domain, botUsername, apiKey, username) {
            return rp({
                method: 'GET',
                uri: domain + API_USER_INFO_PATH + username,
                json: true,
                auth: {
                    user: botUsername,
                    pass: apiKey
                }
            });
        }
    }, {
        key: 'sendMessages',
        value: function sendMessages(domain, username, apiKey, messages) {
            return _sendMessages('message', domain, username, apiKey, messages);
        }
    }, {
        key: 'broadcastMessages',
        value: function broadcastMessages(domain, username, apiKey, messages) {
            return _sendMessages('broadcast', domain, username, apiKey, messages);
        }
    }]);

    return API;
}();

module.exports = API;