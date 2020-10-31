export class Ad {
  constructor({
    dateAdded = '',
    description = '',
    id = null,
    imageSrc = '',
    ownerId = '',
    price = 0,
    promo = false,
    title = '',
  }) {
    this.dateAdded = dateAdded;
    this.description = description;
    this.id = id;
    this.imageSrc = imageSrc;
    this.ownerId = ownerId;
    this.price = price;
    this.promo = promo;
    this.title = title;
  }
}

export class Order {
  constructor({ adId = '', done = false, id = null, name = '', phone = '' }) {
    this.adId = adId;
    this.done = done;
    this.id = id;
    this.name = name;
    this.phone = phone;
  }
}

export class User {
  constructor({ id, email, name = '' }) {
    this.email = email;
    this.id = id;
    this.name = name;
  }
}
