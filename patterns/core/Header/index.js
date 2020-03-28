import { Component, createRef } from 'react'
import Router from 'next/router'
import { Button, GlobalNavigation, Link } from '../..'
import InfoLinks from './InfoLinks'
import Search from './Search'
import Actions from './Actions'
import {
  throttle,
  dispatchShowOverlayEvent,
  dispatchOverlayClickedEvent,
} from '../../../utils'

const DESKTOP_MENU_BREAKPOINT = 800

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      renderMobileNavigation: false,
      isMobileNavigationVisible: false,
      searchPhrase: '',
    }

    this.handleResize = throttle(this.handleResize, 200)

    this.mobileSearchInputRef = createRef()
  }

  componentDidMount() {
    window.addEventListener('overlay:clicked', this.hideMobileNavigation)
    window.addEventListener('resize', this.handleResize)

    Router.events.on(
      'routeChangeComplete',
      this.hideMobileNavigationOnPageChange
    )

    // initial check for what navigation to render
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('overlay:clicked', this.hideMobileNavigation)
    window.removeEventListener('resize', this.handleResize)

    Router.events.off(
      'routeChangeComplete',
      this.hideMobileNavigationOnPageChange
    )
  }

  handleResize = () => {
    const { renderMobileNavigation } = this.state

    if (window.innerWidth < DESKTOP_MENU_BREAKPOINT) {
      if (renderMobileNavigation === false) {
        this.setState({ renderMobileNavigation: true })
      }
    } else {
      if (renderMobileNavigation === true) {
        this.setState({ renderMobileNavigation: false })
      }
    }
  }

  showMobileNavigation = () => {
    dispatchShowOverlayEvent()
    this.setState({ isMobileNavigationVisible: true })
  }

  hideMobileNavigation = () => {
    this.setState({ isMobileNavigationVisible: false })
  }

  hideMobileNavigationOnPageChange = () => {
    const { isMobileNavigationVisible } = this.state

    // Perform an explicit check here to avoid accidentally closing the <MobileFilter> on page navigations
    if (isMobileNavigationVisible) {
      // for simplicity, we just simulate a click on the overlay and let the lifecycle of the components take care of everything
      dispatchOverlayClickedEvent()
    }
  }

  handleSearchPhraseChange = (event) => {
    this.setState({ searchPhrase: event.target.value })
  }

  handleSearchFormSubmit = (event) => {
    event.preventDefault()

    const { searchPhrase } = this.state
    this.props.submitSearchForm(searchPhrase)
  }

  activateMobileSearch = () => {
    this.showMobileNavigation()
    this.mobileSearchInputRef.current.focus()
  }

  render() {
    const { menu = [] } = this.props

    return (
      <>
        <header className="header">
          <Button
            variant="icon-only"
            icon="bars"
            className="header__menu-button"
            onClick={this.showMobileNavigation}
          />

          <Link href="/">
            <img
              src="/assets/images/header/logo_dummy.svg"
              alt="Logo"
              className="header__logo"
            />
          </Link>

          <div className="header__outer-container">
            <InfoLinks />

            <div className="header__inner-container">
              <Search
                searchPhrase={this.state.searchPhrase}
                changeSearchPhrase={this.handleSearchPhraseChange}
                submitForm={this.handleSearchFormSubmit}
                activateMobileSearch={this.activateMobileSearch}
              />

              <Actions />
            </div>
          </div>
        </header>

        <GlobalNavigation
          menu={menu}
          renderMobileNavigation={this.state.renderMobileNavigation}
          isMobileNavigationVisible={this.state.isMobileNavigationVisible}
          hideMobileNavigation={dispatchOverlayClickedEvent} // for simplicity, we just simulate a click on the overlay and let the lifecycle of the components take care of everything
          mobileSearchInputRef={this.mobileSearchInputRef}
          searchPhrase={this.state.searchPhrase}
          changeSearchPhrase={this.handleSearchPhraseChange}
          submitForm={this.handleSearchFormSubmit}
        />
      </>
    )
  }
}

export default Header
export { default as headerVariants } from './variants.js'