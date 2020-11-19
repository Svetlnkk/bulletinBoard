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
      !this.$v.email.email && errors.push('Email must be valid');
      !this.$v.email.maxLength &&
        errors.push('Email must be equal or less than 30 characters');
      !this.$v.email.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.email.required && errors.push('Email is required');
      return errors;
    },

    // error messages on confirmPassword validation
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push('Passwords must match');
      !this.$v.confirmPassword.required &&
        errors.push('Confirm password is required');
      return errors;
    },

    // error messages on name validation
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.alpha && errors.push('Name must be only letters');
      !this.$v.name.maxLength &&
        errors.push('Name must be equal or less than 30 characters');
      !this.$v.name.minLength &&
        errors.push('Name must be equal or more than 3 characters');
      !this.$v.name.required && errors.push('Name is required');
      return errors;
    },

    // error messages on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.hasLowercaseLetter &&
        errors.push('Need at least one latin letter with lowercase');
      !this.$v.password.hasNumber && errors.push('Need at least one digit');
      !this.$v.password.hasUppercaseLetter &&
        errors.push('Need at least one latin letter with uppercase');
      !this.$v.password.maxLength &&
        errors.push('Password must be equal or less than 50 characters');
      !this.$v.password.minLength &&
        errors.push('Password must be equal or more than 6 characters');
      !this.$v.password.required && errors.push('Password is required');
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
      !this.$v.maxPrice.maxLength && errors.push('Input max 20 digits');
      !this.$v.maxPrice.hasMaxMoreMinPrice && errors.push('Error! max < min');
      return errors;
    },

    // error messages on search by min price input
    searchByminPriceErrors() {
      const errors = [];
      if (!this.$v.minPrice.$dirty) return errors;
      !this.$v.minPrice.maxLength && errors.push('Input max 20 digits');
      !this.$v.minPrice.hasMinLessMaxPrice && errors.push('Error! min > max');
      return errors;
    },

    // error messages on search by word input
    searchByWordErrors() {
      const errors = [];
      if (!this.$v.inputSearch.$dirty) return errors;
      !this.$v.inputSearch.maxLength &&
        errors.push(
          'input search by word must be equal or less than 30 characters'
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
        errors.push('Title must be equal or less than 60 characters');
      !this.$v.editedTitle.minLength &&
        errors.push('Title must be equal or more than 4 characters');
      !this.$v.editedTitle.required && errors.push('Title is required');
      return errors;
    },

    // error messages on description validation
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedDescription.$dirty) return errors;
      !this.$v.editedDescription.maxLength &&
        errors.push('Description must be equal or less than 1000 characters');
      !this.$v.editedDescription.minLength &&
        errors.push('Description must be equal or more than 30 characters');
      !this.$v.editedDescription.required &&
        errors.push('Description is required');
      return errors;
    },

    // error messages on price validation
    priceErrors() {
      const errors = [];
      if (!this.$v.editedPrice.$dirty) return errors;
      !this.$v.editedPrice.maxLength &&
        errors.push('Price must be equal or less than 20 digits');
      !this.$v.editedPrice.numeric && errors.push('Price must be a number');
      !this.$v.editedPrice.required && errors.push('Price is required');
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
        errors.push('Description must be equal or less than 1000 characters');
      !this.$v.description.minLength &&
        errors.push('Description must be equal or more than 30 characters');
      !this.$v.description.required && errors.push('Description is required');
      return errors;
    },
    // error messages on price validation
    priceErrors() {
      const errors = [];
      if (!this.$v.price.$dirty) return errors;
      !this.$v.price.maxLength &&
        errors.push('Price must be equal or less than 20 digits');
      !this.$v.price.numeric && errors.push('Price must be a number');
      !this.$v.price.required && errors.push('Price is required');
      return errors;
    },

    // error messages on title validation
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.maxLength &&
        errors.push('Title must be equal or less than 60 characters');
      !this.$v.title.minLength &&
        errors.push('Title must be equal or more than 4 characters');
      !this.$v.title.required && errors.push('Title is required');
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
      !this.$v.email.email && errors.push('Must be valid email');
      !this.$v.email.maxLength &&
        errors.push('Email must be equal or less than 1000 characters');
      !this.$v.email.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.email.required && errors.push('Email is required');
      return errors;
    },

    // error messages on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push('Password must be equal or less than 1000 characters');
      !this.$v.password.required && errors.push('Password is required');
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
      !this.$v.name.alpha && errors.push('Name must be only letters');
      !this.$v.name.maxLength &&
        errors.push('Name must be equal or less than 60 characters');
      !this.$v.name.minLength &&
        errors.push('Name must be equal or more than 2 characters');
      !this.$v.name.required && errors.push('Name is required');
      return errors;
    },

    // rules on phone number validation
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.numeric && errors.push('Phone number must be only digits');
      !this.$v.phone.maxLength &&
        errors.push('Phone number must be equal or less than 30 digits');
      !this.$v.phone.minLength &&
        errors.push('Phone number must be equal or more than 5 digits');
      !this.$v.phone.required && errors.push('Phone number is required');
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
        errors.push('Passwords must match');
      !this.$v.editedConfirmPassword.required &&
        this.editedPassword &&
        errors.push('Confirm password is required');
      return errors;
    },

    // rules on email validation
    editedEmailErrors() {
      const errors = [];
      if (!this.$v.editedEmail.$dirty) return errors;
      !this.$v.editedEmail.email && errors.push('Email must be valid');
      !this.$v.editedEmail.maxLength &&
        errors.push('Email must be equal or less than 30 characters');
      !this.$v.editedEmail.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.editedEmail.required && errors.push('Email is required');
      return errors;
    },

    // rules on name validation
    editedNameErrors() {
      const errors = [];
      if (!this.$v.editedName.$dirty) return errors;
      !this.$v.editedName.alpha && errors.push('Name must be only letters');
      !this.$v.editedName.maxLength &&
        errors.push('Name must be equal or less than 30 characters');
      !this.$v.editedName.minLength &&
        errors.push('Name must be equal or more than 3 characters');
      !this.$v.editedName.required && errors.push('Name is required');
      return errors;
    },

    // rules on password validation.Not cheсked if this.editedPassword is none.
    editedPasswordErrors() {
      const errors = [];
      if (!this.$v.editedPassword.$dirty) return errors;
      !this.$v.editedPassword.hasLowercaseLetter &&
        this.editedPassword &&
        errors.push('Need at least one latin letter with lowercase');
      !this.$v.editedPassword.hasNumber &&
        this.editedPassword &&
        errors.push('Need at least one digit');
      !this.$v.editedPassword.hasUppercaseLetter &&
        this.editedPassword &&
        errors.push('Need at least one latin letter with uppercase');
      !this.$v.editedPassword.maxLength &&
        this.editedPassword &&
        errors.push('Password must be equal or less than 50 characters');
      !this.$v.editedPassword.minLength &&
        this.editedPassword &&
        errors.push('Password must be equal or more than 6 characters');
      !this.$v.editedPassword.required &&
        this.editedPassword &&
        errors.push('Password is required');
      return errors;
    },
  },
};
