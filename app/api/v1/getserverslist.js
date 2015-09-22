'use strict';

module.exports = function (req, res) {
  res.json({
    servers : [
      {
        protocol : "http",
        fqdn : "foo.cdn.afrostream.net"
      },
      {
        protocol : "http",
        fqdn : "bar.cdn.afrostream.net"
      }
    ]
  });
};