const express = require('express');
const clienteRoute = express.Router();

const produtoAPI = require('../app_external_apis/produtoAPI.js');
const ClienteRepository = require('../app_repositories/clienteRepository.js');
const Cliente = require('../app_models/cliente.js');
const Produto = require('../app_models/produto.js');
const BASE_ROOT = '/cliente';

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
clienteRoute.get(`${BASE_ROOT}/`, (req, res) => {
    const clienteRepository = new ClienteRepository();
    return res.json(clienteRepository.listAll());
});

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
clienteRoute.post(`${BASE_ROOT}/`, (req, res) => {
    const body = req.body;
    if (!body || !Object.keys(body).length) {
        return res.status(400).end();
    }

    const clientePersist = new Cliente(body);
    if (!Cliente.VALIDATOR.allValid(clientePersist)) {
        return res.status(409).end();
    }

    const clienteRepository = new ClienteRepository();
    if (!clienteRepository.findByEmail(clientePersist.email)) {
        clienteRepository.add(clientePersist);
        return res.json(clientePersist);
    }

    return res.status(409).end();
});

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
clienteRoute.put(`${BASE_ROOT}/:email`, (req, res) => {
    const email = req.params.email;

    const clienteRepository = new ClienteRepository();
    const cliente = clienteRepository.findByEmail(email);
    if (!cliente) {
        return res.status(404).end();
    }

    const body = req.body;
    if (!body || !Object.keys(body).length) {
        return res.status(400).end();
    }

    const clientePersist = new Cliente(body);
    clientePersist.email = email;
    if (!Cliente.VALIDATOR.allValid(clientePersist)) {
        return res.status(409).end();
    }
    clienteRepository.update(clientePersist);
    return res.json(clientePersist);
});

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
clienteRoute.put(`${BASE_ROOT}/:email/produto/:idProduto`, async (req, res) => {
    const email = req.params.email;
    const idProduto = req.params.idProduto;

    const clienteRepository = new ClienteRepository();
    const cliente = clienteRepository.findByEmail(email);
    if (!cliente) {
        return res.status(404).end();
    }

    const ret = {};
    try{
        ret.request = await produtoAPI.get(`/${idProduto}/`);
    } catch (err) {
    }

    if (!ret.request || !ret.request.data) {
        return res.status(404).end();
    }

    const produto = ret.request.data;
    if (!cliente.produtosFavoritos.some(item => item.id == produto.id)) {
        cliente.produtosFavoritos.push(new Produto(produto));
        clienteRepository.update(cliente);
        return res.json(cliente);
    }

    return res.status(409).end();
});

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
clienteRoute.delete(`${BASE_ROOT}/:email`, (req, res) => {
    const email = req.params.email;

    const clienteRepository = new ClienteRepository();
    const cliente = clienteRepository.findByEmail(email);
    if (!cliente) {
        return res.status(404).end();
    }

    clienteRepository.deleteByEmail(email);
    return res.status(200).end();
});

module.exports = clienteRoute;
