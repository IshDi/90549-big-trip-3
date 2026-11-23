import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import TripFormView from '../view/trip-form-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, FilterPoints, FilterType, UpdateType, UserAction } from '../consts.js';

export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #newPointComponent = null;
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

  handleNewPointClick = () => {
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY.type;
    this.#resetAllViews();

    if (this.#newPointComponent) {
      return;
    }

    this.#newPointComponent = new TripFormView({
      isEdit: false,
      point: {
        id: crypto.randomUUID(),
        type: 'flight',
        destination: null,
        dateFrom: null,
        dateTo: null,
        basePrice: 0,
        offers: [],
        isFavorite: false,
      },
      allOffers: this.#offersModel.getByType('flight'),
      pointDestination: null,
      allDestination: this.#destinationsModel.destinations,
      onFormSubmit: (newPoint) => {
        this.#handleViewAction(UserAction.ADD_POINT, UpdateType.MINOR, newPoint);
        this.#destroyNewPointForm();
      },
      onRollupClick: () => this.#destroyNewPointForm(),
      getOffersByType: (type) => this.#offersModel.getByType(type),
    });

    document.addEventListener('keydown', this.#handleNewPointEsc);

    const container = this.#eventListPoints.length > 0 ? this.#tripListComponent.element : this.#tripContainet;
    render(this.#newPointComponent, container, RenderPosition.AFTERBEGIN);

    const button = document.querySelector('.trip-main__event-add-btn');
    if (button) {
      button.disabled = true;
    }
  };

  #handleNewPointEsc = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#destroyNewPointForm();
    }
  };

  #destroyNewPointForm() {
    if (this.#newPointComponent) {
      document.removeEventListener('keydown', this.#handleNewPointEsc);
      remove(this.#newPointComponent);
      this.#newPointComponent = null;
      const button = document.querySelector('.trip-main__event-add-btn');
      if (button) {
        button.disabled = false;
      }
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update.id);
        break;
    }
  };

  #handleModelChange = (updateType, payload) => {
    switch (updateType) {
      case UpdateType.PATCH: {
        const presenter = this.#pointPresenters.get(payload.id);
        if (presenter) {
          presenter.init(payload);
        }
        break;
      }
      case UpdateType.MINOR:
        this.#clearTripEvents();
        this.#renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DAY.type;
        this.#clearTripEvents();
        this.#renderTripEvents();
        break;
      case UpdateType.INIT:
        this.#renderTripEvents();
        break;
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
      onDataChange: this.#handleViewAction,
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    remove(this.#sortComponent);
    this.#renderSort();
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
