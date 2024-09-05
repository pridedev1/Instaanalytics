function convertInstagramNumber(str?: string) {
  // Remove commas for thousands separators
  if (str === undefined) return 0;
  str = str.replace(/,/g, "");

  // Check for million (m) and thousand (k) suffixes
  if (str.endsWith("M")) {
    return parseFloat(str) * 1000000;
  } else if (str.endsWith("K")) {
    return parseFloat(str) * 1000;
  } else {
    return parseInt(str, 10);
  }
}

export default convertInstagramNumber;
