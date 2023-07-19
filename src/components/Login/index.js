import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', error: ''}

  userInput = event => {
    this.setState({username: event.target.value})
  }

  password = event => {
    this.setState({password: event.target.value})
  }

  login = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})

      history.replace('/')
    } else {
      console.log(response)
      this.setState({error: data.error_msg})
    }
  }

  render() {
    const {error, username, password} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login_container">
        <form className="form" onSubmit={this.login}>
          <div className="image">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="user">USERNAME</label>
          <input
            placeholder="Username"
            onChange={this.userInput}
            value={username}
            type="text"
            id="user"
          />

          <label htmlFor="user">PASSWORD</label>
          <input
            placeholder="Password"
            onChange={this.password}
            type="password"
            value={password}
            id="password"
          />

          <button className="button1" type="submit">
            Login
          </button>
          <p className="error">{error}</p>
        </form>
      </div>
    )
  }
}

export default Login
