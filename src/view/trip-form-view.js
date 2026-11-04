import AbstractView from '../framework/view/abstract-view.js';
import { capitalize, formatDateTime } from '../util.js';
import { TYPES } from '../consts.js';
import TripOfferView from './trip-offer-view.js';

function createTripFormTemplate(isEdit, point, allOffers, pointDestination, allDestination) {
  const resetText = isEdit ? 'Delete' : 'Cancel';

  const rollupButton = isEdit
    ? `<button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>`
    : '';

  const type = point?.type ?? TYPES[5];

  const destinationName = pointDestination?.name ?? '';

  const destinationOptions = allDestination.map((item) => `<option value="${item.name}"></option>`).join('');

  const pictures = pointDestination?.pictures.length
    ? `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.alt}" />`).join('')}
        </div>
      </div>`
    : '';

  const destinationBlock = pointDestination?.description
    ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      ${pictures}
    </section>`
    : '';

  const typeItems = TYPES.map(
    (item) =>
      /* HTML */
      `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''} />
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalize(item)}</label>
      </div>`,
  ).join('');

  const offersBlock = new TripOfferView(point, allOffers).template;

  return (
    /* HTML */
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon" />
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" />

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeItems}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1"> ${capitalize(type)} </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destinationName}"
              list="destination-list-1"
            />
            <datalist id="destination-list-1">${destinationOptions}</datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateTime(point.dateFrom)}" />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateTime(point.dateTo)}" />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}" />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetText}</button>
          ${rollupButton}
        </header>
        <section class="event__details">${offersBlock}${destinationBlock}</section>
      </form>
    </li>`
  );
}

export default class TripFormView extends AbstractView {
  #isEdit = null;
  #point = null;
  #allOffers = null;
  #pointDestination = null;
  #allDestination = null;

  constructor({ isEdit = false, point, allOffers, pointDestination, allDestination, onFormSubmit, onRollupClick }) {
    super();
    this.#isEdit = isEdit;
    this.#point = point;
    this.#allOffers = allOffers;
    this.#pointDestination = pointDestination;
    this.#allDestination = allDestination;

    this.formElement.addEventListener('submit', onFormSubmit);

    if (this.rollupButton) {
      this.rollupButton.addEventListener('click', onRollupClick);
    }
  }

  get template() {
    return createTripFormTemplate(this.#isEdit, this.#point, this.#allOffers, this.#pointDestination, this.#allDestination);
  }

  get formElement() {
    return this.element.querySelector('.event--edit');
  }

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }
}
