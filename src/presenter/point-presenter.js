import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../consts.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #handleDataChange = null;
  #eventPoint = null;
  #pointComponent = null;
  #formComponent = null;
  #handleFormOpen = null;

  constructor({ pointListContainer, pointsModel, destinationsModel, offersModel, onDataChange, onFormOpen }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleFormOpen = onFormOpen;
  }

  init(eventPoint) {
    this.#eventPoint = eventPoint;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;

    this.#pointComponent = this.#createPointComponent();

    if (prevPointComponent === null && prevFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }
    if (prevPointComponent && this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (prevFormComponent && this.#pointListContainer.contains(prevFormComponent.element)) {
      replace(this.#pointComponent, prevFormComponent);
    }
    remove(prevFormComponent);
    remove(prevPointComponent);

    this.#formComponent = null;
  }

  destroy() {
    this.#unbindEscape();
    remove(this.#pointComponent);
    remove(this.#formComponent);

    this.#pointComponent = null;
    this.#formComponent = null;
    this.#eventPoint = null;
  }

  #createPointComponent() {
    return new TripView({
      point: this.#eventPoint,
      offers: this.#offersModel.getById(this.#eventPoint.type, this.#eventPoint.offers),
      destination: this.#destinationsModel.getById(this.#eventPoint.destination),
      onRollupClick: () => this.#replacePointToForm(),
      onFavoriteClick: this.#favoriteClickHandler,
    });
  }

  #favoriteClickHandler = () => {
    this.#handleDataChange?.(UserAction.UPDATE_POINT, UpdateType.PATCH, {
      ...this.#eventPoint,
      isFavorite: !this.#eventPoint.isFavorite,
    });
  };

  #replacePointToForm() {
    this.#handleFormOpen?.();

    this.#formComponent = new TripFormView({
      isEdit: true,
      point: this.#eventPoint,
      allOffers: this.#offersModel.getByType(this.#eventPoint.type),
      pointDestination: this.#destinationsModel.getById(this.#eventPoint.destination),
      allDestination: this.#destinationsModel.destinations,
      onFormSubmit: (updatedPoint) => {
        this.#handleDataChange?.(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
      },
      onRollupClick: () => this.#replaceFormToPoint(),
      onDeleteClick: (point) => {
        this.#handleDataChange?.(UserAction.DELETE_POINT, UpdateType.MINOR, point);
      },
      getOffersByType: (type) => this.#offersModel.getByType(type),
    });

    this.#bindEscape();
    replace(this.#formComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    if (!this.#formComponent) {
      return;
    }
    this.#unbindEscape();

    this.#pointComponent = this.#createPointComponent();
    replace(this.#pointComponent, this.#formComponent);
    this.#formComponent.removeElement();
    this.#formComponent = null;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if (this.#formComponent?.isSaving) {
        return;
      }
      this.#replaceFormToPoint();
    }
  };

  resetView() {
    if (this.#formComponent) {
      this.#replaceFormToPoint();
    }
  }

  #bindEscape() {
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #unbindEscape() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  setSaving() {
    if (this.#formComponent) {
      this.#formComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#formComponent) {
      this.#formComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (!this.#formComponent) {
      this.#pointComponent?.shake?.();
      return;
    }

    const resetFormState = () => {
      this.#formComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formComponent.shake(resetFormState);
  }
}
