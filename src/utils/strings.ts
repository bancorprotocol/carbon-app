export const capitalizeFirstChar = (str: string) => {
  if (str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return '';
};
