const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: "tempthanh321@gmail.com",
        clientId: "171147969598-29bi9u3ihussbe81he5de9fuqc1adlug.apps.googleusercontent.com",
        clientSecret: "rf-1OObFP2MwHq1PeQtizPu8",
        refreshToken: "1/5Xqx85Y2wgpYGyeAbv_aATXD7oUDWIIHHrpun5-I2JeZEE-4Cedi7oU8GgYXDeSv",
        accessToken: "ya29.GlvmBQVebN5KT4iIt-OYQH6iRP75-0vGjBbZok3z-Uuo7OLxLMj40PakJ49idTlv4jDnsUSgL4PowM6_ShEmagA2hpO2kPV0wBHiGfFasm8BH6TFfx_GwxxJ8Kux"
    }
})

const mailOptions = (dest, username, link) => ({
    from: 'Eshopper Verify Email <tempthanh321@gmail.com>', // sender address
    to: dest, // list of receivers
    subject: 'Verify your account', // Subject line
    html: `
    <h1>Hello ${username}</h1>
    <p>Press link to verify your account!!!! hihi</p>
    <a href="${link}">Click here to verify</a>`// plain text body
})

module.exports = {transporter, mailOptions}