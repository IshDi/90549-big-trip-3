import { render, replace, remove } from '../framework/render.js';
import { FilterType, UpdateType } from '../consts.js';
import FilterView from '../view/filter-view.js';
import { getFilterAvailability } from '../util.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelChange);
    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  get filters() {
    return [
      { type: FilterType.EVERYTHING, name: 'Everything' },
      { type: FilterType.FUTURE, name: 'Future' },
      { type: FilterType.PRESENT, name: 'Present' },
      { type: FilterType.PAST, name: 'Past' },
    ];
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      filterAvailability: getFilterAvailability(this.#pointsModel.points),
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    if (this.#filterContainer.contains(prevFilterComponent.element)) {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    } else {
      render(this.#filterComponent, this.#filterContainer);
    }
  }

  #handleModelChange = (updateType) => {
    if (updateType === UpdateType.PATCH) {
      return;
    }

    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
