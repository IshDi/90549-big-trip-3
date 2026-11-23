import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch (error) {
      this.#destinations = [];
    }
  }

  getById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
