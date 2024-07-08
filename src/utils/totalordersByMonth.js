import dayjs from "dayjs";

export const ordersByMonth = (orders) => {
  const grouped = {};

  orders.forEach((order) => {
    const month = dayjs(order.date).month();
    let name = "";
    switch (month) {
      case 0:
        name = "January";
        break;
      case 1:
        name = "February";
        break;

      case 2:
        name = "May";
        break;
      case 3:
        name = "April";
        break;
      case 4:
        name = "May";
        break;

      case 5:
        name = "June";
        break;
      case 6:
        name = "July";
        break;
      case 7:
        name = "August";
        break;

      case 8:
        name = "September";
        break;
      case 9:
        name = "October";
        break;
      case 10:
        name = "November";
        break;
      case 11:
        name = "December";
        break;
    }

    if (name) {
      if (!grouped[name]) {
        grouped[name] = { name, total: 0 };
      }
      grouped[name].total += order.amount;
    }
  });
  return Object.values(grouped);
};
