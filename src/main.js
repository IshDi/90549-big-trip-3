import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

import { render, RenderPosition } from './framework/render.js';
import BigTripApiService from './api/big-trip-api-service.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const apiService = new BigTripApiService(END_POINT, AUTHORIZATION);

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel({ pointsApiService: apiService });
const destinationsModel = new DestinationsModel({ apiService });
const offersModel = new OffersModel({ apiService });
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripContainet: siteTripEventsElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteTripFilterElement,
  filterModel,
});

render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);

tripPresenter.init();
filterPresenter.init();

Promise.all([pointsModel.init(), destinationsModel.init(), offersModel.init()]).finally(() => {
  if (newEventButton) {
    newEventButton.disabled = false;
  }
});

if (newEventButton) {
  newEventButton.addEventListener('click', tripPresenter.handleNewPointClick);
}
