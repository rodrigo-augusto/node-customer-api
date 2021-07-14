const Joi = require('joi');

class Cliente {

    constructor(options) {
        this.nome = options ? options.nome : null;
        this.email = options ? options.email : null;
        this.produtosFavoritos = [];
    }

}

Cliente.VALIDATOR = {

    email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
    ,

    nome: Joi.string()
            .min(3)
            .max(80)
            .required()
    ,

    allValid: function(cliente) {
        return Cliente.VALIDATOR.email.validate(cliente.email).error == null
            && Cliente.VALIDATOR.nome.validate(cliente.nome).error == null;
    }

}

module.exports = Cliente;
