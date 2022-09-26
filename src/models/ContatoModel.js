const mongoose = require("mongoose");
const validator = require("validator");
const { async } = require("regenerator-runtime");
const ObjectId = require ('mongoose').Types.ObjectId;


const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  redeSocial: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function () {
  // usei try, mas nao tava no video
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();
  //validação
  //emil precisa ser valido
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push("E-mail Inválido!");
  }
  if (!this.body.nome) this.errors.push("Nome é um campo obrigatório.");
  if (!this.body.email && !this.body.telefone) {
    this.errors.push(
      "É necessario informar pelo menos um campo: E-mail ou Telefone."
    );
  }
};

Contato.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
  this.body = {
    nome: this.body.nome,
    email: this.body.email,
    telefone: this.body.telefone,
    redeSocial: this.body.redeSocial,
  };
};

Contato.prototype.edit = async function (id) {
  try {
    if (typeof id !== "string") return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(ObjectId(id), this.body, {
      new: true,
    });
  } catch (e) {
    console.log(e);
  }
};

//metodos estaticos

Contato.buscaPorId = async function (id) {
  try {
    if (typeof id !== "string") return;
    mongoose.isValidObjectId(id)
    const contato = await ContatoModel.findById(ObjectId(id));
    return contato;
  } catch (e) {
    console.log(e);
  }
};

Contato.buscaContatos = async function () {
  try {
    const contatos = await ContatoModel.find().sort({ nome: 1 });
    return contatos;
  } catch (e) {
    console.log(e);
  }
};

Contato.delete = async function (id) {
  try {
    if (typeof id !== "string") return;
    const contato = await ContatoModel.findOneAndDelete(id);
    return contato;
  } catch (e) {
    console.log(e);
  }
};

module.exports = Contato;
