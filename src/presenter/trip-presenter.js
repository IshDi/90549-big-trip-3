import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();

  #tripContainet = null;
  #pointsModel = null;

  constructor({ tripContainet, pointsModel }) {
    this.#tripContainet = tripContainet;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.eventListPoints = [...this.#pointsModel.points];

    render(new SortView(), this.#tripContainet);
    render(this.#tripListComponent, this.#tripContainet);

    const createPoint = new TripFormView({
      isEdit: false,
      point: this.eventListPoints[0],
      allOffers: this.#pointsModel.getOffersByType(this.eventListPoints[0].type),
      pointDestination: this.#pointsModel.getDestinationsById(this.eventListPoints[0].destination),
      allDestination: this.#pointsModel.descriptions,
    });

    render(createPoint, this.#tripListComponent.element);

    const editorPoint = new TripFormView({
      isEdit: true,
      point: this.eventListPoints[1],
      allOffers: this.#pointsModel.getOffersByType(this.eventListPoints[1].type),
      pointDestination: this.#pointsModel.getDestinationsById(this.eventListPoints[1].destination),
      allDestination: this.#pointsModel.descriptions,
    });

    render(editorPoint, this.#tripListComponent.element);

    for (let i = 2; i < this.eventListPoints.length; i++) {
      this.#renderPoint(this.eventListPoints[i]);
    }
  }

  #renderPoint(eventPoint) {
    const pointElement = new TripView({
      point: eventPoint,
      offers: this.#pointsModel.getOffersById(eventPoint.type, eventPoint.offers),
      destination: this.#pointsModel.getDestinationsById(eventPoint.destination),
    });

    render(pointElement, this.#tripListComponent.element);
  }
}
