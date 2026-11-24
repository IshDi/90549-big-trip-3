import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];
  #apiService = null;
  #isFailed = false;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#offers = await this.#apiService.offers;
      this.#isFailed = false;
    } catch (error) {
      this.#offers = [];
      this.#isFailed = true;
    }
  }

  getByType(type) {
    return this.#offers.find((item) => item.type === type)?.offers ?? [];
  }

  getById(type, itemsId) {
    const offersByType = this.getByType(type);
    return offersByType.filter((item) => itemsId.includes(item.id));
  }
}
