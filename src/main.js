import { render, RenderPosition } from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
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
