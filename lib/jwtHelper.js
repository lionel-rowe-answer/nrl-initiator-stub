const jwtHelper = {
    createJwt: (claims) => {
        const CryptoJS = require('crypto-js');
        // dependencies must be here, not at top level
        // to allow install on first run

        const _payload = claims;

        const _header = {
            alg: 'none',
            typ: 'JWT',
        };

        // encode header
        const _stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(_header));
        const _encodedHeader = _toBase64url(_stringifiedHeader);

        // encode body
        const _stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(_payload));
        const _encodedPayload = _toBase64url(_stringifiedPayload);

        const _encodedSignature = '';

        // build token
        const _token = _encodedHeader + '.' + _encodedPayload + '.' + _encodedSignature;

        return _token;

        function _toBase64url(source) {
            // Encode in classical base64
            const encodedSource = CryptoJS.enc.Base64.stringify(source)
                // Remove padding equal characters
                .replace(/=+$/, '')
                // Replace characters according to base64url specifications
                .replace(/\+/g, '-')
                .replace(/\//g, '_');

            return encodedSource;
        }

    }
}

module.exports = {
    jwtHelper,
};
