const userAvatarUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8lgurxzZwpkDpQRks2gA5dSCJyoIzGrCyLQ&usqp=CAU'
const errorLoadingGifUrl = 'https://media.tenor.com/images/f5cb4fb6a45ea2a469fd3ef5b1ad06f8/tenor.gif'
const MAIN_SCREEN = {
  DECK: 'deck',
  CHAT: 'chat'
}

function concatAndFilterDuplicateById(mainList, addedList) {
  let addedListFiltered = mainList
  for (let item of addedList) {
    let found = false;
    for(let item2 of mainList) {
      if (item2._id == item._id) {found = true;break;}
    }
    if (!found) {
      addedListFiltered.push(item)
    }
  }
  return addedListFiltered
}
export {
  userAvatarUrl,
  errorLoadingGifUrl,
  MAIN_SCREEN,
  concatAndFilterDuplicateById
}