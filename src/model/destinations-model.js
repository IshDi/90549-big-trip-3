import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #apiService = null;
  #isFailed = false;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
      this.#isFailed = false;
    } catch (error) {
      this.#destinations = [];
      this.#isFailed = true;
    }
  }

  getById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
