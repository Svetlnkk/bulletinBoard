// check max price > min price
export const hasMaxMoreMinPrice = (value, vm) => {
  if (!vm.minPrice || !vm.maxPrice) return true;
  return value >= vm.minPrice;
};

// check min price < max price
export const hasMinLessMaxPrice = (value, vm) => {
  if (!vm.maxPrice || !vm.minPrice) return true;
  return value <= vm.maxPrice;
};
