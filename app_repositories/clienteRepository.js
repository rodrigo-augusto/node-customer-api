class ClienteRepository {

    listAll() {
        return ClienteRepository.RECORDS;
    }

    findByEmail(email) {
        return ClienteRepository.RECORDS.find(item => item.email == email);
    }

    add(cliente) {
        ClienteRepository.RECORDS.push(cliente);
    }

    update(cliente) {
        const clienteBase = this.findByEmail(cliente.email);
        clienteBase.nome = cliente.nome;
        clienteBase.produtosFavoritos = cliente.produtosFavoritos;
    }

    deleteByEmail(email) {
        const index = ClienteRepository.RECORDS.findIndex(item => item.email == email);
        if (index >= -1) {
            ClienteRepository.RECORDS.splice(index, 1);
            return true;
        }
        return false;
    }

}

ClienteRepository.RECORDS = [];

module.exports = ClienteRepository;