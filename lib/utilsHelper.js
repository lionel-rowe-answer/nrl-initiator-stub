let utilsHelper = {

    validString : function(str) {
        return typeof str == "string" && str.trim().length > 0;
    },

    isNullOrEmpty: function(str)
    {
        return !str || (typeof str === "string" && str.replace(/\s/g,'') == "");
    }
}

module.exports.utilsHelper = utilsHelper;
