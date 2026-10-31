import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = new SortView();
  #tripContainet = null;
  #pointsModel = null;
  #eventListPoints = [];
  #pointPresenters = new Map();
  // добавить когда нет точек NoPointView

  constructor({ tripContainet, pointsModel }) {
    this.#tripContainet = tripContainet;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventListPoints = [...this.#pointsModel.points];

    this.#renderTripEvents();
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripContainet);
  }

  #renderPointList() {
    render(this.#tripListComponent, this.#tripContainet);
  }

  #renderPoint(eventPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      pointsModel: this.#pointsModel,
    });

    pointPresenter.init(eventPoint);
    this.#pointPresenters.set(eventPoint.id, pointPresenter);
  }

  #renderTripEvents() {
    this.#renderSort();
    this.#renderPointList();

    for (let i = 0; i < this.#eventListPoints.length; i++) {
      this.#renderPoint(this.#eventListPoints[i]);
    }
  }
}
