const fs = require("fs");
const path = require("path");

module.exports = {
    mkUploadDir: function () {
        const path = "upload";
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        return path;
    },
    mkUploadTemp: function (hash) {
        if (!fs.existsSync("temp")) {
            fs.mkdirSync("temp");
        }
        const hashPath = path.join("temp",hash);
        if (!fs.existsSync(hashPath)) {
            fs.mkdirSync(hashPath);
        }
        return hashPath;
    }

}