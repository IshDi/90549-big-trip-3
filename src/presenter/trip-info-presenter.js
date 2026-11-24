import { render, replace, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { getTripRoute, getTripDates, getTripTotalCost } from '../util.js';
import { UpdateType } from '../consts.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel, destinationsModel, offersModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

  #handleModelChange = (updateType) => {
    if (updateType === UpdateType.PATCH) {
      return;
    }
    this.#renderTripInfo();
  };

  #renderTripInfo() {
    const points = this.#pointsModel.points;

    const data = {
      route: getTripRoute(points, this.#destinationsModel),
      dates: getTripDates(points),
      totalCost: getTripTotalCost(points, this.#offersModel),
    };

    const prevComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(data);

    if (prevComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevComponent);
  }
}
