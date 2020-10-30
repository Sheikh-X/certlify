const User = require("../models/users");
var uniqid = require('uniqid');
const Link = require("../models/links");

let certificate = (req, res) => {
    if (!req.session.email&&!req.session.anon) {
        res.status(401)
        res.json({
            status: false,
            message: "user not logged in"
        })
    } else {
        let link = uniqid()
        req.session.link = link;
        User.findOne({ email: req.session.email||req.session.anon }, function (err, user) {
            if (!user) {
                res.status(401)
                res.json({
                    status: false,
                    message: "Unregistered User"
                })
            } else {
                user.certificateUrls.push(link);
                user.save((err) => {
                    if (err) throw err
                    else {
                        let cert = new Link({
                            issuer: req.session.email||req.session.anon,
                            name: req.body.name,
                            link: link,
                            src:req.body.src,
                            thumb:req.body.thumb,
                            boundary: req.body.boundary,
                        })
                        cert.save(function (err, doc) {
                            if (err) return console.error(err);
                            res.json({
                                status: true,
                                message: "certificate created",
                                link: req.hostname + "/certificate/" + link,
                                url:link
                            })
                        });
                    }
                })
            }
        })
    }
}

module.exports = certificate;