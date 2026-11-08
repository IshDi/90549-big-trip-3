import { render, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../consts.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = null;
  #tripContainet = null;
  #pointsModel = null;
  #sourcedPoints = [];
  #currentSortType = SortType.DAY;
  #eventListPoints = [];
  #pointPresenters = new Map();
  // добавить когда нет точек NoPointView

  constructor({ tripContainet, pointsModel }) {
    this.#tripContainet = tripContainet;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#eventListPoints = [...this.#pointsModel.points];

    this.#sourcedPoints = [...this.#pointsModel.points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    this.#renderTripEvents();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#eventListPoints.sort((a, b) => {
          const durationA = new Date(a.dateFrom) - new Date(a.dateTo);
          const durationB = new Date(b.dateFrom) - new Date(b.dateTo);
          return durationA - durationB;
        });
        break;

      case SortType.PRICE:
        this.#eventListPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;

      default:
        this.#eventListPoints = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#tripContainet);
  }

  #renderPointList() {
    render(this.#tripListComponent, this.#tripContainet);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#tripListComponent);
    this.#tripListComponent = new TripListView();
  }

  #renderPoint(eventPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onFormOpen: this.#resetAllViews,
    });

    pointPresenter.init(eventPoint);
    this.#pointPresenters.set(eventPoint.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#eventListPoints = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    const present = this.#pointPresenters.get(updatedPoint.id);
    present.init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
    this.#renderPoints();
  };

  #renderPoints() {
    for (const eventPoint of this.#eventListPoints) {
      this.#renderPoint(eventPoint);
    }
  }

  #renderTripEvents() {
    this.#sortPoints(this.#currentSortType);

    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
  }

  #resetAllViews = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
