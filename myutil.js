const fs = require("fs");

module.exports = {
    mkUploadDir: function () {
        const path = "upload";
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        return path;
    }

}