import dayjs from 'dayjs';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SortType = {
  DAY: {
    type: 'day',
    label: 'Day',
    comparator: (a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)),
  },
  EVENT: {
    type: 'event',
    label: 'Event',
    disabled: true,
  },
  TIME: {
    type: 'time',
    label: 'Time',
    comparator: (a, b) => {
      const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
      const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
      return durationB - durationA;
    },
  },
  PRICE: {
    type: 'price',
    label: 'Price',
    comparator: (a, b) => b.basePrice - a.basePrice,
  },
  OFFER: {
    type: 'offer',
    label: 'Offers',
    disabled: true,
  },
};

const UpdateType = {
  PATCH: 'PATCH', // точечное изменение формы (звезда)
  MINOR: 'MINOR', // изменение списка
  MAJOR: 'MAJOR', // изменение фильтра/сортировка
  INIT: 'INIT', // первичная загрузка
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterPoints = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isSameOrBefore(dayjs()) && dayjs(point.dateTo).isSameOrAfter(dayjs())),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
};

const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const Messages = {
  FAILED: 'Failed to load latest route information',
  UNEXISTING_POINT: 'Cannot update unexisting point',
  NO_UPDATE: 'Cannot update point',
  LOAD: 'Loading...',
};

export { TYPES, SortType, FilterType, UpdateType, UserAction, FilterPoints, NoPointsText, Messages };
