  
import React, { Component } from 'react'
import 'src/style/chat.scss'
import { errorLoadingGifUrl } from 'src/global/utils'
import { Tooltip } from '@material-ui/core'

function ReceivedMess(item) {
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
      <Tooltip title={new Date(item.createdAt).toLocaleString('vi-VN')} arrow>
      {item.type == "image" 
        ? <div className="mess received-mess" 
          style={{backgroundColor: 'transparent', 
          backgroundImage: `url('${item.content || errorLoadingGifUrl}')`, 
          height: 250, width: 250}}></div>
        : <div className="mess received-mess">{item.content}</div> 
      }
    </Tooltip>
    </div>
  )
}
export default ReceivedMess