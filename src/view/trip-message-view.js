import AbstractView from '../framework/view/abstract-view.js';

function createTripMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class TripMessageView extends AbstractView {
  #message = null;

  constructor(message = '') {
    super();
    this.#message = message;
  }

  get template() {
    return createTripMessageTemplate(this.#message);
  }
}
