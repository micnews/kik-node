'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = require('util');
var crypto = require('crypto');
var Message = require('./lib/message.js');
var Response = require('./lib/response.js');
var API = require('./lib/api.js');
var UserProfile = require('./lib/user-profile.js');
var KikCode = require('./lib/scan-code.js');
var uuid = require('node-uuid');
var url = require('url');

var UsernameRegex = /^[A-Za-z0-9_.]{2,32}$/;
var UuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
var BotOptionsKeys = {
    'apiDomain': true,
    'baseUrl': true,
    'scanCodePath': true,
    'incomingPath': true,
    'maxMessagePerBatch': true,
    'manuallySendReadReceipts': true,
    'receiveReadReceipts': true,
    'receiveDeliveryReceipts': true,
    'receiveIsTyping': true,
    'username': true,
    'apiKey': true,
    'skipSignatureCheck': true
};

/**
 *  A callback
 *  @callback MessageHandlerCallback
 *  @param {IncomingMessage} message
 *  @param {Bot} bot
 *  @param {function} next
 */

function isSignatureValid(body, apiKey, signature) {
    if (!signature) {
        return false;
    }

    var expected = crypto.createHmac('sha1', apiKey).update(new Buffer(body)).digest('hex').toLowerCase();

    return expected === signature.toLowerCase();
}

function prepareMessage(originalMessage, to, chatId) {
    var message = originalMessage;
    var result = {};

    // allow easy-mode use case where the user just sent along text
    if (util.isString(originalMessage)) {
        message = { 'type': 'text', 'body': originalMessage };
    }

    // serialize a Message object down to its wire form
    if (util.isFunction(originalMessage.toJSON)) {
        message = originalMessage.toJSON();
    }

    // make a copy of the message in the degenerate case so
    // we don't modify someone else along the way and add on
    // the routing information
    _extends(result, message, { 'to': to });

    if (chatId) {
        result.chatId = chatId;
    }

    return result;
}

/**
 *  @class IncomingMessage
 *  This is a test
 */

var IncomingMessage = function (_Message) {
    _inherits(IncomingMessage, _Message);

    function IncomingMessage(bot) {
        _classCallCheck(this, IncomingMessage);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IncomingMessage).call(this, ''));

        _this.bot = bot;
        return _this;
    }

    /**
     *  @param {Message|array.<Message>}
     *  @return {promise.<object>}
     */


    _createClass(IncomingMessage, [{
        key: 'reply',
        value: function reply(messages) {
            this.finish();

            return this.bot.send(messages, this.from, this.chatId);
        }

        /**
         *  @return {promise.<object>}
         */

    }, {
        key: 'markRead',
        value: function markRead() {
            return this.reply(Message.readReceipt([this.id]));
        }

        /**
         *  @return {promise.<object>}
         */

    }, {
        key: 'startTyping',
        value: function startTyping() {

            return this.reply(Message.isTyping(true));
        }

        /**
         *  @return {promise.<object>}
         */

    }, {
        key: 'stopTyping',
        value: function stopTyping() {
            return this.reply(Message.isTyping(false));
        }

        /**
         *  @method
         */

    }, {
        key: 'ignore',
        value: function ignore() {
            this.finish();
        }
    }]);

    return IncomingMessage;
}(Message);

/**
 *  @class Bot
 *  This is a test
 *  @constructor
 *  @param {string} options.username
 *  @param {string} options.apiKey
 *  @param {string} [options.baseUrl]
 *  @param {string} [options.incomingPath]="/incoming" Set true to enable polling or set options
 *  @param {boolean} [options.manuallySendReadReceipts]=false
 *  @param {boolean} [options.receiveReadReceipts]=false
 *  @param {boolean} [options.receiveDeliveryReceipts]=false
 *  @param {boolean} [options.receiveIsTyping]=false
 *  @see https://bots.kik.com
 */


