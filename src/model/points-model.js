import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points.js';

const POINT_COUNT = 5;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);

  get points() {
    return this.#points;
  }

  setPoints(updateType, points) {
    this.#points = points;
    this._notify(updateType, points);
  }

  updatePoint(updateType, updatedPoint) {
    this.#points = this.#points.map((point) => (point.id === updatedPoint.id ? updatedPoint : point));
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [...this.#points, newPoint];
    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
    this._notify(updateType, pointId);
  }
}
