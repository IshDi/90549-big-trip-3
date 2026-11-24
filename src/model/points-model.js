import Observable from '../framework/observable.js';
import { UpdateType, Messages } from '../consts.js';
import { adaptPointToClient } from '../api/adapter.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;
  #isFailed = false;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(adaptPointToClient);
      this.#isFailed = false;
    } catch (error) {
      this.#points = [];
      this.#isFailed = true;
    }
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error(Messages.UNEXISTING_POINT);
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const updated = adaptPointToClient(response);

      this.#points = [...this.#points.slice(0, index), updated, ...this.#points.slice(index + 1)];

      this._notify(updateType, updated);
    } catch (error) {
      throw new Error(Messages.NO_UPDATE);
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = adaptPointToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (error) {
      throw new Error(Messages.NO_UPDATE);
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(Messages.UNEXISTING_POINT);
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
      this._notify(updateType);
    } catch (error) {
      throw new Error(Messages.NO_UPDATE);
    }
  }

  notifyInit() {
    this._notify(UpdateType.INIT);
  }
}
