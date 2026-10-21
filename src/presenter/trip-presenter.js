import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripFormView from '../view/trip-form-view.js';
import TripView from '../view/trip-view.js';

export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({ tripContainet, pointsModel }) {
    this.tripContainet = tripContainet;
    this.pointsModel = pointsModel;
  }

  init() {
    this.eventListPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.tripContainet);
    render(this.tripListComponent, this.tripContainet);

    const createPoint = new TripFormView({
      isEdit: false,
      point: this.eventListPoints[0],
      allOffers: this.pointsModel.getOffersByType(this.eventListPoints[0].type),
      pointDestination: this.pointsModel.getDestinationsById(this.eventListPoints[0].destination),
      allDestination: this.pointsModel.getDescriptions(),
    });

    render(createPoint, this.tripListComponent.getElement());

    const editorPoint = new TripFormView({
      isEdit: true,
      point: this.eventListPoints[1],
      allOffers: this.pointsModel.getOffersByType(this.eventListPoints[1].type),
      pointDestination: this.pointsModel.getDestinationsById(this.eventListPoints[1].destination),
      allDestination: this.pointsModel.getDescriptions(),
    });

    render(editorPoint, this.tripListComponent.getElement());

    for (let i = 2; i < this.eventListPoints.length; i++) {
      const point = new TripView({
        point: this.eventListPoints[i],
        offers: [...this.pointsModel.getOffersById(this.eventListPoints[i].type, this.eventListPoints[i].offers)],
        destination: this.pointsModel.getDestinationsById(this.eventListPoints[i].destination),
      });
      render(point, this.tripListComponent.getElement());
    }
  }
}
