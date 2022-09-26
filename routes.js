const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contatoController = require("./src/controllers/contatoController");

const { loginRequired } = require("./src/middlewares/meuMiddleware");

//ROTAS DA HOME
route.get("/", homeController.index);

//ROTAS DE LOGIN
route.get("/login/", loginController.index);
route.post("/login/register/", loginController.register);
route.post("/login/logar/", loginController.login);
route.get("/login/logout/", loginController.logout);

//ROTAS CONTATO
route.get("/contato", loginRequired,contatoController.index);
route.post("/contato/register", loginRequired,contatoController.register);
route.get("/contato/:id", loginRequired,contatoController.editIndex);
route.post("/contato/edit/:id", loginRequired,contatoController.edit);
route.get("/contato/delete/:id", loginRequired,contatoController.delete);


module.exports = route;
