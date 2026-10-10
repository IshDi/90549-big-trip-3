import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripOfferView from '../view/trip-offer-view.js';
import TripDestinationView from '../view/trip-destination-view.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

const COUNT_TRIP = 3;
export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({tripContainet}) {
    this.tripContainet = tripContainet;
  }

  createTripFromItem(template) {
    const tripItemComponent = template;
    render(tripItemComponent, this.tripListComponent.getElement());
    render(new TripOfferView(), tripItemComponent.getElement().querySelector('.event__details'));
    render(new TripDestinationView(), tripItemComponent.getElement().querySelector('.event__details'));
    return tripItemComponent;
  }

  init() {
    render(new SortView(), this.tripContainet);
    render(this.tripListComponent, this.tripContainet);
    this.createTripFromItem(new TripFormView({ isEdit: false }));
    this.createTripFromItem(new TripFormView({ isEdit: true }));

    for (let i = 0; i < COUNT_TRIP; i++) {
      render(new TripView(), this.tripListComponent.getElement());
    }
  }
}
