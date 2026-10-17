import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const formatType = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const formatDateTime = (isoString) => dayjs(isoString).format('DD/MM/YY HH:mm');

const formatTime = (isoString) => dayjs(isoString).format('HH:mm');

const formatDate = (isoString) => dayjs(isoString).format('MMM DD').toUpperCase();

const formatDateValue = (isoString) => dayjs(isoString).format('YYYY-MM-DD');

const formatDuration = (dateFrom, dateTo) => {
  const diffMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${minutes}M`;
};

export { getRandomArrayElement, formatType, formatDateTime, formatTime, formatDate, formatDateValue, formatDuration };
