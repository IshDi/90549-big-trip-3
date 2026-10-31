import { render, replace, remove } from '../framework/render.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #eventPoint = null;
  #pointComponent = null;
  #formComponent = null;

  constructor({ pointListContainer, pointsModel }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init(eventPoint) {
    this.#eventPoint = eventPoint;

    const prevPointComponent = this.#pointComponent;
    const prevFormComponent = this.#formComponent;

    this.#pointComponent = this.#createPointComponent();

    if (prevPointComponent === null && prevFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
    } else {
      if (prevPointComponent && this.#pointListContainer.contains(prevPointComponent.element)) {
        replace(this.#pointComponent, prevPointComponent);
      }
      if (prevFormComponent && this.#pointListContainer.contains(prevFormComponent.element)) {
        replace(this.#pointComponent, prevFormComponent);
      }
    }
    remove(prevFormComponent);
    remove(prevPointComponent);

    this.#formComponent = null;
  }

  #destroy() {
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
      offers: this.#pointsModel.getOffersById(this.#eventPoint.type, this.#eventPoint.offers),
      destination: this.#pointsModel.getDestinationsById(this.#eventPoint.destination),
      onRollupClick: () => this.#replacePointToForm(),
    });
  }

  #replacePointToForm() {
    this.#formComponent = new TripFormView({
      isEdit: true,
      point: this.#eventPoint,
      allOffers: this.#pointsModel.getOffersByType(this.#eventPoint.type),
      pointDestination: this.#pointsModel.getDestinationsById(this.#eventPoint.destination),
      allDestination: this.#pointsModel.descriptions,
      onFormSubmit: (evt) => {
        evt.preventDefault();
        this.#replaceFormToPoint();
      },
      onRollupClick: () => this.#replaceFormToPoint(),
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
    this.#formComponent = null;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #bindEscape() {
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #unbindEscape() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }
}
