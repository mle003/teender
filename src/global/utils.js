const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'
const thisYear = new Date().getFullYear()
function getYear(isoStr) {
  return new Date(isoStr).getFullYear()
}

export default {
  userAvatarUrl,
  thisYear,
  getYear
}