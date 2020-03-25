import MultiSelectFilter from './MultiSelectFilter'
import RangeFilter from './RangeFilter'
import { useTranslation } from '../../../utils'
import { Heading, Button } from '../..'

const filterComponents = {
  list_multiselect: MultiSelectFilter,
  range_slider: RangeFilter,
}

export default function MobileFilterList(props) {
  const { t } = useTranslation()
  const { isVisible = false, id, title, type, submitForms, closeFilter } = props

  if (!isVisible) return null

  const Component = filterComponents[type]

  if (!Component) return null

  async function handleSave() {
    await submitForms()
    closeFilter()
  }

  return (
    <div className="mobile-filter__list">
      <Heading className="mobile-filter__list-header">
        {t(`FILTER_LABEL_${id.toUpperCase()}`, title)}
      </Heading>

      <Component {...props} />

      <div className="mobile-filter__list-footer">
        <Button
          variant="primary"
          icon="chevron-left"
          iconPosition="left"
          onClick={handleSave}
        >
          {t('MOBILE_FILTER_SAVE')}
        </Button>
      </div>
    </div>
  )
}
