import React from 'react'
import Sidebar from './Sidebar'

function Layout({children}) {
  return (
    <div style={{display:'flex',background: "#292828",width:"100%",minHeight: "100vh",}}>
        <Sidebar/>
        <div style={{flex:1,padding:"20px",minWidth:0}}>
            {children}
        </div>
      
    </div>
  )
}

export default Layout
