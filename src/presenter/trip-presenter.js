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
  #currentSortType = SortType.DAY.type;
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

  #sortPoints(sortType) {
    const sort = Object.values(SortType).find((s) => s.type === sortType);

    if (!sort || sort.disabled) {
      return;
    }

    this.#eventListPoints.sort(sort.comparator);
    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentType: this.#currentSortType,
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
    this.#sortPoints(this.#currentSortType);
    this.#clearPointList();
    this.#renderPointList();
    this.#renderPoints();
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
