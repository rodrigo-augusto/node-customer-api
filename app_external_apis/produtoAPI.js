const axios = require('axios');

const produtoAPI = axios.create({
    baseURL: 'http://challenge-api.luizalabs.com/api/product'
});

module.exports = produtoAPI;
