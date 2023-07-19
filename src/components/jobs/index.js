import {Component} from 'react'

import Cookies from 'js-cookie'

import {Link, Redirect} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import Header from '../Header'

import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const statusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const profileStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    list: '',
    status: statusConstants.initial,
    statusOfProfile: profileStatus.initial,

    profileDetails: '',
    employmentTypeList: [],
    salary: '',
    searchInput: '',
  }

  componentDidMount() {
    this.get()
    this.profile()
  }

  profile = async () => {
    this.setState({statusOfProfile: profileStatus.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response1 = await fetch(apiUrl, options)
    const data1 = await response1.json()
    console.log(data1)
    if (response1.ok === true) {
      const profile = {
        name: data1.profile_details.name,
        profileImageUrl: data1.profile_details.profile_image_url,
        shortBio: data1.profile_details.short_bio,
      }
      this.setState({
        profileDetails: profile,
        statusOfProfile: profileStatus.success,
      })
    } else {
      this.setState({statusOfProfile: profileStatus.failure})
    }
  }

  get = async () => {
    this.setState({status: statusConstants.inProgress})

    const {salary, searchInput, employmentTypeList} = this.state
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeList}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const update = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,

        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(update)

      this.setState({list: update, status: statusConstants.success})
    } else {
      this.setState({status: statusConstants.failure})
    }
  }

  search = () => {
    this.get()
  }

  searchInputValue = event => {
    this.setState({searchInput: event.target.value})
  }

  enterInputValue = event => {
    if (event.key === 'Enter') {
      this.get()
    }
  }

  salaryRange = event => {
    this.setState({salary: event.target.id}, this.get)
    console.log(event.target.id)
  }

  employmentType = event => {
    const {employmentTypeList} = this.state
    const notInList = employmentTypeList.filter(
      each => each === event.target.id,
    )

    if (notInList.length === 0) {
      this.setState(
        prevState => ({
          employmentTypeList: [
            ...prevState.employmentTypeList,
            event.target.id,
          ],
        }),
        this.get,
      )
    } else {
      const filteredData = employmentTypeList.filter(
        each => each !== event.target.id,
      )
      this.setState({employmentTypeList: filteredData}, this.get)
    }
  }

  ProfileRetry = () => {
    this.profile()
  }

  profileFailureView = () => (
    <button className="retryButton" onClick={this.ProfileRetry} type="button">
      Retry
    </button>
  )

  profileSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img src={profileDetails.profileImageUrl} alt="profile" />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.shortBio} </p>
      </div>
    )
  }

  inProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileRenderingView = () => {
    const {statusOfProfile} = this.state
    switch (statusOfProfile) {
      case profileStatus.inProgress:
        return this.inProgressView()
      case profileStatus.success:
        return this.profileSuccessView()
      case profileStatus.failure:
        return this.profileFailureView()
      default:
        return null
    }
  }

  successView = () => {
    const {list} = this.state

    return list.length === 0 ? (
      <div className="no_jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul>
        {list &&
          list.map(each => (
            <Link to={`/jobs/${each.id}`}>
              <li className="list_items1">
                <div className="company_logo_container">
                  <img
                    className="company_logo"
                    src={each.companyLogoUrl}
                    alt="company logo"
                  />
                  <div>
                    <h1>{each.title}</h1>
                    <div className="list_container">
                      <AiFillStar />

                      <p>{each.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="details">
                  <div className="details">
                    <div className="list_container">
                      <MdLocationOn />
                      <p className="details1">{each.location}</p>
                    </div>
                    <p>{each.employmentType}</p>
                  </div>
                  <p>{each.packagePerAnnum}</p>
                </div>
                <hr />
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
              </li>
            </Link>
          ))}
      </ul>
    )
  }

  retry = () => {
    this.get()
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="retryButton" onClick={this.retry} type="button">
        Retry
      </button>
    </div>
  )

  renderingView = () => {
    const {status} = this.state
    switch (status) {
      case statusConstants.inProgress:
        return this.inProgressView()
      case statusConstants.success:
        return this.successView()
      case statusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    console.log(searchInput)
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <Header />
        <div className="whole_container">
          <div className="adjust">
            <div className="container_width">
              {this.profileRenderingView()}

              <hr />
              <ul className="list_items3">
                <h1> Type of Employment</h1>

                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId} className="list_items3">
                    <input
                      id={each.employmentTypeId}
                      onChange={this.employmentType}
                      type="checkbox"
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>

              <hr />

              <ul className="list_items3">
                <h1>Salary Range</h1>
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId} className="list_items3">
                    <input
                      id={each.salaryRangeId}
                      onChange={this.salaryRange}
                      type="radio"
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="search">
                <input
                  type="search"
                  value={searchInput}
                  onChange={this.searchInputValue}
                  className="input searchButton"
                  onKeyDown={this.enterInputValue}
                />
                <button type="button" data-testid="searchButton">
                  <BsSearch onClick={this.search} className="search-icon" />
                </button>
              </div>
              {this.renderingView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
