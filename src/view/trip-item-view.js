import { createElement } from '../render.js';

function createTripItemTemplate() {
  return '<li class="trip-events__item"></li>';
}

export default class TripItemView {
  getTemplate() {
    return createTripItemTemplate();
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
