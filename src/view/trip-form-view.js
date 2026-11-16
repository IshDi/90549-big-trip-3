import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize, formatDateTime } from '../util.js';
import { TYPES } from '../consts.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createTypeItems(type) {
  return TYPES.map(
    (item) =>
      /* HTML */
      `<div class="event__type-item">
        <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${item === type ? 'checked' : ''} />
        <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalize(item)}</label>
      </div>`,
  ).join('');
}

function createDestinationOptions(allDestination) {
  return allDestination.map((item) => `<option value="${item.name}"></option>`).join('');
}

function createPictures(pictures) {
  if (!pictures.length) {
    return '';
  }

  return `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.alt}" />`).join('')}
    </div>
  </div>`;
}

function createDestinationBlock(pointDestination) {
  if (!pointDestination?.description) {
    return '';
  }

  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      ${createPictures(pointDestination.pictures)}
    </section>`;
}

function createOffer(allOffers, selectedOfferIds) {
  return allOffers
    .map(
      (offer) =>
        /* HTML */
        `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offer.id}-1"
            type="checkbox"
            name="event-offer-${offer.id}"
            ${selectedOfferIds.includes(offer.id) ? 'checked' : ''}
            data-offer-id="${offer.id}"
          />
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`,
    )
    .join('');
}

function createOffersBlock(allOffers, selectedOfferIds) {
  if (!allOffers.length) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
       ${createOffer(allOffers, selectedOfferIds)}
      </div>
    </section>`;
}

function createDetailsBlock(pointDestination, allOffers, selectedOfferIds) {
  const offers = createOffersBlock(allOffers, selectedOfferIds);
  const destination = createDestinationBlock(pointDestination);

  if (!offers && !destination) {
    return '';
  }

  return `<section class="event__details">${offers}${destination}</section>`;
}

function createTripFormTemplate(state) {
  const { isEdit, point, allOffers, pointDestination, allDestination } = state;
  const { type, basePrice, dateFrom, dateTo, offers: selectedOfferIds } = point;

  const resetText = isEdit ? 'Delete' : 'Cancel';

  const rollupButton = isEdit
    ? `<button class="event__rollup-btn" type="button">
         <span class="visually-hidden">Open event</span>
       </button>`
    : '';

  const destinationName = pointDestination?.name ?? '';

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
                ${createTypeItems(type)}
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
            <datalist id="destination-list-1">${createDestinationOptions(allDestination)}</datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateTime(dateFrom)}" />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateTime(dateTo)}" />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetText}</button>
          ${rollupButton}
        </header>
        ${createDetailsBlock(pointDestination, allOffers, selectedOfferIds)}
      </form>
    </li>`
  );
}

export default class TripFormView extends AbstractStatefulView {
  #onFormSubmit = null;
  #onRollupClick = null;
  #getOffersByType = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({ isEdit = false, point, allOffers, pointDestination, allDestination, onFormSubmit, onRollupClick, getOffersByType }) {
    super();
    this._state = {
      isEdit,
      point,
      allOffers,
      pointDestination,
      allDestination,
    };

    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;
    this.#getOffersByType = getOffersByType;

    this._restoreHandlers();
  }

  get template() {
    return createTripFormTemplate(this._state);
  }

  get formElement() {
    return this.element.querySelector('.event--edit');
  }

  get rollupButton() {
    return this.element.querySelector('.event__rollup-btn');
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offerChangeHandler);
    });

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);

    this.formElement.addEventListener('submit', this.#formSubmitHandler);

    if (this.rollupButton) {
      this.rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    this.#setDatepickers();
  }

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;

    this.updateElement({
      point: { ...this._state.point, type: newType, offers: [] },
      allOffers: this.#getOffersByType(newType),
    });
  };

  #destinationChangeHandler = (evt) => {
    const name = evt.target.value;
    const destination = this._state.allDestination.find((d) => d.name === name);

    if (!destination) {
      return;
    }
    this.updateElement({
      point: { ...this._state.point, destination: destination.id },
      pointDestination: destination,
    });
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.dataset.offerId;
    const isChecked = evt.target.checked;

    const offers = isChecked ? [...this._state.point.offers, offerId] : this._state.point.offers.filter((id) => id !== offerId);

    this._setState({
      point: { ...this._state.point, offers },
    });
  };

  #priceChangeHandler = (evt) => {
    const price = Number(evt.target.value);

    if (Number.isNaN(price)) {
      return;
    }

    this._setState({
      point: { ...this._state.point, basePrice: price },
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit?.(this._state.point);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  #setDatepickers() {
    const startInput = this.element.querySelector('#event-start-time-1');
    const endInput = this.element.querySelector('#event-end-time-1');

    this.#startDatepicker = flatpickr(startInput, {
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateFrom,
      enableTime: true,
      onChange: this.#startDateChangeHandler,
    });

    this.#endDatepicker = flatpickr(endInput, {
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.point.dateTo,
      enableTime: true,
      minDate: this._state.point.dateFrom,
      onChange: this.#endDateChangeHandler,
    });
  }

  #startDateChangeHandler = ([userDate]) => {
    if (!userDate) {
      this._setState({
        point: { ...this._state.point, dateFrom: null },
      });
      return;
    }

    this._setState({
      point: { ...this._state.point, dateFrom: userDate.toISOString() },
    });

    if (this.#endDatepicker) {
      this.#endDatepicker.set('minDate', userDate);

      const endDate = this.#endDatepicker.selectedDates[0];
      if (endDate && endDate < userDate) {
        this.#endDatepicker.clear();
        this._setState({
          point: { ...this._state.point, dateTo: null },
        });
      }
    }
  };

  #endDateChangeHandler = ([userDate]) => {
    if (!userDate) {
      this._setState({
        point: { ...this._state.point, dateTo: null },
      });
      return;
    }

    this._setState({
      point: { ...this._state.point, dateTo: userDate.toISOString() },
    });
  };
}
