const axios = require('axios');

class ProdutoAPI {

    constructor() {
        this.api = axios.create({
           baseURL: 'http://challenge-api.luizalabs.com/api/product'
       });
    }

    getProductById(idProduto) {
        return this.api.get(`/${idProduto}/`);
    }

}

module.exports = ProdutoAPI;
