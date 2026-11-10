import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const capitalize = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const formatDateTime = (isoString) => dayjs(isoString).format('DD/MM/YY HH:mm');

const formatTime = (isoString) => dayjs(isoString).format('HH:mm');

const formatDate = (isoString) => dayjs(isoString).format('MMM DD').toUpperCase();

const formatDateValue = (isoString) => dayjs(isoString).format('YYYY-MM-DD');

const formatDuration = (dateFrom, dateTo) => {
  const diffMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor(diffMinutes / 60);
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

export { getRandomArrayElement, capitalize, formatDateTime, formatTime, formatDate, formatDateValue, formatDuration };
