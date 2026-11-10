import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

function createSortItemTemplate({ type, label, disabled = false }, currentType) {
  const checked = !disabled && type === currentType;
  return (
    /* HTML */
    `<div class="trip-sort__item  trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input
      visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        data-sort-type="${type}"
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
      />
      <label class="trip-sort__btn" for="sort-${type}">${label}</label>
    </div>`
  );
}

function createSortTemplate(currentType) {
  const items = Object.values(SortType)
    .map((sort) => createSortItemTemplate(sort, currentType))
    .join('');

  return (
    /* HTML */
    ` <form class="trip-events__trip-sort  trip-sort" action="#" method="get">${items}</form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentType = null;

  constructor({ onSortTypeChange, currentType = SortType.DAY.type }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentType = currentType;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentType);
  }

  #sortTypeChangeHandler = (evt) => {
    const input = evt.target.closest('.trip-sort__input');
    if (!input || input.disabled) {
      return;
    }

    this.#handleSortTypeChange?.(input.dataset.sortType);
  };
}
