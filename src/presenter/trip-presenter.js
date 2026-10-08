import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripItemView from '../view/trip-item-view.js';
import TripAddView from '../view/trip-add-view.js';
import TripOfferView from '../view/trip-offer-view.js';
import TripDestinationView from '../view/trip-destination-view.js';
import TripEditView from '../view/trip-edit-view.js';
import TripView from '../view/trip-view.js';

const COUNT_TRIP = 3;

export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({tripContainet}) {
    this.tripContainet = tripContainet;
  }

  createTripItem(template, option = true) {
    const tripItemComponent = new TripItemView();
    render(tripItemComponent, this.tripListComponent.getElement());
    render(template, tripItemComponent.getElement());
    if (option) {
      render(new TripOfferView(), template.getElement());
      render(new TripDestinationView(), template.getElement());
    }
    return tripItemComponent;
  }

  init() {
    render(new SortView(), this.tripContainet);
    render(this.tripListComponent, this.tripContainet);

    this.createTripItem(new TripAddView());
    this.createTripItem(new TripEditView());

    for (let i = 0; i < COUNT_TRIP; i++) {
      this.createTripItem(new TripView(), false);
    }
  }
}
