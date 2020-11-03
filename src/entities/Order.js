export class Order {
  constructor({ adId = '', done = false, id = null, name = '', phone = '' }) {
    this.adId = adId;
    this.done = done;
    this.id = id;
    this.name = name;
    this.phone = phone;
  }
}
