import React, { Component } from 'react'
import 'src/style/chat.scss'
import { errorLoadingGifUrl } from 'src/global/utils'
import Tooltip from '@material-ui/core/Tooltip'

function SentMess(item) {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
      <Tooltip title={new Date(item.createdAt).toLocaleString('vi-VN')} arrow>
      {item.type == "image" 
        ? <div className="mess sent-mess" 
            style={{backgroundColor: 'transparent', 
            backgroundImage: `url('${item.content || errorLoadingGifUrl}')`, 
            height: 150, width: 150}}></div>
        : <div className="mess sent-mess">{item.content}</div> 
      }
      </Tooltip>
    </div>
  )
}
export default SentMess