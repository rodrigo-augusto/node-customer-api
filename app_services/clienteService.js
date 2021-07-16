const AppOperacaoStatus = require('../app_commons/appOperacaoStatus.js');
const ProdutoAPI = require('../app_external_apis/produtoAPI.js');
const ClienteRepository = require('../app_repositories/clienteRepository.js');
const Cliente = require('../app_models/cliente.js');
const Produto = require('../app_models/produto.js');

module.exports = class ClienteService {

    constructor() {
        this.clienteRepository = new ClienteRepository();
        this.produtoAPI = new ProdutoAPI();
    }

    create(clientePersist) {
        if (!Cliente.VALIDATOR.allValid(clientePersist)) {
            return new AppOperacaoStatus({status: 409});
        }

        if (!this.clienteRepository.findByEmail(clientePersist.email)) {
            this.clienteRepository.add(clientePersist);
            return new AppOperacaoStatus({data: clientePersist});
        }

        return new AppOperacaoStatus({status: 409});
    }

    update(clientePersist) {
        const cliente = this.clienteRepository.findByEmail(clientePersist.email);
        if (!cliente) {
            return new AppOperacaoStatus({status: 404});
        }

        if (!Cliente.VALIDATOR.allValid(clientePersist)) {
            return new AppOperacaoStatus({status: 409});
        }

        this.clienteRepository.update(clientePersist);
        return new AppOperacaoStatus({data: this.clienteRepository.findByEmail(clientePersist.email)});
    }

    async addProductToList(email, idProduto) {
        const cliente = this.clienteRepository.findByEmail(email);
        if (!cliente) {
            return new AppOperacaoStatus({status: 404});
        }

        const ret = {};
        try {
            ret.request = await this.produtoAPI.getProductById(idProduto);
        } catch (err) { }

        if (!ret.request || !ret.request.data) {
            return new AppOperacaoStatus({status: 404});
        }

        const produto = ret.request.data;
        if (!cliente.produtosFavoritos.some(item => item.id == produto.id)) {
            cliente.produtosFavoritos.push(new Produto(produto));
            this.clienteRepository.update(cliente);
            return new AppOperacaoStatus({data: cliente});
        }

        return new AppOperacaoStatus({status: 409});
    }

    delete(email) {
        const cliente = this.clienteRepository.findByEmail(email);
        if (!cliente) {
            return new AppOperacaoStatus({status: 404});
        }

        this.clienteRepository.deleteByEmail(email);
        return new AppOperacaoStatus({status: 200});
    }

}
