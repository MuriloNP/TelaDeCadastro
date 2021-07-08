class Validation {
  constructor() {
    this.validations = [
      "data-required",
      "data-min-length",
      "data-max-length",
      "data-email-validate",
      "data-only-letters",
      "data-equal",
      "data-password-validate",
    ];
  }
  // inicia o mapeamento de todos os campos
  validate(form) {
    // Resgata todas as validações
    let currentValidations = document.querySelectorAll(
      "form .error-validation"
    );

    if (currentValidations.length > 0) {
      this.cleanValidations(currentValidations);
    }

    //Pega os inputs
    let inputs = form.getElementsByTagName("input");

    //Transformo um HTMLCollection -> Array
    let inputsArray = [...inputs];

    //Loop nos inputs e validação nos que forem encontrados
    inputsArray.forEach((input) => {
      //Loop em todas as validações existentes
      for (let index = 0; this.validations.length > index; index++) {
        //Verifica se a validação atual existe no input
        if (input.getAttribute(this.validations[index]) !== null) {
          //Limpando a string para virar um metodo
          let method = this.validations[index]
            .replace("data-", "")
            .replace("-", "");
          //Valor do input
          let value = input.getAttribute(this.validations[index]);

          //Invocar o metodo
          this[method](input, value);
        }
      }
    }, this);
  }
  //Verifica se um input tem um numero minimo de caracteres
  minlength(input, minValue) {
    let inputLength = input.value.length;
    let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;
    if (inputLength < minValue) {
      this.printMessage(input, errorMessage);
    }
  }

  maxlength(input, maxValue) {
    let inputLength = input.value.length;
    let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;
    if (inputLength > maxValue) {
      this.printMessage(input, errorMessage);
    }
  }

  // Valida emails
  emailvalidate(input) {
    //teste@email.com -> teste@email.com.br
    let re = /\S+@\S+\.\S+/;

    let email = input.value;
    let errorMessage = `Isira um e-mail no padrão teste@gmail.com`;

    if (!re.test(email)) {
      this.printMessage(input, errorMessage);
    }
  }

  //Valida se o campo tem apenas letras
  onlyletters(input) {
    let re = /^[A-Za-z]+$/;

    let inputValue = input.value;
    let errorMessage = `Informe apenas letras`;

    if (!re.test(inputValue)) {
      this.printMessage(input, errorMessage);
    }
  }

  //Verifica se o input é requerido
  required(input) {
    let inputValue = input.value;
    if (inputValue === "") {
      let errorMessage = `Campo obrigatório`;
      this.printMessage(input, errorMessage);
    }
  }

  //Verifica se dois campos são iguais
  equal(input, inputName) {
    let inputToCompare = document.getElementsByName(inputName)[0];
    let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

    if (input.value !== inputToCompare.value) {
      this.printMessage(input, errorMessage);
    }
  }

  //Valida o campo de senha
  passwordvalidate(input) {
    //Fatia a string em um Array
    let charArray = input.value.split("");
    let uppercases = 0;
    let numbers = 0;

    for (let index = 0; charArray.length > index; index++) {
      if (
        charArray[index] === charArray[index].toUpperCase() &&
        isNaN(parseInt(charArray[index]))
      ) {
        uppercases++;
      } else if (!isNaN(parseInt(charArray[index]))) {
        numbers++;
      }
    }
    if (uppercases === 0 || numbers === 0) {
      let errorMessage = `Caracter maiúsculo e número não informado`;

      this.printMessage(input, errorMessage);
    }
  }

  //Metodo para imprimir as messagens de erro na tela
  printMessage(input, msg) {
    //Quantidade de erros
    let errorQty = input.parentNode.querySelector(".error-validation");

    if (errorQty === null) {
      let template = document
        .querySelector(".error-validation")
        .cloneNode(true);
      template.textContent = msg;

      let inputParent = input.parentNode;
      template.classList.remove("template");

      inputParent.appendChild(template);
    }
  }

  //Limpa as validações da tela
  cleanValidations(validations) {
    validations.forEach((el) => el.remove());
  }
}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");

let validator = new Validation();

//Evento que dispara as validações
submit.addEventListener("click", function (e) {
  e.preventDefault();
  validator.validate(form);
});
