import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points.js';

const POINT_COUNT = 5;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, getRandomPoint);

  get points() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
    this._notify('SET_POINTS', points);
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) => (point.id === updatedPoint.id ? updatedPoint : point));
    this._notify('UPDATE_POINT', updatedPoint);
  }
}
