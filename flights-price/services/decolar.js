const {Chromeless} = require('chromeless');
const moment = require('moment');

class Decolar {

    constructor() {
        this.chromeless = new Chromeless(process.env.NODE_ENV === 'production' ? {remote: true} : {});
    }

    setLink(type, departure, arrival, from, to, people) {
        return `https://www.decolar.com/shop/flights/results/${type}/${departure}/${arrival}/${moment(from).format('YYYY-MM-DD')}/${moment(to).format('YYYY-MM-DD')}/${people}/0/0`;
    }

    setConfig(type, departure, arrival, from, to, people) {

        return this.chromeless
            .setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36')
            .goto(this.setLink(type, departure, arrival, from, to, people))
            .html();
    }

    getBestPrice(results) {
        const container = 'price-best';
        const price = 'price-amount';

        const wrapper = results.substr(results.indexOf(container) - 24, 1500);
        const priceWrapper = wrapper.substr(wrapper.indexOf(price) + price.length, 10);

        const resp = priceWrapper.substring(priceWrapper.indexOf('>') + 1, priceWrapper.indexOf('<'));

        return this._toPrice(resp);
    }

    _toPrice(price) {
        return Number.parseFloat(price.replace(/\./g, ''));
    }

}

module.exports = Decolar;