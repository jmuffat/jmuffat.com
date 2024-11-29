"use client"
import {FormattedMessage} from 'react-intl'

function AttributionPage() {
  return (
    <div className="p-4 markdown max-w-5xl mx-auto bg-background min-h-[66vh]">
      <h1>Attribution </h1>

      <p><FormattedMessage id="7ucfbL"
        description="fontawesome attribution" 
        defaultMessage="Some icons from {link}."
        values={{
          link:<a href="https://fontawesome.com/" target="_blank">FontAwesome</a>
        }}
      /></p>

      <p><FormattedMessage id="BIAnEB"
        description="flaticon attribution" 
        defaultMessage="Some icons made by {link1} from {link2}."
        values={{
          link1:<a key="1" href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">Freepik</a>,
          link2:<a key="2" href="https://www.flaticon.com/" title="Flaticon" target="_blank">www.flaticon.com</a>
        }}
      /></p>

      <p><FormattedMessage id="O3h5Mt"
        description="Natural Earth attribution" 
        defaultMessage="Made with Natural Earth. Free vector and raster map data @ {link}."
        values={{
          link:<a href="https://www.naturalearthdata.com/" target="_blank">naturalearthdata.com</a>
        }}
      /></p>

      <p><FormattedMessage id="LKSFKo"
        description="Flags attribution" 
        defaultMessage="Flags by {link}."
        values={{
          link:<a href="https://hampusborgos.github.io/country-flags/" target="_blank">Hampus Joakim Borgos</a>
        }}
      /></p>

    </div>
  )
}

export default AttributionPage
