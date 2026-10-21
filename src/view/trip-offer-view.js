import { createElement } from '../render.js';

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

export default class TripOfferView {
  constructor(point, offers) {
    this.point = point;
    this.offers = offers;
  }

  getTemplate() {
    return createTripOfferTemplate(this.point, this.offers);
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
