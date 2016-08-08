'use strict';

/**
 *  @class UserProfile
 *  See https://dev.kik.com/#/docs/messaging#user-profiles
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserProfile = function () {
    function UserProfile(username, data) {
        _classCallCheck(this, UserProfile);

        this._state = {
            username: username,
            data: data
        };
    }

    /**
     *  @return {string}
     */


    _createClass(UserProfile, [{
        key: 'toJSON',


        /**
         *  Constructs a JSON payload ready to be stringified.
         *  @return {object}
         */
        value: function toJSON() {
            return this._state.data;
        }
    }, {
        key: 'displayName',
        get: function get() {
            return this.firstName + ' ' + this.lastName;
        }

        /**
         *  @return {string}
         */

    }, {
        key: 'username',
        get: function get() {
            return this._state.username;
        }

        /**
         *  @return {string}
         */

    }, {
        key: 'firstName',
        get: function get() {
            return this._state.data.firstName;
        }

        /**
         *  @return {string}
         */

    }, {
        key: 'lastName',
        get: function get() {
            return this._state.data.lastName;
        }

        /**
         *  @return {string}
         */

    }, {
        key: 'profilePicUrl',
        get: function get() {
            return this._state.data.profilePicUrl;
        }

        /**
         *  @return {number}
         */

    }, {
        key: 'profilePicLastModified',
        get: function get() {
            return this._state.data.profilePicLastModified;
        }
    }]);

    return UserProfile;
}();

module.exports = UserProfile;