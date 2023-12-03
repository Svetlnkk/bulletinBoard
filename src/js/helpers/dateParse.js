/**
 * parse date string to date object string
 * @param  {String} dateString
 * @returns {Object}
 */
export function dateParse(dateString) {
  const date = dateString.split('.');
  const day = +date[0];
  const month = +date[1] - 1;

  const dateSecondPart = date[2].split(' ');
  const year = +dateSecondPart[0];

  const dateThirdPart = dateSecondPart[1].split(':');
  const hours = +dateThirdPart[0];
  const minutes = +dateThirdPart[1];

  const adDate = new Date(year, month, day, hours, minutes);
  return adDate;
}

//03.12.2023 22:37
