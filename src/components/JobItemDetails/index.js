import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const statusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {list: [], status: statusConstants.initial}

  componentDidMount() {
    this.get()
  }

  get = async () => {
    this.setState({status: statusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,

          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },

          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,

          skills: data.job_details.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          companyWebsiteUrl: each.company_website_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }
      this.setState({list: updatedData, status: statusConstants.success})
      console.log(updatedData)
    } else {
      this.setState({status: statusConstants.failure})
    }
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

  successView = () => {
    const {list} = this.state
    const {jobDetails, similarJobs} = list
    return (
      jobDetails && (
        <div className="full_container">
          <div className="company_logo_container1">
            <div>
              <div className="company_logo_container">
                <img
                  className="company_logo"
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                />
                <div>
                  <p>{jobDetails.title}</p>
                  <div className="list_container">
                    <AiFillStar />
                    <p>{jobDetails.rating}</p>
                  </div>
                </div>
              </div>
              <div className="details">
                <div className="details">
                  <div className="list_container">
                    <MdLocationOn />
                    <p className="details1">{jobDetails.location}</p>
                  </div>
                  <p>{jobDetails.employmentType}</p>
                </div>
                <p>{jobDetails.packagePerAnnum}</p>
              </div>
              <div>
                <hr className="horizontal" />
              </div>
              <div className="description1">
                <h1 className="heading_styling">Description</h1>
                <a className="description2" href={jobDetails.companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p>{jobDetails.jobDescription}</p>
            </div>
            <h1 className="heading_styling">Skills</h1>
            <ul className="styling">
              {jobDetails.skills.map(each => (
                <li key={each.name} className="list_item5">
                  <img src={each.imageUrl} alt={each.name} />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>

            <h1 className="heading_styling">Life at company</h1>
            <div className="life_at_company_details">
              <p className="paragraph">
                {jobDetails.lifeAtCompany.description}
              </p>
              <img
                src={jobDetails.lifeAtCompany.imageUrl}
                alt="life At Company"
                className="image6"
              />
            </div>
          </div>

          <h1>Similar Jobs</h1>
          <ul className="list_container">
            {similarJobs &&
              similarJobs.map(each => (
                <li key={each.id} className="list_styling">
                  <div className="company_logo_container">
                    <img
                      className="company_logo"
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                    <div>
                      <p>{each.title}</p>
                      <p>{each.rating}</p>
                    </div>
                  </div>
                  <p>Description</p>
                  <p>{each.jobDescription}</p>

                  <div className="direction">
                    <p>{each.location}</p>
                    <p>{each.employmentType}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )
    )
  }

  inProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
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
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Header />
        {this.renderingView()}
      </div>
    )
  }
}

export default JobItemDetails
