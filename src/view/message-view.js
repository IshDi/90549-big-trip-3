import AbstractView from '../framework/view/abstract-view.js';

function createNoPointsTemplate(text) {
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class MessageView extends AbstractView {
  #text = '';

  constructor({ text }) {
    super();
    this.#text = text;
  }

  get template() {
    return createNoPointsTemplate(this.#text);
  }
}
