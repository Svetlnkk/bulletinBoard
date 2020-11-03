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
