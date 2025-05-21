const getGrade = (follower: number, eg: number) => {
  let baseEgRate;
  if (follower >= 100000) {
    baseEgRate = 1.7;
  } else if (follower < 100000 && follower >= 10000) {
    baseEgRate = 2.4;
  } else if (follower < 10000 && follower >= 5000) {
    baseEgRate = 4;
  } else if (follower < 5000 && follower >= 1000) {
    baseEgRate = 5.7;
  } else {
    baseEgRate = 8;
  }
  let grade;

  let factor;
  if (follower >= 100000) {
    factor = 0.5;
  } else if (follower < 100000 && follower >= 10000) {
    factor = 0.7;
  } else if (follower < 10000 && follower >= 5000) {
    factor = 0.8;
  } else if (follower < 5000 && follower >= 1000) {
    factor = 0.9;
  } else {
    factor = 1;
  }
  if (eg >= baseEgRate + 1 * factor) {
    grade = "A+";
  } else if (eg >= baseEgRate) {
    grade = "A";
  } else if (eg >= baseEgRate - 1 * factor) {
    grade = "A-";
  } else if (eg >= baseEgRate - 2 * factor) {
    grade = "B-";
  } else if (eg > baseEgRate - 3 * factor) {
    grade = "C";
  } else if (eg > baseEgRate - 4 * factor) {
    grade = "C-";
  } else if (eg > baseEgRate - 5 * factor) {
    grade = "D";
  } else {
    grade = "E";
  }

  return grade;
};
export default getGrade;
