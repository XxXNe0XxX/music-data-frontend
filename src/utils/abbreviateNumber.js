export function abbreviateNumber(value) {
  // 1) If the absolute value is less than 1000, just return it as-is
  //    (optionally fix decimals if you want).
  if (Math.abs(value) < 1000) {
    return String(value);
  }

  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;
  let newValue = value;

  // 2) Repeatedly divide by 1000 until the number is less than 1000
  //    or we run out of suffixes.
  while (Math.abs(newValue) >= 1000 && suffixIndex < suffixes.length - 1) {
    newValue /= 1000;
    suffixIndex++;
  }

  // 3) Round to one decimal place if necessary, but remove trailing ".0"
  const result = newValue?.toFixed(1).replace(/\.0$/, "");

  // 4) Return the number + suffix
  return result + suffixes[suffixIndex];
}
