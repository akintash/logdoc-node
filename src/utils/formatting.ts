const checkTime = (i: number | string) => {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
};
export const dateToLogDocTime = (now: Date): string => {
  const year = now.getFullYear().toString().substr(-2);
  const month = checkTime(now.getMonth() + 1);
  const date = checkTime(now.getDate());
  const hour = checkTime(now.getHours());
  const minuts = checkTime(now.getMinutes());
  const seconds = checkTime(now.getSeconds());
  const mSeconds = now.getMilliseconds();
  return `${year}${month}${date}${hour}${minuts}${seconds}${mSeconds}`;
};
