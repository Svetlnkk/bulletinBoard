// redirect to 404 page
export function redirect404(condition) {
  if (condition) {
    console.log(this, this.$router);
    this.$router.replace('/404');
  }
}
