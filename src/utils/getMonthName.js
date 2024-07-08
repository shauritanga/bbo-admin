export const getMonthName = (monthInt) => {
  let month = null;
  switch (monthInt) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "march";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case "August":
      month = 7;
      break;
    case "September":
      month = 8;
      break;
    case "October":
      month = 9;
      break;
    case "November":
      month = 10;
      break;
    case "December":
      month = 11;
      break;
  }
  return month;
};
