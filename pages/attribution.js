import react from 'react'
import Link from 'next/link'
import {FormattedMessage} from 'react-intl'

import BasePage from '~/components/base-page';

function Page() {
  return (
    <BasePage locales="*">
      <h1>Attribution </h1>

      <p><FormattedMessage
        description="fontawesome attribution"
        defaultMessage="Some icons from {link}."
        values={{
          link:<a href="https://fontawesome.com/" target="_blank">FontAwesome</a>
        }}
      /></p>

      <p><FormattedMessage
        description="flaticon attribution"
        defaultMessage="Some icons made by {link1} from {link2}."
        values={{
          link1:<a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a>,
          link2:<a href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a>
        }}
      /></p>

      <p><FormattedMessage
        description="Natural Earth attribution"
        defaultMessage="Made with Natural Earth. Free vector and raster map data @ {link}."
        values={{
          link:<a href="https://www.naturalearthdata.com/" target="_blank">naturalearthdata.com</a>
        }}
      /></p>

      <p><FormattedMessage
        description="Flags attribution"
        defaultMessage="Flags by {link}."
        values={{
          link:<a href="https://hampusborgos.github.io/country-flags/" target="_blank">Hampus Joakim Borgos</a>
        }}
      /></p>

    </BasePage>
  )
}

export default Page
