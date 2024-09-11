export function convertInstagramNumber(str?: string) {
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

export function formatNumber(str: string) {
  const num = parseFloat(str.replace(/,/g, ""));
  if (isNaN(num)) return str;

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
}

export function capitalizeFirstLetterOfEachWord(str: string) {
  if (str === undefined) return "";
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}
