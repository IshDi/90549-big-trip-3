import { mockDescriptions } from '../mock/description.js';
import { mockOffers } from '../mock/offers.js';
import { getRandomPoint } from '../mock/points.js';

const POINT_COUNT = 5;

export default class PointsModel {
  points = Array.from({ length: POINT_COUNT }, getRandomPoint);
  descriptions = mockDescriptions;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDescriptions() {
    return this.descriptions;
  }

  getOffers() {
    return this.offers;
  }

  getDestinationsById(id) {
    const allDestinations = this.getDescriptions();
    return allDestinations.find((item) => item.id === id);
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((item) => item.type === type)?.offers ?? [];
  }

  getOffersById(type, itemsId) {
    const offersByType = this.getOffersByType(type);
    return offersByType.filter((item) => itemsId.includes(item.id));
  }
}
