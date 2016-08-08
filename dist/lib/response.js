'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('util');

var Response = function () {
    function Response() {
        _classCallCheck(this, Response);
    }

    _createClass(Response, null, [{
        key: 'text',
        value: function text(body) {
            return {
                type: 'text',
                body: '' + body
            };
        }
    }, {
        key: 'friendPicker',
        value: function friendPicker(body, min, max, preselected) {
            var response = {
                type: 'friend-picker'
            };
            if (body) {
                response.body = '' + body;
            }

            if (!isNaN(min)) {
                response.min = min;
            }

            if (!isNaN(max)) {
                response.max = max;
            }

            if (preselected) {
                response.preselected = preselected;
            }

            return response;
        }
    }]);

    return Response;
}();

module.exports = Response;