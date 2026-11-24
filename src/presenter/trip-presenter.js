import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import MessageView from '../view/message-view.js';
import TripFormView from '../view/trip-form-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, FilterPoints, FilterType, UpdateType, UserAction, NoPointsText, Messages, DEFAULT_POINT_TYPE, TimeLimit } from '../consts.js';
export default class TripPresenter {
  #tripListComponent = new TripListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new MessageView({ text: Messages.LOAD });
  #failedComponent = null;
  #newPointComponent = null;
  #tripContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #newEventButtonElement = null;
  #currentSortType = SortType.DAY.type;
  #eventListPoints = [];
  #pointPresenters = new Map();
  #isLoading = true;
  #hasEverRendered = false;

  constructor({ tripContainer, pointsModel, destinationsModel, offersModel, filterModel, newEventButtonElement }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newEventButtonElement = newEventButtonElement;

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

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

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
        this.#isLoading = false;

        if (this.#loadingComponent) {
          remove(this.#loadingComponent);
          this.#loadingComponent = null;
        }

        if (this.#pointsModel.isFailed || this.#destinationsModel.isFailed || this.#offersModel.isFailed) {
          this.#failedComponent = new MessageView({
            text: Messages.FAILED,
          });
          render(this.#failedComponent, this.#tripContainer);
        } else {
          this.#renderTripEvents();
        }
        break;
    }
  };

  #renderTripEvents() {
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#tripContainer);
      return;
    }

    this.#eventListPoints = [...this.points];

    if (this.#eventListPoints.length === 0) {
      if (this.#newPointComponent) {
        return;
      }

      this.#renderNoPoints();
      return;
    }

    this.#sortPoints(this.#currentSortType);
    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();

    if (this.#newPointComponent) {
      render(this.#newPointComponent, this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
    }

    this.#hasEverRendered = true;
  }

  #clearTripEvents() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#tripListComponent);
    remove(this.#noPointsComponent);
    remove(this.#failedComponent);
    this.#tripListComponent = new TripListView();
    this.#sortComponent = null;
    this.#noPointsComponent = null;
    this.#failedComponent = null;
  }

  handleNewPointClick = () => {
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }

    if (this.#filterModel.filter !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    this.#currentSortType = SortType.DAY.type;
    this.#resetAllViews();

    if (this.#newPointComponent) {
      return;
    }

    this.#newPointComponent = new TripFormView({
      isEdit: false,
      point: {
        id: crypto.randomUUID(),
        type: DEFAULT_POINT_TYPE,
        destination: null,
        dateFrom: null,
        dateTo: null,
        basePrice: 0,
        offers: [],
        isFavorite: false,
      },
      allOffers: this.#offersModel.getByType(DEFAULT_POINT_TYPE),
      pointDestination: null,
      allDestination: this.#destinationsModel.destinations,
      onFormSubmit: (newPoint) => {
        this.#handleViewAction(UserAction.ADD_POINT, UpdateType.MINOR, newPoint);
      },
      onRollupClick: () => this.#destroyNewPointForm(),
      getOffersByType: (type) => this.#offersModel.getByType(type),
    });

    document.addEventListener('keydown', this.#handleNewPointEsc);

    const container = this.#eventListPoints.length > 0 ? this.#tripListComponent.element : this.#tripContainer;
    render(this.#newPointComponent, container, RenderPosition.AFTERBEGIN);

    if (this.#newEventButtonElement) {
      this.#newEventButtonElement.disabled = true;
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
      if (this.#newEventButtonElement) {
        this.#newEventButtonElement.disabled = false;
      }
      if (this.#pointsModel.points.length === 0) {
        this.#renderNoPoints();
      }
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT: {
        const presenter = this.#pointPresenters.get(update.id);
        presenter?.setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch {
          presenter?.setAborting();
        }
        break;
      }

      case UserAction.ADD_POINT: {
        this.#newPointComponent?.updateElement({
          isDisabled: true,
          isSaving: true,
        });
        if (this.#newEventButtonElement) {
          this.#newEventButtonElement.disabled = true;
        }
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#destroyNewPointForm();
        } catch {
          const form = this.#newPointComponent;
          if (form) {
            form.shake(() =>
              form.updateElement({
                isDisabled: false,
                isSaving: false,
                isDeleting: false,
              }),
            );
          }
          if (this.#newEventButtonElement) {
            this.#newEventButtonElement.disabled = false;
          }
        }
        break;
      }

      case UserAction.DELETE_POINT: {
        const presenter = this.#pointPresenters.get(update.id);
        presenter?.setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          presenter?.setAborting();
        }
        break;
      }
    }
    this.#uiBlocker.unblock();
  };

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

    render(this.#sortComponent, this.#tripContainer);
  }

  #renderNoPoints() {
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      this.#noPointsComponent = null;
    }
    const filterType = this.#hasEverRendered ? this.#filterModel.filter : FilterType.EVERYTHING;
    this.#noPointsComponent = new MessageView({ text: NoPointsText[filterType] });
    render(this.#noPointsComponent, this.#tripContainer);
  }

  #renderPointList() {
    render(this.#tripListComponent, this.#tripContainer);
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
    this.#eventListPoints.forEach((eventPoint) => this.#renderPoint(eventPoint));
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
    if (this.#newPointComponent) {
      this.#destroyNewPointForm();
    }
  };
}
