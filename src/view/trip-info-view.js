import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate({ route, dates, totalCost }) {
  return (
    /* HTML */
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${he.encode(route || '')}</h1>
        <p class="trip-info__dates">${he.encode(dates || '')}</p>
      </div>
      <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost || 0}</span></p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #data = {};

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createTripInfoTemplate(this.#data);
  }
}
