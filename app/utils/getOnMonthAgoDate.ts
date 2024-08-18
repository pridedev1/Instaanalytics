function getOneMonthAgoDate() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default getOneMonthAgoDate;
