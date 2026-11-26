import dayjs from 'dayjs';
import { FilterType, FilterPoints, DateFormat, MIN_TRIP_CITIES, COST_ZERO, HOURS_IN_DAY, MINUTES_IN_HOUR } from './consts.js';

const capitalize = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const formatDateTime = (isoString) => (isoString ? dayjs(isoString).format(DateFormat.DATE_TIME) : '');
const formatTime = (isoString) => (isoString ? dayjs(isoString).format(DateFormat.TIME) : '');
const formatDate = (isoString) => (isoString ? dayjs(isoString).format(DateFormat.DATE).toUpperCase() : '');
const formatDateValue = (isoString) => (isoString ? dayjs(isoString).format(DateFormat.DATE_VALUE) : '');

const formatDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const diffMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(diffMinutes / (MINUTES_IN_HOUR * HOURS_IN_DAY));
  const hours = Math.floor((diffMinutes % (MINUTES_IN_HOUR * HOURS_IN_DAY)) / MINUTES_IN_HOUR);
  const minutes = diffMinutes % MINUTES_IN_HOUR;

  const parts = [];

  if (days > COST_ZERO) {
    parts.push(`${String(days).padStart(2, '0')}D`);
  }
  if (hours > COST_ZERO || days > COST_ZERO) {
    parts.push(`${String(hours).padStart(2, '0')}H`);
  }
  parts.push(`${String(minutes).padStart(2, '0')}M`);

  return parts.join(' ');
};

const formatTripDate = (isoString) => (isoString ? dayjs(isoString).format(DateFormat.TRIP_DATE).toUpperCase() : '');

const getTripRoute = (points, destinationsModel) => {
  const validPoints = points.filter((point) => point.dateFrom && point.dateTo);
  if (!points.length) {
    return '';
  }

  const sorted = [...validPoints].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cityNames = sorted.map((point) => destinationsModel.getById(point.destination)?.name).filter(Boolean);

  if (cityNames.length === COST_ZERO) {
    return '';
  }

  if (cityNames.length <= MIN_TRIP_CITIES) {
    return cityNames.join(' — ');
  }

  return `${cityNames[0]} —... — ${cityNames[cityNames.length - 1]}`;
};

const getTripDates = (points) => {
  const validPoints = points.filter((point) => point.dateFrom && point.dateTo);
  if (!points.length) {
    return '';
  }

  const sorted = [...validPoints].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const startDate = sorted[0].dateFrom;
  const endDate = sorted[sorted.length - 1].dateTo;

  return `${formatTripDate(startDate)} — ${formatTripDate(endDate)}`;
};

const getTripTotalCost = (points, offersModel) =>
  points.reduce((sum, point) => {
    const offersCost = offersModel.getById(point.type, point.offers).reduce((offerSum, offer) => offerSum + offer.price, 0);

    return sum + point.basePrice + offersCost;
  }, 0);

const getFilterAvailability = (points) => {
  const result = {};
  Object.values(FilterType).forEach((filterType) => {
    result[filterType] = FilterPoints[filterType](points).length > 0;
  });
  return result;
};

export { capitalize, formatDateTime, formatTime, formatDate, formatDateValue, formatDuration, getTripRoute, getTripDates, getTripTotalCost, getFilterAvailability };
