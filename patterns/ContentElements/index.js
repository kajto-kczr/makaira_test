import { TeaserHero, TwoColumnText } from '..'

export default function ContentElements(props) {
  const { elements = [] } = props

  if (elements.length == 0) return null

  // Declare your additional content patterns here
  const components = {
    'teaser-hero': TeaserHero,
    'two-column-text': TwoColumnText,
  }

  return (
    <>
      {elements.map((entry, index) => {
        const Component = components[entry.component]

        if (!Component) return null

        return <Component key={index} {...entry.properties.content} />
      })}
    </>
  )
}
