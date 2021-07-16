const express = require('express');
const clienteRoute = express.Router();

const ClienteService = require('../app_services/clienteService.js');
const ClienteRepository = require('../app_repositories/clienteRepository.js');
const Cliente = require('../app_models/cliente.js');

const BASE_ROOT = '/cliente';

const ClienteController = new function() {

    var clienteRepository = new ClienteRepository();
    var clienteService = new ClienteService();

    this.listAll = function(req, res) {
        return res.json(clienteRepository.listAll());
    }

    this.create = function(req, res) {
        const body = req.body;
        if (!body || !Object.keys(body).length) {
            return res.status(400).end();
        }

        const opStatus = clienteService.create(new Cliente(body));
        return opStatus.hasError ? res.status(opStatus.status).end() : res.json(opStatus.data);
    }

    this.update = function(req, res) {
        const body = req.body;
        if (!body || !Object.keys(body).length) {
            return res.status(400).end();
        }

        const clientePersist = new Cliente(body);
        clientePersist.email = req.params.email;
        const opStatus = clienteService.update(clientePersist);
        return opStatus.hasError ? res.status(opStatus.status).end() : res.json(opStatus.data);
    }

    this.addProductToList = async function(req, res) {
        const email = req.params.email;
        const idProduto = req.params.idProduto;

        const opStatus = await clienteService.addProductToList(email, idProduto);
        return opStatus.hasError ? res.status(opStatus.status).end() : res.json(opStatus.data);
    }

    this.delete = function(req, res) {
        const email = req.params.email;
        const opStatus = clienteService.delete(email);
        return res.status(opStatus.status).end();
    }

}();

/**
* @swagger
* tags:
*   name: Clientes
*   description: Operações responsaveis por controlar os dados cadastrais de clientes.
* components:
*   schemas:
*       Produto:
*           type: object
*           properties:
*               id:
*                   type: string
*               brand:
*                   type: string
*               image:
*                   type: string
*               price:
*                   type: number
*               title:
*                   type: string
*       Cliente:
*           type: object
*           properties:
*               email:
*                   type: string
*               nome:
*                   type: string
*               produtosFavoritos:
*                   type: array
*                   items:
*                       $ref: '#/components/schemas/Produto'
*       ClienteForPost:
*           type: object
*           properties:
*               email:
*                   type: string
*               nome:
*                   type: string
*       ClienteForPut:
*           type: object
*           properties:
*               nome:
*                   type: string
*/

/**
* @swagger
* /cliente:
*   get:
*       tags: [Clientes]
*       description: Retorna a lista de todos os clientes.
*       responses:
*           '200':
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Cliente'
*/
clienteRoute.get(`${BASE_ROOT}/`, ClienteController.listAll);

/**
* @swagger
* /cliente:
*   post:
*       tags: [Clientes]
*       description: Insere um novo Cliente.
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/ClienteForPost'
*       responses:
*           '200':
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Cliente'
*/
clienteRoute.post(`${BASE_ROOT}/`, ClienteController.create);

/**
* @swagger
* /cliente/{email}:
*   put:
*       tags: [Clientes]
*       description: Atualiza um Cliente atraves do e-mail informado.
*       parameters:
*           - in: path
*             name: email
*             required: true
*             schema:
*               type: string
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/ClienteForPut'
*       responses:
*           '200':
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Cliente'
*/
clienteRoute.put(`${BASE_ROOT}/:email`, ClienteController.update);

/**
* @swagger
* /cliente/{email}/produto/{idProduto}:
*   put:
*       tags: [Clientes]
*       description: Adiciona um produto a lista de produtos favoritos de um determinado Cliente atraves do e-mail informado.
*       parameters:
*           - in: path
*             name: email
*             required: true
*             schema:
*               type: string
*           - in: path
*             name: idProduto
*             required: true
*             schema:
*               type: string
*       responses:
*           '200':
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Cliente'
*/
clienteRoute.put(`${BASE_ROOT}/:email/produto/:idProduto`, ClienteController.addProductToList);

/**
* @swagger
* /cliente/{email}:
*   delete:
*       tags: [Clientes]
*       description: Deleta um Cliente atraves do e-mail informado.
*       parameters:
*           - in: path
*             name: email
*             required: true
*             schema:
*               type: string
*       responses:
*           '200':
*               description: Success
*/
clienteRoute.delete(`${BASE_ROOT}/:email`, ClienteController.delete);

module.exports = clienteRoute;
