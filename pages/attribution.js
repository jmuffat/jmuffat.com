import react from 'react'
import Link from 'next/link'

import BasePage from '~/components/base-page';

function Page() {
  return (
    <BasePage>
      <h1>Attribution </h1>
      <p>Some icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a></p>
      <p>Made with Natural Earth. Free vector and raster map data @ <a href="https://www.naturalearthdata.com/" target="_blank">naturalearthdata.com</a>.</p>
    </BasePage>
  )
}

export default Page
