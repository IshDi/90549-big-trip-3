import AbstractStatefulView from '../framework/view/abstract-view.js';

function createTripInfoTemplate({ route, dates, totalCost }) {
  return (
    /* HTML */
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route || ''}</h1>
        <p class="trip-info__dates">${dates || ''}</p>
      </div>
      <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost || 0}</span></p>
    </section>`
  );
}

export default class TripInfoView extends AbstractStatefulView {
  constructor({ route = '', dates = '', totalCost = 0 }) {
    super();
    this._state = { route, dates, totalCost };
  }

  get template() {
    return createTripInfoTemplate(this._state);
  }
}
