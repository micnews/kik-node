'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('util');
var Response = require('./response.js');

/**
 * @class Message
 * This is a test
 */

var Message = function () {
    function Message(type) {
        _classCallCheck(this, Message);

        this._state = {
            type: type
        };
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#text
     *  @return {Message}
     */


    _createClass(Message, [{
        key: 'isTextMessage',


        /**
         *  See https://dev.kik.com/#/docs/messaging#text
         *  @return {boolean}
         */
        value: function isTextMessage() {
            return this.type === 'text';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {boolean}
         */

    }, {
        key: 'isLinkMessage',
        value: function isLinkMessage() {
            return this.type === 'link';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#picture
         *  @return {boolean}
         */

    }, {
        key: 'isPictureMessage',
        value: function isPictureMessage() {
            return this.type === 'picture';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {boolean}
         */

    }, {
        key: 'isVideoMessage',
        value: function isVideoMessage() {
            return this.type === 'video';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#start-chatting
         *  @return {boolean}
         */

    }, {
        key: 'isStartChattingMessage',
        value: function isStartChattingMessage() {
            return this.type === 'start-chatting';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#scan-data
         *  @return {boolean}
         */

    }, {
        key: 'isScanDataMessage',
        value: function isScanDataMessage() {
            return this.type === 'scan-data';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#sticker
         *  @return {boolean}
         */

    }, {
        key: 'isStickerMessage',
        value: function isStickerMessage() {
            return this.type === 'sticker';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#is-typing
         *  @return {boolean}
         */

    }, {
        key: 'isIsTypingMessage',
        value: function isIsTypingMessage() {
            return this.type === 'is-typing';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receipts
         *  @return {boolean}
         */

    }, {
        key: 'isDeliveryReceiptMessage',
        value: function isDeliveryReceiptMessage() {
            return this.type === 'delivery-receipt';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receipts
         *  @return {boolean}
         */

    }, {
        key: 'isReadReceiptMessage',
        value: function isReadReceiptMessage() {
            return this.type === 'read-receipt';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#friend-picker
         *  @return {boolean}
         */

    }, {
        key: 'isFriendPickerMessage',
        value: function isFriendPickerMessage() {
            return this.type === 'friend-picker';
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#mentions
         *  @return {boolean}
         */

    }, {
        key: 'isMention',
        value: function isMention() {
            return !!this.mention;
        }

        /**
         *  Constructs a JSON payload ready to be sent to the
         *  bot messaging API
         *  @return {object}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            var json = void 0;
            var state = this._state;

            if (state.type === 'text') {
                json = {
                    type: 'text',
                    body: '' + state.body
                };
            } else if (state.type === 'is-typing') {
                json = {
                    type: 'is-typing',
                    isTyping: !!state.isTyping
                };
            } else if (state.type === 'read-receipt') {
                json = {
                    type: 'read-receipt',
                    messageIds: state.messageIds
                };
            } else {
                if (state.type === 'picture') {
                    json = {
                        type: 'picture',
                        picUrl: '' + state.picUrl
                    };

                    if (!util.isUndefined(state.attribution)) {
                        json.attribution = {
                            name: '' + state.attribution.name,
                            iconUrl: '' + state.attribution.iconUrl
                        };
                    }
                } else if (state.type === 'link') {
                    json = {
                        type: 'link',
                        url: '' + state.url
                    };

                    if (!util.isUndefined(state.attribution)) {
                        json.attribution = {
                            name: '' + state.attribution.name,
                            iconUrl: '' + state.attribution.iconUrl
                        };
                    }
                } else if (state.type === 'video') {
                    json = {
                        type: 'video',
                        videoUrl: '' + state.videoUrl
                    };

                    if (!util.isUndefined(state.attribution)) {
                        json.attribution = {
                            name: '' + state.attribution.name,
                            iconUrl: '' + state.attribution.iconUrl
                        };
                    }

                    if (!util.isUndefined(state.loop)) {
                        json.loop = !!state.loop;
                    }

                    if (!util.isUndefined(state.muted)) {
                        json.muted = !!state.muted;
                    }

                    if (!util.isUndefined(state.autoplay)) {
                        json.autoplay = !!state.autoplay;
                    }
                }

                if (util.isString(state.picUrl)) {
                    json.picUrl = '' + state.picUrl;
                }

                if (util.isString(state.title)) {
                    json.title = '' + state.title;
                }

                if (util.isString(state.text)) {
                    json.text = '' + state.text;
                }

                if (!util.isUndefined(state.noSave)) {
                    json.noSave = !!state.noSave;
                }

                if (!util.isUndefined(state.kikJsData)) {
                    json.kikJsData = state.kikJsData;
                }

                if (!util.isUndefined(state.noForward)) {
                    json.noForward = !!state.noForward;
                }
            }

            if (!util.isUndefined(state.typeTime)) {
                json.typeTime = +state.typeTime;
            }

            if (!util.isUndefined(state.delay)) {
                json.delay = +state.delay;
            }

            if (state.keyboards && state.keyboards.length !== 0) {
                json.keyboards = state.keyboards;
            }

            if (state.mention) {
                json.mention = '' + state.mention;
            }

            return json;
        }
    }, {
        key: 'parse',
        value: function parse(json) {
            var _this = this;

            Object.keys(json).forEach(function (key) {
                _this._state[key] = json[key];
            });

            return this;
        }

        /**
         *  Constructs a new {Message} object from a JSON-encoded payload
         *  See https://dev.kik.com/#/docs
         *  @param {object} json
         *  @return {Message}
         */

    }, {
        key: 'addTextResponse',


        /**
         *  See https://dev.kik.com/#/docs/messaging#keyboards
         *  @param {string} text
         *  @return {Message}
         */
        value: function addTextResponse(text) {
            var _this2 = this;

            if (util.isArray(text)) {
                text.forEach(function (response) {
                    _this2.addTextResponse(response);
                });

                return this;
            }

            var keyboards = this._state.keyboards || [];
            var responses = [];
            var updateExistingKeyboard = false;

            // add to an existing keyboard if all properties match
            keyboards.forEach(function (keyboard) {
                if (util.isUndefined(keyboard.to) && util.isUndefined(keyboard.hidden)) {
                    responses = keyboard.responses;
                    updateExistingKeyboard = true;
                }
            });

            for (var i = 0, l = arguments.length; i < l; ++i) {
                responses.push({ type: 'text', body: '' + arguments[i] });
            }

            if (!updateExistingKeyboard) {
                keyboards.push({
                    type: 'suggested',
                    responses: responses
                });
            }

            this._state.keyboards = keyboards;

            return this;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#keyboards
         *  @param {array} suggestions
         *  @param {boolean} [isHidden]
         *  @param {string} [user]
         *  @return {Message}
         */

    }, {
        key: 'addResponseKeyboard',
        value: function addResponseKeyboard(suggestions, isHidden, user) {
            var keyboards = this._state.keyboards || [];
            var responses = [];
            var updateExistingKeyboard = false;

            if (!util.isArray(suggestions)) {
                suggestions = [suggestions];
            }

            // add to an existing keyboard if all properties match
            keyboards.forEach(function (keyboard) {
                if (keyboard.to === user && keyboard.hidden === isHidden) {
                    responses = keyboard.responses;
                    updateExistingKeyboard = true;
                }
            });

            suggestions.forEach(function (response) {
                if (typeof response === 'string') {
                    responses.push(Response.text(response));
                } else {
                    responses.push(response);
                }
            });

            if (!updateExistingKeyboard) {
                var keyboard = {
                    type: 'suggested',
                    responses: responses
                };

                if (!util.isUndefined(isHidden)) {
                    keyboard.hidden = !!isHidden;
                }

                if (!util.isUndefined(user)) {
                    keyboard.to = '' + user;
                }

                keyboards.push(keyboard);
            }

            this._state.keyboards = keyboards;

            return this;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receiving-messages
         *  @return {string}
         */

    }, {
        key: 'setKikJsData',


        /**
         *  @param {object} kikJsData
         *  @return {Message}
         */
        value: function setKikJsData(kikJsData) {
            this._state.kikJsData = kikJsData;
            return this;
        }

        /**
         *  @param {string} picUrl
         *  @return {Message}
         */

    }, {
        key: 'setPicUrl',
        value: function setPicUrl(picUrl) {
            this._state.picUrl = picUrl;
            return this;
        }

        /**
         *  @param {boolean} noForward
         *  @return {Message}
         */

    }, {
        key: 'setNoForward',
        value: function setNoForward(noForward) {
            this._state.noForward = noForward;
            return this;
        }

        /**
         *  @param {boolean} isTyping
         *  @return {Message}
         */

    }, {
        key: 'setIsTyping',
        value: function setIsTyping(isTyping) {
            this._state.isTyping = isTyping;
            return this;
        }

        /**
         *  @param {array} messageIds
         *  @return {Message}
         */

    }, {
        key: 'setMessageIds',
        value: function setMessageIds(messageIds) {
            this._state.messageIds = messageIds;
            return this;
        }

        /**
         *  @param {string} body
         *  @return {Message}
         */

    }, {
        key: 'setBody',
        value: function setBody(body) {
            this._state.body = body;
            return this;
        }

        /**
         *  @param {string} text
         *  @return {Message}
         */

    }, {
        key: 'setText',
        value: function setText(text) {
            this._state.text = text;
            return this;
        }

        /**
         *  @param {string} title
         *  @return {Message}
         */

    }, {
        key: 'setTitle',
        value: function setTitle(title) {
            this._state.title = title;
            return this;
        }

        /**
         *  @param {string} url
         *  @return {Message}
         */

    }, {
        key: 'setUrl',
        value: function setUrl(url) {
            this._state.url = url;
            return this;
        }

        /**
         *  @param {string} videoUrl
         *  @return {Message}
         */

    }, {
        key: 'setVideoUrl',
        value: function setVideoUrl(videoUrl) {
            this._state.videoUrl = videoUrl;
            return this;
        }

        /**
         *  @param {number} delay
         *  @return {Message}
         */

    }, {
        key: 'setDelay',
        value: function setDelay(delay) {
            this._state.delay = delay;
            return this;
        }

        /**
         *  @param {number} typeTime
         *  @return {Message}
         */

    }, {
        key: 'setTypeTime',
        value: function setTypeTime(typeTime) {
            this._state.typeTime = typeTime;
            return this;
        }

        /**
         *  @param {string} attributionName
         *  @return {Message}
         */

    }, {
        key: 'setAttributionName',
        value: function setAttributionName(attributionName) {
            this._state.attribution = this._state.attribution || {};
            this._state.attribution.name = attributionName;

            return this;
        }

        /**
         *  @param {string} attributionIcon
         *  @return {Message}
         */

    }, {
        key: 'setAttributionIcon',
        value: function setAttributionIcon(attributionIcon) {
            this._state.attribution = this._state.attribution || {};
            this._state.attribution.iconUrl = attributionIcon;

            return this;
        }

        /**
         *  @param {boolean} loop
         *  @return {Message}
         */

    }, {
        key: 'setLoop',
        value: function setLoop(loop) {
            this._state.loop = loop;
            return this;
        }

        /**
         *  @param {boolean} muted
         *  @return {Message}
         */

    }, {
        key: 'setMuted',
        value: function setMuted(muted) {
            this._state.muted = muted;
            return this;
        }

        /**
         *  @param {boolean} autoplay
         *  @return {Message}
         */

    }, {
        key: 'setAutoplay',
        value: function setAutoplay(autoplay) {
            this._state.autoplay = autoplay;
            return this;
        }

        /**
         *  @param {boolean} noSave
         *  @return {Message}
         */

    }, {
        key: 'setNoSave',
        value: function setNoSave(noSave) {
            this._state.noSave = noSave;
            return this;
        }

        /**
         *  @param {string} mention
         *  @return {Message}
         */

    }, {
        key: 'setMention',
        value: function setMention(mention) {
            this._state.mention = mention;
            return this;
        }
    }, {
        key: 'from',
        get: function get() {
            return this._state.from;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receiving-messages
         *  @return {string}
         */

    }, {
        key: 'id',
        get: function get() {
            return this._state.id;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receiving-messages
         *  @return {string}
         */

    }, {
        key: 'chatId',
        get: function get() {
            return this._state.chatId;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receipts
         *  @return {array}
         */

    }, {
        key: 'messageIds',
        get: function get() {
            return this._state.messageIds;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receipts
         *  @return {boolean}
         */

    }, {
        key: 'readReceiptRequested',
        get: function get() {
            return this._state.readReceiptRequested;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#sticker
         *  @return {string}
         */

    }, {
        key: 'stickerPackId',
        get: function get() {
            return this._state.stickerPackId;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#kik-codes-api
         *  @return {string}
         */

    }, {
        key: 'scanData',
        get: function get() {
            return this._state.data;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#sticker
         *  @return {string}
         */

    }, {
        key: 'stickerUrl',
        get: function get() {
            return this._state.stickerUrl;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#common-fields
         *  @return {number}
         */

    }, {
        key: 'timestamp',
        get: function get() {
            return this._state.timestamp;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#message-formats
         *  @return {string}
         */

    }, {
        key: 'type',
        get: function get() {
            return this._state.type;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {object}
         */

    }, {
        key: 'kikJsData',
        get: function get() {
            return this._state.kikJsData;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {string}
         */

    }, {
        key: 'picUrl',
        get: function get() {
            return this._state.picUrl;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {boolean}
         */

    }, {
        key: 'noForward',
        get: function get() {
            return this._state.noForward;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#is-typing
         *  @return {boolean}
         */

    }, {
        key: 'isTyping',
        get: function get() {
            return this._state.isTyping;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#text
         *  @return {string}
         */

    }, {
        key: 'body',
        get: function get() {
            return this._state.body;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {string}
         */

    }, {
        key: 'text',
        get: function get() {
            return this._state.text;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {string}
         */

    }, {
        key: 'title',
        get: function get() {
            return this._state.title;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {string}
         */

    }, {
        key: 'url',
        get: function get() {
            return this._state.url;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {string}
         */

    }, {
        key: 'videoUrl',
        get: function get() {
            return this._state.videoUrl;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#common-fields
         *  @return {number}
         */

    }, {
        key: 'delay',
        get: function get() {
            return this._state.delay;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#text
         *  @return {number}
         */

    }, {
        key: 'typeTime',
        get: function get() {
            return this._state.typeTime;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#attribution
         *  @return {string}
         */

    }, {
        key: 'attributionName',
        get: function get() {
            return this._state.attribution ? this._state.attribution.name : undefined;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#attribution
         *  @return {string}
         */

    }, {
        key: 'attributionIcon',
        get: function get() {
            return this._state.attribution ? this._state.attribution.iconUrl : undefined;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {boolean}
         */

    }, {
        key: 'loop',
        get: function get() {
            return this._state.loop;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {boolean}
         */

    }, {
        key: 'muted',
        get: function get() {
            return this._state.muted;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {boolean}
         */

    }, {
        key: 'autoplay',
        get: function get() {
            return this._state.autoplay;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {boolean}
         */

    }, {
        key: 'noSave',
        get: function get() {
            return this._state.noSave;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#participants
         *  @return {array}
         */

    }, {
        key: 'participants',
        get: function get() {
            return this._state.participants;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#mention
         *  @return {string}
         */

    }, {
        key: 'mention',
        get: function get() {
            return this._state.mention;
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#friend-picker
         *  @return {string}
         */

    }, {
        key: 'picked',
        get: function get() {
            return this._state.picked;
        }
    }], [{
        key: 'text',
        value: function text(_text) {
            return new Message('text').setBody(_text);
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#link
         *  @return {Message}
         */

    }, {
        key: 'link',
        value: function link(_link) {
            return new Message('link').setUrl(_link);
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#picture
         *  @return {Message}
         */

    }, {
        key: 'picture',
        value: function picture(picUrl) {
            return new Message('picture').setPicUrl(picUrl);
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#video
         *  @return {Message}
         */

    }, {
        key: 'video',
        value: function video(videoUrl) {
            return new Message('video').setVideoUrl(videoUrl);
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#is-typing
         *  @return {Message}
         */

    }, {
        key: 'isTyping',
        value: function isTyping(typing) {
            return new Message('is-typing').setIsTyping(typing);
        }

        /**
         *  See https://dev.kik.com/#/docs/messaging#receipts
         *  @return {Message}
         */

    }, {
        key: 'readReceipt',
        value: function readReceipt(messageIds) {
            return new Message('read-receipt').setMessageIds(messageIds);
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(json) {
            var msg = new Message(json.type);

            return msg.parse(json);
        }
    }]);

    return Message;
}();

module.exports = Message;