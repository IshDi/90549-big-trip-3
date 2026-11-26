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

const ButtonText = {
  SAVE: 'Save',
  SAVING: 'Saving...',
  DELETE: 'Delete',
  DELETING: 'Deleting...',
  CANCEL: 'Cancel',
};

const ClassName = {
  ROLLUP_BUTTON: 'event__rollup-btn',
  FAVORITE_BUTTON: 'event__favorite-btn',
  FAVORITE_ACTIVE: 'event__favorite-btn--active',
  SHAKE: 'shake',
  NEW_EVENT_BUTTON: 'trip-main__event-add-btn',
};

const DateFormat = {
  DATE_TIME: 'DD/MM/YY HH:mm',
  TIME: 'HH:mm',
  DATE: 'MMM DD',
  DATE_VALUE: 'YYYY-MM-DD',
  TRIP_DATE: 'D MMM',
  PICKER: 'd/m/y H:i',
};

const Url = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const DEFAULT_POINT_TYPE = 'flight';
const MIN_TRIP_CITIES = 3;
const COST_ZERO = 0;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

export {
  TYPES,
  SortType,
  FilterType,
  UpdateType,
  UserAction,
  FilterPoints,
  NoPointsText,
  Messages,
  ButtonText,
  ClassName,
  DateFormat,
  Url,
  TimeLimit,
  Method,
  DEFAULT_POINT_TYPE,
  MIN_TRIP_CITIES,
  COST_ZERO,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
};
