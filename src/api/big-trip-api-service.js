import ApiService from '../framework/api-service.js';
import { adaptPointToServer } from './adapter.js';
import { Url, Method } from '../consts.js';

export default class BigTripApiService extends ApiService {
  get points() {
    return this._load({ url: Url.POINTS }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: Url.DESTINATIONS }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: Url.OFFERS }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
