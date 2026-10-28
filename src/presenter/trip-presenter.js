import { render, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = new SortView();
  #tripContainet = null;
  #pointsModel = null;
  #escHandler = null;
  // добавить когда нет точек NoPointView

  constructor({ tripContainet, pointsModel }) {
    this.#tripContainet = tripContainet;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.eventListPoints = [...this.#pointsModel.points];

    this.#renderTripEvents();
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripContainet);
  }

  #renderPoint(eventPoint) {
    const pointComponent = new TripView({
      point: eventPoint,
      offers: this.#pointsModel.getOffersById(eventPoint.type, eventPoint.offers),
      destination: this.#pointsModel.getDestinationsById(eventPoint.destination),
      onRollupClick: () => this.#replacePointToForm(pointComponent, eventPoint),
    });

    render(pointComponent, this.#tripListComponent.element);
  }

  #replacePointToForm(pointComponent, eventPoint) {
    const formComponent = new TripFormView({
      isEdit: true,
      point: eventPoint,
      allOffers: this.#pointsModel.getOffersByType(eventPoint.type),
      pointDestination: this.#pointsModel.getDestinationsById(eventPoint.destination),
      allDestination: this.#pointsModel.descriptions,
      onFormSubmit: (evt) => {
        evt.preventDefault();
        this.#replaceFormToPoint(formComponent, eventPoint);
      },
      onRollupClick: () => this.#replaceFormToPoint(formComponent, eventPoint),
    });

    this.#bindEscape(formComponent, eventPoint);

    replace(formComponent, pointComponent);
  }

  #replaceFormToPoint(formComponent, eventPoint) {
    this.#unbindEscape();

    const pointComponent = new TripView({
      point: eventPoint,
      offers: this.#pointsModel.getOffersById(eventPoint.type, eventPoint.offers),
      destination: this.#pointsModel.getDestinationsById(eventPoint.destination),
      onRollupClick: () => this.#replacePointToForm(pointComponent, eventPoint),
    });

    replace(pointComponent, formComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#escHandler?.();
    }
  };

  #bindEscape(formComponent, eventPoint) {
    this.#escHandler = () => this.#replaceFormToPoint(formComponent, eventPoint);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #unbindEscape() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#escHandler = null;
  }

  #renderPointList() {
    render(this.#tripListComponent, this.#tripContainet);
  }

  #renderTripEvents() {
    this.#renderSort();
    this.#renderPointList();

    for (let i = 0; i < this.eventListPoints.length; i++) {
      this.#renderPoint(this.eventListPoints[i]);
    }
  }
}
