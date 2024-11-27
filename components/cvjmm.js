import React from 'react'
import Image from 'next/image'

const CVDownload = props=>(
  <div className="frontpage-icon">
    <a href="/download/cvjmm.pdf" target="_blank">
      <Image src="/img/cv.svg" width="48" height="48" alt="C.V."/><br/>
      cvjmm.pdf
    </a>
  </div>
)

export default CVDownload
