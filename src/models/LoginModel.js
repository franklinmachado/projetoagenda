const mongoose = require("mongoose");
const validator = require("validator");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    try {
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      return console.log(e);
    };
  }

  valida() {
    this.cleanUp();
    //email precisa ser valido
    //senha precisa ter entre 6 a 12 caracteres
    if (!validator.isEmail(this.body.email)) {
     this.errors.push("E-mail inválido");
    }
    if (this.body.password.length < 6 || this.body.password.length > 12) {
     this.errors.push("Senha precisa ter entre 6 a 12 caracteres");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = '';
      }

      this.body = {
        email: this.body.email,
        password: this.body.password
      };
    }
  }
}

module.exports = Login;
