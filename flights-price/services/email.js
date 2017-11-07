const nodemailer = require('nodemailer');
const moment = require('moment');

console.log('Env: ' + process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

class Email {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true, //ssl
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASSWORD
            }
        });
    }

    send(price, email, name, link, info) {

        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: 'rodrigodugin@malteria.beer',
                to: email,
                subject: `Passagem ${info.departure} - ${info.arrival} no valor de R$${this._numberToPrice(price)}!`,
                html: `<p>Olá ${name},</p> 
            <p> Sua passagem de partida dia ${moment(info.from).format('DD/MM/YYYY')}  
            e chegada dia ${moment(info.to).format('DD/MM/YYYY')} foi encontrada pelo valor de R$${this._numberToPrice(price)}! </p>
           <p> Corra e acesse o link abaixo:</p>
               <p><a href="${link}"></a>${link}</p>`

            }, (error, info) => {
                return error ? reject(error) : resolve(info);
            });

        })

    }

    _numberToPrice(price) {
        return price.toFixed(2).replace('.', ',');
    }

}

module.exports = Email;