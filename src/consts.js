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

export { TYPES, SortType };
