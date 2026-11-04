import { render, RenderPosition } from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const siteTripMainElement = document.querySelector('.trip-main');
const siteTripFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  tripContainet: siteTripEventsElement,
  pointsModel,
});

render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), siteTripFilterElement);

tripPresenter.init();
