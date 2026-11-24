import dayjs from 'dayjs';
import { FilterType, FilterPoints } from './consts.js';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const capitalize = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const formatDateTime = (isoString) => (isoString ? dayjs(isoString).format('DD/MM/YY HH:mm') : '');

const formatTime = (isoString) => (isoString ? dayjs(isoString).format('HH:mm') : '');

const formatDate = (isoString) => (isoString ? dayjs(isoString).format('MMM DD').toUpperCase() : '');

const formatDateValue = (isoString) => (isoString ? dayjs(isoString).format('YYYY-MM-DD') : '');

const formatDuration = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const diffMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${String(days).padStart(2, '0')}D`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${String(hours).padStart(2, '0')}H`);
  }
  parts.push(`${String(minutes).padStart(2, '0')}M`);

  return parts.join(' ');
};

const formatTripDate = (isoString) => {
  if (!isoString) {
    return '';
  }
  return dayjs(isoString).format('D MMM').toUpperCase();
};

const getTripRoute = (points, destinationsModel) => {
  if (!points.length) {
    return '';
  }

  const sorted = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const cityNames = sorted.map((point) => destinationsModel.getById(point.destination)?.name).filter(Boolean);

  if (cityNames.length === 0) {
    return '';
  }

  if (cityNames.length <= 3) {
    return cityNames.join(' — ');
  }

  return `${cityNames[0]} —... — ${cityNames[cityNames.length - 1]}`;
};

const getTripDates = (points) => {
  if (!points.length) {
    return '';
  }

  const sorted = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  const startDate = sorted[0].dateFrom;
  const endDate = sorted.reduce((max, point) => (new Date(point.dateTo) > new Date(max) ? point.dateTo : max), sorted[0].dateTo);

  return `${formatTripDate(startDate)} — ${formatTripDate(endDate)}`;
};

const getTripTotalCost = (points, offersModel) =>
  points.reduce((sum, point) => {
    const offersCost = offersModel.getById(point.type, point.offers).reduce((offerSum, offer) => offerSum + offer.price, 0);

    return sum + point.basePrice + offersCost;
  }, 0);

const getFilterAvailability = (points) => {
  const result = {};
  for (const filterType of Object.values(FilterType)) {
    if (filterType === FilterType.EVERYTHING) {
      result[filterType] = true;
    } else {
      result[filterType] = FilterPoints[filterType](points).length > 0;
    }
  }
  return result;
};

export {
  getRandomArrayElement,
  capitalize,
  formatDateTime,
  formatTime,
  formatDate,
  formatDateValue,
  formatDuration,
  getTripRoute,
  getTripDates,
  getTripTotalCost,
  getFilterAvailability,
};
