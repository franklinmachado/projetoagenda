const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const { async } = require("regenerator-runtime");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("Usúario não existente!");
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha inválida!");
      this.user = null;
      return;
    }
  }

  async register() {
    try {
      this.valida();
      if (this.errors.length > 0) return;
      await this.userExist();
      if (this.errors.length > 0) return;

      const salt = bcryptjs.genSaltSync();
      this.body.password = bcryptjs.hashSync(this.body.password, salt);

      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.log(e);
    }
  }

  async userExist() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("Usúario ja existe.");
  }

  valida() {
    this.cleanUp();
    //validação
    //emil precisa ser valido
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail Inválido!");
    }
    //senha precisa ter entre 8 a 16 caracteres
    if (this.body.password.length < 8 || this.body.password.length > 16) {
      this.errors.push("A senha precisa ter entre 8 a 16 caracteres.");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }

      this.body = {
        email: this.body.email,
        password: this.body.password,
      };
    }
  }
}

module.exports = Login;
