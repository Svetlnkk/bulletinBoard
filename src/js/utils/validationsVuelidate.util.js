import {
  alpha,
  email,
  maxLength,
  minLength,
  numeric,
  required,
  sameAs,
} from 'vuelidate/lib/validators';

import {
  hasMaxMoreMinPrice,
  hasMinLessMaxPrice,
} from '../../js/validators/filters';

import {
  hasLowercaseLetter,
  hasNumber,
  hasUppercaseLetter,
} from '../validators/password';

/* -----------------------------
Validation on 'Registration.vue'
------------------------------*/
export const validationRegistration = {
  validations: {
    confirmPassword: {
      sameAsPassword: sameAs('password'),
      required,
    },
    email: {
      email,
      maxLength: maxLength(100),
      minLength: minLength(3),
      required,
    },
    name: {
      alpha,
      maxLength: maxLength(30),
      minLength: minLength(2),
      required,
    },
    password: {
      hasLowercaseLetter,
      hasNumber,
      hasUppercaseLetter,
      maxLength: maxLength(50),
      minLength: minLength(6),
      required,
    },
  },
  errorMessages: {
    // error messages on email validation
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Email некорректный');
      !this.$v.email.maxLength &&
        errors.push("Email должен быть не более 30 символов");
      !this.$v.email.minLength &&
        errors.push('Email должен быть не менее 3 символам');
      !this.$v.email.required && errors.push('Введите Email');
      return errors;
    },

    // error messages on confirmPassword validation
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push('Пароли не совпадают');
      !this.$v.confirmPassword.required &&
        errors.push('Повтор пароля обязателен');
      return errors;
    },

    // error messages on name validation
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.alpha && errors.push('Должны быть символы');
      !this.$v.name.maxLength &&
        errors.push("Имя должно быть не более 30 символов");
      !this.$v.name.minLength &&
        errors.push("Имя должно быть не менее 2 символов");
      !this.$v.name.required && errors.push('Введите имя');
      return errors;
    },

    // error messages on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.hasLowercaseLetter &&
        errors.push(
          "Нужна хотя бы одна латинская строчная буква"
        );
      !this.$v.password.hasNumber && errors.push("Нужна хотя бы одна цифра");
      !this.$v.password.hasUppercaseLetter &&
        errors.push("Нужна хотя бы одна латинская заглавная буква");
      !this.$v.password.maxLength &&
        errors.push("Пароль должен быть не более 50 символов");
      !this.$v.password.minLength &&
        errors.push("Пароль должен быть не менее 6 символов");
      !this.$v.password.required && errors.push('Введите пароль');
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'AdFilters.vue'
------------------------------*/
export const validationAdFilters = {
  validations: {
    inputSearch: {
      maxLength: maxLength(30),
    },
    maxPrice: {
      maxLength: maxLength(20),
      hasMaxMoreMinPrice,
    },
    minPrice: {
      maxLength: maxLength(20),
      hasMinLessMaxPrice,
    },
  },
  errorMessages: {
    // error messages on search by max price input
    searchBymaxPriceErrors() {
      const errors = [];
      if (!this.$v.maxPrice.$dirty) return errors;
      !this.$v.maxPrice.maxLength && errors.push("Ввод не более 20 цифр");
      !this.$v.maxPrice.hasMaxMoreMinPrice && errors.push('Ошибка! max < min');
      return errors;
    },

    // error messages on search by min price input
    searchByminPriceErrors() {
      const errors = [];
      if (!this.$v.minPrice.$dirty) return errors;
      !this.$v.minPrice.maxLength && errors.push("Ввод не более 20 цифр");
      !this.$v.minPrice.hasMinLessMaxPrice && errors.push('Ошибка! min > max');
      return errors;
    },

    // error messages on search by word input
    searchByWordErrors() {
      const errors = [];
      if (!this.$v.inputSearch.$dirty) return errors;
      !this.$v.inputSearch.maxLength &&
        errors.push(
          "вводимый поиск по слову должен содержать не более 30 символов"
        );
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'AdModalEdit.vue'
------------------------------*/
export const validationAdModalEdit = {
  validations: {
    editedDescription: {
      maxLength: maxLength(1000),
      minLength: minLength(30),
      required,
    },
    editedPrice: { maxLength: maxLength(20), numeric, required },
    editedTitle: {
      maxLength: maxLength(60),
      minLength: minLength(4),
      required,
    },
  },
  errorMessages: {
    // error messages on title validation
    titleErrors() {
      const errors = [];
      if (!this.$v.editedTitle.$dirty) return errors;
      !this.$v.editedTitle.maxLength &&
        errors.push('Заголовок должен быть не более 60 символов');
      !this.$v.editedTitle.minLength &&
        errors.push("Заголовок должен быть не менее 4 символов");
      !this.$v.editedTitle.required && errors.push('Введите заголовок');
      return errors;
    },

    // error messages on description validation
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedDescription.$dirty) return errors;
      !this.$v.editedDescription.maxLength &&
        errors.push('Описание должно быть не более 1000 символов');
      !this.$v.editedDescription.minLength &&
        errors.push("Описание должно быть не менее 30 символов");
      !this.$v.editedDescription.required &&
        errors.push('Введите описание');
      return errors;
    },

    // error messages on price validation
    priceErrors() {
      const errors = [];
      if (!this.$v.editedPrice.$dirty) return errors;
      !this.$v.editedPrice.maxLength &&
        errors.push('Цена должна быть не более 20 знаков');
      !this.$v.editedPrice.numeric && errors.push('Введите число!');
      !this.$v.editedPrice.required && errors.push('Введите цену');
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'AdNew.vue'
------------------------------*/
export const validationAdNew = {
  validations: {
    description: {
      maxLength: maxLength(1000),
      minLength: minLength(30),
      required,
    },
    price: { maxLength: maxLength(20), numeric, required },
    title: {
      maxLength: maxLength(60),
      minLength: minLength(4),
      required,
    },
  },
  errorMessages: {
    // error messages on description validation
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      !this.$v.description.maxLength &&
        errors.push("Описание должно быть не более 1000 символов");
      !this.$v.description.minLength &&
        errors.push("Описание должно быть не менее 30 символов");
      !this.$v.description.required && errors.push('Введите описание');
      return errors;
    },
    // error messages on price validation
    priceErrors() {
      const errors = [];
      if (!this.$v.price.$dirty) return errors;
      !this.$v.price.maxLength &&
        errors.push("Цена должна быть не более 20 знаков");
      !this.$v.price.numeric && errors.push("Введите число!");
      !this.$v.price.required && errors.push("Введите цену");
      return errors;
    },

    // error messages on title validation
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.maxLength &&
        errors.push("Заголовок должен быть не более 60 символов");
      !this.$v.title.minLength &&
        errors.push("Заголовок должен быть не менее 4 символов");
      !this.$v.title.required && errors.push("Введите заголовок");
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'Login.vue'
------------------------------*/
export const validationLogin = {
  validations: {
    email: {
      email,
      maxLength: maxLength(100),
      minLength: minLength(3),
      required,
    },
    password: { maxLength: maxLength(1000), required },
  },
  errorMessages: {
    // error messages on email validation
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Email некорректный");
      !this.$v.email.maxLength &&
        errors.push("Email должен быть не более 100 символов");
      !this.$v.email.minLength &&
        errors.push("Email должен быть не менее 3 символам");
      !this.$v.email.required && errors.push("Введите Email");
      return errors;
    },

    // error messages on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push('Пароль должен быть не более 1000 символов');
      !this.$v.password.required && errors.push('Введите пароль');
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'AdModalBuy.vue'
------------------------------*/
export const validationAdModalBuy = {
  validations: {
    name: {
      alpha,
      maxLength: maxLength(60),
      minLength: minLength(2),
      required,
    },
    phone: {
      maxLength: maxLength(30),
      minLength: minLength(5),
      numeric,
      required,
    },
  },
  errorMessages: {
    // rules on name validation
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.alpha && errors.push('Имя должно содержать только символы');
      !this.$v.name.maxLength &&
        errors.push('Имя должны быть не более 60 символов');
      !this.$v.name.minLength &&
        errors.push("Имя должны быть не менее 2 символов");
      !this.$v.name.required && errors.push('Введите имя');
      return errors;
    },

    // rules on phone number validation
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.numeric &&
        errors.push("Номер телефона должен состоять только из цифр");
      !this.$v.phone.maxLength &&
        errors.push('Номер телефона должен содержать не более 30 цифр');
      !this.$v.phone.minLength &&
        errors.push("Номер телефона должен содержать не менее 5 цифр");
      !this.$v.phone.required && errors.push('Введите номер телефона');
      return errors;
    },
  },
};

/* -----------------------------
Validation on 'UserModalEdit.vue'
------------------------------*/
export const validationUserModalEdit = {
  validations: {
    editedConfirmPassword: {
      sameAsPassword: sameAs('editedPassword'),
      required,
    },
    editedEmail: {
      email,
      maxLength: maxLength(100),
      minLength: minLength(3),
      required,
    },
    editedName: {
      alpha,
      maxLength: maxLength(30),
      minLength: minLength(2),
      required,
    },
    editedPassword: {
      hasLowercaseLetter,
      hasNumber,
      hasUppercaseLetter,
      maxLength: maxLength(50),
      minLength: minLength(6),
      required,
    },
  },
  errorMessages: {
    // rules on confirmPassword validation. Not cheсked if this.editedPassword is none.
    editedConfirmPasswordErrors() {
      const errors = [];
      if (!this.$v.editedConfirmPassword.$dirty) return errors;
      !this.$v.editedConfirmPassword.sameAsPassword &&
        this.editedPassword &&
        errors.push("Пароли должны совпадать");
      !this.$v.editedConfirmPassword.required &&
        this.editedPassword &&
        errors.push('Введите пароль повторно');
      return errors;
    },

    // rules on email validation
    editedEmailErrors() {
      const errors = [];
      if (!this.$v.editedEmail.$dirty) return errors;
      !this.$v.editedEmail.email && errors.push('Email некорректный');
      !this.$v.editedEmail.maxLength &&
        errors.push("Email должен быть не более 30 символов");
      !this.$v.editedEmail.minLength &&
        errors.push("Email должен быть не менее 3 симвлов");
      !this.$v.editedEmail.required && errors.push("Введите Email");
      return errors;
    },

    // rules on name validation
    editedNameErrors() {
      const errors = [];
      if (!this.$v.editedName.$dirty) return errors;
      !this.$v.editedName.alpha && errors.push('Имя должно состоять только из букв');
      !this.$v.editedName.maxLength &&
        errors.push("Имя должно быть не более 30 символов");
      !this.$v.editedName.minLength &&
        errors.push("Имя должно быть не менее 2 символов");
      !this.$v.editedName.required && errors.push("Введите имя");
      return errors;
    },

    // rules on password validation.Not cheсked if this.editedPassword is none.
    editedPasswordErrors() {
      const errors = [];
      if (!this.$v.editedPassword.$dirty) return errors;
      !this.$v.editedPassword.hasLowercaseLetter &&
        this.editedPassword &&
        errors.push("Нужна хотя бы одна латинская строчная буква");
      !this.$v.editedPassword.hasNumber &&
        this.editedPassword &&
        errors.push("Нужна хотя бы одна цифра");
      !this.$v.editedPassword.hasUppercaseLetter &&
        this.editedPassword &&
        errors.push("Нужна хотя бы одна латинская заглавная буква");
      !this.$v.editedPassword.maxLength &&
        this.editedPassword &&
        errors.push("Пароль должен быть не более 50 символов");
      !this.$v.editedPassword.minLength &&
        this.editedPassword &&
        errors.push("Пароль должен быть не менее 6 символов");
      !this.$v.editedPassword.required &&
        this.editedPassword &&
        errors.push("Введите пароль");
      return errors;
    },
  },
};
