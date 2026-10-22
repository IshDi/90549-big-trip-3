import { mockDescriptions } from '../mock/description.js';
import { mockOffers } from '../mock/offers.js';
import { getRandomPoint } from '../mock/points.js';

const POINT_COUNT = 5;

export default class PointsModel {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);
  #descriptions = mockDescriptions;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get descriptions() {
    return this.#descriptions;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationsById(id) {
    const allDestinations = this.descriptions;
    return allDestinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((item) => item.type === type)?.offers ?? [];
  }

  getOffersById(type, itemsId) {
    const offersByType = this.getOffersByType(type);
    return offersByType.filter((item) => itemsId.includes(item.id));
  }
}
