import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsText } from '../consts.js';

function createNoPointsTemplate(filterType) {
  return `<p class="trip-events__msg">${NoPointsText[filterType]}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
