import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters, currentFilterType) {
  return `<form class="trip-filters" action="#" method="get"> ${filters
    .map(
      (filter) =>
        /* HTML */
        `<div class="trip-filters__filter">
          <input
            id="filter-${filter.type}"
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="${filter.type}"
            ${filter.type === currentFilterType ? 'checked' : ''}
          />
          <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
        </div>`,
    )
    .join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    const input = evt.target.closest('.trip-filters__filter-input');
    if (!input) {
      return;
    }

    this.#handleFilterTypeChange?.(input.value);
  };
}
