import AbstractView from '../framework/view/abstract-view.js';

function createTripOfferTemplate(point, offers) {
  const selectedOffers = point?.offers ?? [];

  const offerInfo = offers
    .map(
      (offer) =>
        /* HTML */
        `<div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offer.id}-1"
            type="checkbox"
            name="event-offer-${offer.id}"
            ${selectedOffers.includes(offer.id) ? 'checked' : ''}
          />
          <label class="event__offer-label" for="event-offer-${offer.id}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`,
    )
    .join('');

  return offers.length
    ? `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
       ${offerInfo}
      </div>
    </section>`
    : '';
}

export default class TripOfferView extends AbstractView {
  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createTripOfferTemplate(this.#point, this.#offers);
  }
}
