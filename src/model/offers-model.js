import Observable from '../framework/observable.js';
import { mockOffers } from '../mock/offers.js';

export default class OffersModel extends Observable {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((item) => item.type === type)?.offers ?? [];
  }

  getById(type, itemsId) {
    const offersByType = this.getByType(type);
    return offersByType.filter((item) => itemsId.includes(item.id));
  }
}
