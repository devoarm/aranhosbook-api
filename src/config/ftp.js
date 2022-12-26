let Client = require("ssh2-sftp-client");
let sftp = new Client();

const ftp = sftp.connect({
  host: "192.168.2.7",
  port: "22",
  username: "root",
  password: "hosofficeok",
});

module.exports = ftp;
