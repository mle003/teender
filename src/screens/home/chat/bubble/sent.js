import React, { Component } from 'react'
import 'src/style/chat.scss'
import { errorLoadingGifUrl } from 'src/global/utils'

function SentMess(item) {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
      {item.type == "image" 
        ? <div className="mess sent-mess" 
            style={{backgroundColor: 'transparent', 
            backgroundImage: `url('${item.content || errorLoadingGifUrl}')`, 
            height: 250, width: 250}}></div>
        : <div className="mess sent-mess">{item.content}</div> 
      }
    </div>
  )
}
export default SentMess