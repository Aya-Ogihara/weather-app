import './style.css';
import { ICON_MAP } from './iconMap';
import { getWeather } from './weather';

//******
//Find user location
//******
const positionSuccess = async ({ coords }) => {
  try {
    const weather = await getWeather(
      coords.latitude,
      coords.longitude,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    renderWeather(weather);
  } catch {
    (e) => {
      console.log(e);
      alert('Error getting weather data :(');
    };
  }
};

const positionError = () => {
  alert(
    'There was an error getting your location. Please allow us to use your location and refresh the page'
  );
};

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

//******
// Rendering page functions
//******
// Helper function: instead of writing "document.querySelector('[data-current-temp]').textContent = current.currentTemp", many times in render$$$Weather functions
const setValue = (selector, value, { parent = document } = {}) => {
  parent.querySelector(`[data-${selector}]`).textContent = value;
};

// Img attribute setting
const getIconUrl = (iconCode) => {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
};

// Current section rendering (header area)
const currentIcon = document.querySelector('[data-current-icon]');
const renderCurrentWeather = (current) => {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue('current-temp', current.currentTemp);
  setValue('current-high', current.highTemp);
  setValue('current-fl-high', current.highFeelsLike);
  setValue('current-low', current.lowTemp);
  setValue('current-fl-low', current.lowFeelsLike);
  setValue('current-wind', current.windSpeed);
  setValue('current-precip', current.precip);
};

// day section  section rendering
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const dailySection = document.querySelector('[data-day-section]');
const dayCardTemplate = document.querySelector('#day-card-template');

const renderDailyWeather = (daily) => {
  dailySection.innerHTML = '';
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue('temp', day.maxTemp, { parent: element });
    setValue('date', DAY_FORMATTER.format(day.timeStamp), { parent: element });
    element.querySelector('[data-icon]').src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
};

// hour section rendering
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
const hourlySection = document.querySelector('[data-hour-section]');
const hourRowTemplate = document.querySelector('#hour-row-template');

const renderHourlyWeather = (hourly) => {
  hourlySection.innerHTML = '';
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue('temp', hour.temp, { parent: element });
    setValue('fl-temp', hour.feelsLike, { parent: element });
    setValue('wind', hour.windSpeed, { parent: element });
    setValue('precip', hour.precip, { parent: element });
    setValue('day', DAY_FORMATTER.format(hour.timeStamp), { parent: element });
    setValue('time', HOUR_FORMATTER.format(hour.timeStamp), {
      parent: element,
    });
    element.querySelector('[data-icon]').src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
};

//******
// Rendering page
//******
const renderWeather = ({ current, daily, hourly }) => {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove('blurred');
};
