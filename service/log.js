const path = require("path");
const fs = require("fs");
const fn = function (err) {
    if (err) throw err;
};

const types = new Set();

module.exports = function log(type, message, cb = fn) {
    const now = new Date();
    const filepath = path.resolve(__dirname, "../logs", type);
    const filename = `${now.toLocaleDateString("ru")}.log`;
    const file = path.resolve(filepath, filename);

    const data = `
        ${now.toLocaleString("ru")} 
        ${message}
    `;

    if (!types.has(type)) {
        fs.access(filepath, (err) => {
            if (err) {
                fs.mkdir(filepath, { recursive: true }, (err) => {
                    if (err) throw err;

                    types.add(type);
                    fs.writeFile(file, data, cb);
                });
            } else fs.appendFile(file, data, cb);
        });
    } else fs.appendFile(file, data, cb);
};
