/**
 * @param  {Boolean} condition
 */ // redirect to 404 page
export function redirect404(condition) {
  if (condition) {
    this.$router.replace('/404');
  }
}
