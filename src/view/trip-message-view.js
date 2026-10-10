import { createElement } from '../render.js';

function createTripMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class TripMessageView {
  constructor(message = '') {
    this.message = message;
  }

  getTemplate() {
    return createTripMessageTemplate(this.message);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
