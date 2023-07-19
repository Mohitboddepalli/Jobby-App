import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import Header from '../Header'

import './index.css'

class Home extends Component {
  findJobs = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Header />
        <div className="container1">
          <div className="content">
            <h1>Find the job that fits your Life</h1>
            <p>
              Millions of people are searching for jobs,salary, information,
              company reviews. Find the job that fits your abilties and
              potential.
            </p>
            <button onClick={this.findJobs} type="button">
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }
}
export default Home
