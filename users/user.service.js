const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var randomstring = require("randomstring");
var nodemailer = require("nodemailer");
var mandrillTransport = require('nodemailer-mandrill-transport');

const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already registered!';
    }
    
    const user = new User(userParam);
    let password = randomstring.generate(5);
    user.hash = bcrypt.hashSync(password, 10);
    await user.save(function (err) {
        if (!err) {
            console.log('Success!');
            sendEmail(userParam.email, password);
        }
        else console.log(err);
      });
}

async function update(id, userParam) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}


function sendEmail(email, password){
    var smtpTransport = nodemailer.createTransport(mandrillTransport({
        auth: {
          apiKey : config.mailchimpApikey
        }
    }));

    let htmlData = "Hello,<br>Welcome to Hyphen. <br>Sending this email using Node and Mandrill. Your password is " + password;
    
    // Put in email details.
    email = config.testEmail || email;
    let mailOptions={
       from : config.fromEmail,
       to : email,
       subject : "Welcome to Hyphen!",
       html : htmlData
    };
    
    // Sending email.
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error) {
         throw new Error("Error in sending email");
      }
      console.log("Message sent: " + JSON.stringify(response));
    });
}
