import React from 'react'
import 'src/style/card.scss'
import { userAvatarUrl } from '../../../global/utils'

function detailCard(info) {
  const thisYear = new Date().getFullYear()
  function getYear(isoStr) {
    return new Date(isoStr).getFullYear()
  }
  return (
  <div className="detail-card-container">
    <div className="detail-img" style={{backgroundImage: `url('${info.imgUrl || userAvatarUrl}')`}}></div>
    <div className="detail-name">{info.name}</div>
    <div className="detail-sub-info">{thisYear - getYear(info.birthdate)}, {info.gender}</div>
    <div className="detail-desc">{info.desc}</div>
  </div>)
}

export default detailCard