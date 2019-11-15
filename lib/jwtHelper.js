const CryptoJS = require('crypto-js');

let jwtHelper = {
    
    createJwt: function(claims){

        let _payload = claims;

        let _header = {
            "alg":"none",
            "typ":"JWT"
        };

        // encode header
        let _stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(_header));
        let _encodedHeader = _toBase64url(_stringifiedHeader);

        // encode body
        let _stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(_payload));
        let _encodedPayload = _toBase64url(_stringifiedPayload);

        let _encodedSignature = "";

        // build token
        let _token = _encodedHeader + "." + _encodedPayload + "." + _encodedSignature;

        return _token;

        function _toBase64url(source) {
            // Encode in classical base64
            let encodedSource = CryptoJS.enc.Base64.stringify(source);

            // Remove padding equal characters
            encodedSource = encodedSource.replace(/=+$/, '');

            // Replace characters according to base64url specifications
            encodedSource = encodedSource.replace(/\+/g, '-');
            encodedSource = encodedSource.replace(/\//g, '_');

            return encodedSource;
        }   

    }
}

module.exports.jwtHelper = jwtHelper;