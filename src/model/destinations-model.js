import Observable from '../framework/observable.js';
import { mockDestinations } from '../mock/description.js';

export default class DestinationsModel extends Observable {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((item) => item.id === id);
  }
}
