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
    return this.#descriptions.find((item) => item.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((item) => item.type === type)?.offers ?? [];
  }

  getOffersById(type, itemsId) {
    const offersByType = this.getOffersByType(type);
    return offersByType.filter((item) => itemsId.includes(item.id));
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => (point.id === updatedPoint.id ? updatedPoint : point));
  }
}