var Bot = function () {
    function Bot(options) {
        var _this2 = this;

        _classCallCheck(this, Bot);

        // default configuration
        this.apiDomain = 'https://api.kik.com';
        this.scanCodePath = '/kik-code.png';
        this.incomingPath = '/incoming';
        this.maxMessagePerBatch = 25;

        this.manuallySendReadReceipts = false;
        this.receiveReadReceipts = false;
        this.receiveDeliveryReceipts = false;
        this.receiveIsTyping = false;

        // override any specified configuration
        Object.keys(options).forEach(function (key) {
            // only copy over the appropriate keys
            if (!BotOptionsKeys[key]) {
                return;
            }

            _this2[key] = options[key];
        });

        // validate options
        var errors = [];

        if (!this.username || !this.username.match(UsernameRegex)) {
            errors.push('Option "username" must be a valid Kik username');
        }

        if (!this.apiKey || !this.apiKey.match(UuidRegex)) {
            errors.push('Option "apiKey" must be a Kik API key, see http://dev.kik.com/');
        }

        if (!this.incomingPath || !util.isString(this.incomingPath)) {
            errors.push('Option "incomingPath" must be path, see http://dev.kik.com/');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        this.stack = [];
        this.pendingMessages = [];
        this.pendingFlush = null;
    }

    _createClass(Bot, [{
        key: 'updateBotConfiguration',
        value: function updateBotConfiguration() {
            return API.updateConfiguration(this.apiDomain, this.username, this.apiKey, this.configuration);
        }
    }, {
        key: 'getBotConfiguration',
        value: function getBotConfiguration() {
            return API.getConfiguration(this.apiDomain, this.username, this.apiKey);
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'use',
        value: function use(handler) {
            this.stack.push(handler);
            return this;
        }

        /**
         *  @param {string|regexp} [text]
         *  @param {MessageHandlerCallback} handler
         *  @example
         *  bot.onTextMessage((incoming, bot) => {
         *      // reply handles the message and stops other handlers
         *      // from being called for this message
         *      incoming.reply(`Hi I'm ${bot.username}`);
         *  });
         *  @example
         *  bot.onTextMessage((incoming, next) => {
         *      if (incoming.body !== 'Hi') {
         *          // we only handle welcoming, let someone else deal with this
         *          // message
         *          return next();
         *      }
         *
         *      // say hello...
         *  });
         *  @example
         *  bot.onTextMessage(/^hi|hello|bonjour$/i, (incoming, next) => {
         *      // say hello...
         *  });
         */

    }, {
        key: 'onTextMessage',
        value: function onTextMessage(text, handler) {
            var isString = util.isString(text);
            var isRegExp = util.isRegExp(text);

            // deal with optional param
            if (!handler && util.isFunction(text)) {
                handler = text;
            }

            this.use(function (incoming, next) {
                // if this isn't a text message, give up
                // if we have text to match and it doesn't, give up
                // if we have a reg ex to match and it doesn't, give up
                // otherwise this is ours }:-)
                if (incoming.isTextMessage()) {
                    if (!isString && !isRegExp || isString && incoming.body === text) {
                        handler(incoming, next);
                    } else if (isRegExp && util.isString(incoming.body)) {
                        var matches = incoming.body.match(text);

                        if (matches) {
                            incoming.matches = matches;
                            handler(incoming, next);
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onLinkMessage',
        value: function onLinkMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isLinkMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onPictureMessage',
        value: function onPictureMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isPictureMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onVideoMessage',
        value: function onVideoMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isVideoMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onStartChattingMessage',
        value: function onStartChattingMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isStartChattingMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onScanDataMessage',
        value: function onScanDataMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isScanDataMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onStickerMessage',
        value: function onStickerMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isStickerMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onIsTypingMessage',
        value: function onIsTypingMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isIsTypingMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onDeliveryReceiptMessage',
        value: function onDeliveryReceiptMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isDeliveryReceiptMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  @param {MessageHandlerCallback} handler
         */

    }, {
        key: 'onReadReceiptMessage',
        value: function onReadReceiptMessage(handler) {
            this.use(function (incoming, next) {
                if (incoming.isReadReceiptMessage()) {
                    handler(incoming, next);
                } else {
                    next();
                }
            });
            return this;
        }

        /**
         *  Creates a Kik Code with the intended options and returns the
         *  URL of the Kik Code image. If the options specify a data Kik Code
         *  this will hit the Kik Code service and store that data for you.
         *  @param {string|object} [options.data] The data to be sent back to this bot after
         *                                        the user scans
         *  @param {number} [options.width] Width of the Kik code in the PNG image
         *  @param {number} [options.height] Height of the Kik code in the PNG image
         *  @param {number} [options.size] Helper for the width and height in the PNG image
         *  @param {number} [options.color] The color which the user will see after scanning.
         *                                  See {KikCode.Colors}
         *  @return {promise.<string>}
         **/

    }, {
        key: 'getKikCodeUrl',
        value: function getKikCodeUrl(options) {
            var result = void 0;

            options = options || {};

            if (!options.data) {
                result = API.usernameScanCode(this.username, options);
            } else {
                result = API.dataScanCode(this.apiDomain, this.username, options);
            }

            return result.then(function (response) {
                return response.url;
            });
        }

        /**
         *  @return {promise.<UserProfile>}
         **/

    }, {
        key: 'getUserProfile',
        value: function getUserProfile(username) {
            var _this3 = this;

            var fetch = function fetch(username) {
                return API.userInfo(_this3.apiDomain, _this3.username, _this3.apiKey, username).then(function (result) {
                    return new UserProfile(username, result);
                });
            };

            if (util.isArray(username)) {
                return Promise.all(username.map(fetch));
            }

            return fetch(username);
        }

        /**
         *  @param {array} messages
         *  @param {array} recipients
         */

    }, {
        key: 'broadcast',
        value: function broadcast(messages, recipients) {
            if (!recipients) {
                throw 'You must specify a recipient to send a message';
            }

            // force recipients to be an array
            if (!!recipients && !util.isArray(recipients)) {
                recipients = [recipients];
            }

            // force messages to be an array
            if (!!messages && !util.isArray(messages)) {
                messages = [messages];
            }

            var pendingMessages = [];

            // generate a message object for every receipient and every message
            recipients.forEach(function (recipient) {
                messages.forEach(function (message) {
                    message = prepareMessage(message, recipient);

                    pendingMessages.push(message);
                });
            });

            return API.broadcastMessages(this.apiDomain, this.username, this.apiKey, pendingMessages);
        }

        /**
         *  @param {array} messages
         *  @param {string} recipient
         *  @param {string} [chatId]
         */

    }, {
        key: 'send',
        value: function send(messages, recipient, chatId) {
            var _this4 = this;

            if (!recipient) {
                throw 'You must specify a recipient to send a message';
            }

            // force messages to be an array
            if (!!messages && !util.isArray(messages)) {
                messages = [messages];
            }

            messages.forEach(function (message) {
                // transform each message to allow for text and custom
                // messages
                message = prepareMessage(message, recipient, chatId);

                _this4.pendingMessages.push(message);
            });

            return this.flush();
        }

        /**
         *  Handles the incoming requests for messages
         *  configuration.
         */

    }, {
        key: 'incoming',
        value: function incoming() {
            var _this5 = this;

            var stack = this.stack;

            function handle(incoming, done) {
                var index = 0;
                var finished = false;
                var finish = function finish() {
                    if (!finished) {
                        finished = true;

                        if (done) {
                            done();
                        }
                    }
                };

                var advance = function advance() {
                    var layer = stack[index++];

                    if (!layer) {
                        finish();

                        return;
                    }

                    layer(incoming, advance);
                };

                incoming.finish = finish;

                advance();
            }

            return function (req, res, next) {
                if (req.url.indexOf(_this5.scanCodePath) === 0) {
                    // the kik code image only accepts GET requests
                    // requests, reject everything else
                    if (req.method !== 'GET') {
                        res.statusCode = 405;

                        return res.end(_this5.scanCodePath + ' only accepts GET');
                    }

                    var urlComponents = url.parse(req.url, true);
                    var query = urlComponents.query;

                    query.width = query.width || 512;
                    query.height = query.height || 512;

                    _this5.getKikCodeUrl(query).then(function (kikCodeUrl) {
                        res.redirect(301, kikCodeUrl);
                    });
                } else if (req.url === _this5.incomingPath) {
                    var _ret = function () {
                        // the incoming route for the bot only accepts POST
                        // requests, reject everything else
                        if (req.method !== 'POST') {
                            res.statusCode = 405;

                            return {
                                v: res.end(_this5.incomingPath + ' only accepts POST')
                            };
                        }

                        var body = '';

                        req.on('data', function (chunk) {
                            body += chunk;
                        });

                        req.on('end', function () {
                            if (!_this5.skipSignatureCheck) {
                                if (!isSignatureValid(body, _this5.apiKey, req.headers['x-kik-signature'])) {
                                    // the request was not sent with a valid signature, so we reject it
                                    res.statusCode = 403;

                                    return res.end('Invalid signature');
                                }
                            }

                            var parsed = void 0;

                            try {
                                parsed = JSON.parse(body);
                            } catch (ex) {
                                res.statusCode = 400;

                                return res.end('Invalid body');
                            }

                            if (!parsed.messages || !util.isArray(parsed.messages)) {
                                res.statusCode = 400;

                                return res.end('Invalid body');
                            }

                            var remainingMessages = parsed.messages.length + 1;

                            function doNothing() {}

                            parsed.messages.forEach(function (json) {
                                handle(new IncomingMessage(_this5).parse(json), doNothing);
                            });

                            res.statusCode = 200;

                            return res.end('OK');
                        });
                    }();

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                } else {
                    if (next) {
                        next();
                    }
                }
            };
        }
    }, {
        key: 'flush',
        value: function flush(forced) {
            var _this6 = this;

            return new Promise(function (fulfill, reject) {
                var pendingMessages = _this6.pendingMessages;

                if (!forced) {
                    if (!_this6.pendingFlush) {
                        _this6.pendingFlush = true;

                        process.nextTick(function () {
                            return _this6.flush(true).then(fulfill, reject);
                        });
                    }

                    return;
                }

                _this6.pendingFlush = false;
                _this6.pendingMessages = [];

                var batches = {};

                pendingMessages.forEach(function (message) {
                    var to = message.to;
                    var batch = batches[to];

                    if (!batch) {
                        batch = batches[to] = [];
                    }

                    batch.push(message);
                });

                var promises = [];

                Object.keys(batches).forEach(function (key) {
                    var batch = batches[key];

                    while (batch.length > 0) {
                        // keep the remainder around to send after
                        var nextBatch = batch.slice(_this6.maxMessagePerBatch, batch.length);

                        // trim the batch to the max limit
                        batch.length = Math.min(batch.length, _this6.maxMessagePerBatch);

                        promises.push(API.sendMessages(_this6.apiDomain, _this6.username, _this6.apiKey, batch));

                        batch = nextBatch;
                    }
                });

                Promise.all(promises).then(fulfill, reject);
            });
        }
    }, {
        key: 'configuration',
        get: function get() {
            return {
                webhook: url.resolve(this.baseUrl, this.incomingPath),
                features: {
                    manuallySendReadReceipts: !!this.manuallySendReadReceipts,
                    receiveReadReceipts: !!this.receiveReadReceipts,
                    receiveDeliveryReceipts: !!this.receiveDeliveryReceipts,
                    receiveIsTyping: !!this.receiveIsTyping
                }
            };
        }
    }]);

    return Bot;
}();

Bot.Message = Message;
Bot.KikCode = KikCode;
Bot.API = API;
Bot.UserProfile = UserProfile;
Bot.Response = Response;

module.exports = Bot;