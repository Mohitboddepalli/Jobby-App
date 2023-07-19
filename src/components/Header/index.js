import {Component} from 'react'

import Cookies from 'js-cookie'

import {Link, withRouter} from 'react-router-dom'

import './index.css'

class Header extends Component {
  logout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="list_items">
          <Link to="/">
            <li className="items">
              <button type="button">Home</button>
            </li>
          </Link>
          <Link to="/jobs">
            <li className="items">
              <button type="button">Jobs</button>
            </li>
          </Link>
        </ul>
        <button onClick={this.logout} type="button" className="button">
          Logout
        </button>
      </div>
    )
  }
}

export default withRouter(Header)
