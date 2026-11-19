import { render, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, FilterPoints, UpdateType } from '../consts.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #tripContainet = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #currentSortType = SortType.DAY.type;
  #eventListPoints = [];
  #pointPresenters = new Map();

  constructor({ tripContainet, pointsModel, destinationsModel, offersModel, filterModel }) {
    this.#tripContainet = tripContainet;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    return FilterPoints[filterType](points);
  }

  init() {
    this.#renderTripEvents();
  }

  #handleModelChange = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      this.#currentSortType = SortType.DAY.type;
      this.#clearTripEvents();
      this.#renderTripEvents();
    }
  };

  #clearTripEvents() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#tripListComponent);
    remove(this.#noPointsComponent);
    this.#tripListComponent = new TripListView();
    this.#sortComponent = null;
    this.#noPointsComponent = null;
  }

  #renderTripEvents() {
    this.#eventListPoints = [...this.points];

    if (this.#eventListPoints.length === 0) {
      this.#noPointsComponent = new NoPointsView({
        filterType: this.#filterModel.filter,
      });
      render(this.#noPointsComponent, this.#tripContainet);
      return;
    }

    this.#sortPoints(this.#currentSortType);

    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
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

  #renderPoint(eventPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onFormOpen: this.#resetAllViews,
    });

    pointPresenter.init(eventPoint);
    this.#pointPresenters.set(eventPoint.id, pointPresenter);
  }

  #renderPoints() {
    for (const eventPoint of this.#eventListPoints) {
      this.#renderPoint(eventPoint);
    }
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

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#tripListComponent);
    this.#tripListComponent = new TripListView();
  }

  #resetAllViews = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
