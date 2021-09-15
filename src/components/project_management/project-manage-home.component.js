import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import UserService from "./../../services/user.service";
import ProjectDataService from "./../../services/project.service";
import AuthService from "./../../services/auth.service";
import portfolioIcon from "././../../assets/portfolio.png";
import rfiIcon from "././../../assets/rfi.png";
import dailylogIcon from "././../../assets/dailylog.png";
import meetingIcon from "././../../assets/meeting.png";
import biddingIcon from "././../../assets/bidding.png";
import actionplanIcon from "././../../assets/actionplan.png";
import drawingsIcon from "././../../assets/drawings.png";
import photosIcon from "././../../assets/photos.png";
import punchlistIcon from "././../../assets/PM/punchlist.png";
import documentIcon from "././../../assets/documents.png";

import Card from 'react-bootstrap/Card';

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      projects: [],
      id: this.props.match.params.id,
      currentUser:  AuthService.getCurrentUser() ,
      showModeratorBoard: false,
    };
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR")
      });
    }
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
    this.retrieveProjects(this.state.id);
  }
  retrieveProjects(id) {
    ProjectDataService.get(id)
      .then(response => {
        this.setState({
          projects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const {id,showModeratorBoard,projects} = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Card
              bg={'success'}
              text={'white'}
              //style={{ width: '14rem' }}
              className="mb-2"
            >
              <Card.Body>
                <Card.Title><h4>{projects.title}</h4></Card.Title>
                <Card.Text>
                  <h6>Description : {projects.description}</h6>
                  <h6>Location: {projects.location}</h6> 
                  <h6>From : {projects.startdate} to {projects.enddate}</h6>
                </Card.Text>
              </Card.Body>
            </Card> 
          </div>
        </div>
        <h3>Project Tools</h3>
        <div className="row">
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Project Detail Specification with Analytics">
            <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/portfolio/" + id} style={{ 'text-decoration': 'none' }}>
              <img src={portfolioIcon} alt="" width="50"/>
              <h3 className="h5 nav-heading-title mb-0">Portfolio</h3>
              {/* <span className="fs-sm fw-normal text-muted">Contains abstract project detail specification with analytics</span> */}
            </Link>
            </div>
          </div>
          {/* <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="">
            <a className="d-block nav-heading text-center mb-2 mt-2" href="/rfi" style={{ 'text-decoration': 'none' }}>
              <img src={rfiIcon} alt="" width="50"/>
              <h3 className="h5 nav-heading-title mb-0">RFI</h3>
              <span className="fs-sm fw-normal text-muted">Help to run the project smoothly and on schedule</span>
            </a>
            </div>
          </div> */}
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Manage meetings">
            <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/meetings/"+id} style={{ 'text-decoration': 'none' }}>
              <img src={meetingIcon} alt="" width="50"/>
              <h3 className="h5 nav-heading-title mb-0">Meetings</h3>                
              {/* <span className="fs-sm fw-normal text-muted">Manage all aspects of your project meetings from agenda distribution</span> */}
            </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Organise & define project workflows">
            <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/actionplan/" + id}  style={{ 'text-decoration': 'none' }}>
              <img src={actionplanIcon} alt="" width="50"/>
              <h3 className="h5 nav-heading-title mb-0">Action Plan</h3>
              {/* <span className="fs-sm fw-normal text-muted">Organise & define project workflows</span> */}
            </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Manage the project Drawings">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/drawing/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={drawingsIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Drawings</h3>
                {/* <span className="fs-sm fw-normal text-muted">Manage your project drawings in one place</span> */}
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-lg-4 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="">
            <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/bidding/" + id} style={{ 'text-decoration': 'none' }}>
              <img src={biddingIcon} alt="" width="50"/>
              <h3 className="h5 nav-heading-title mb-0">Biddings</h3>
              <span className="fs-sm fw-normal text-muted">Manage all the bid packages and bidding proceses</span>
            </Link>
            </div>
          </div> */}
          
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Manage & Capture Images">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/photos/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={photosIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Photos</h3>
                {/* <span className="fs-sm fw-normal text-muted">Manage and capture all the images</span> */}
              </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Manage Documents">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/document/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={documentIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Documents</h3>
                {/* <span className="fs-sm fw-normal text-muted">Manage documents</span> */}
              </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Manage Punch Items">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/punchlist/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={punchlistIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Punch List</h3>
                {/* <span className="fs-sm fw-normal text-muted">Manage punch items</span> */}
              </Link>
            </div>
          </div>
          <div className="col-lg-3 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Track the details at Site">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/managedailylogs/"+ id} style={{ 'text-decoration': 'none' }}>
                <img src={dailylogIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Daily Log</h3>
                {/* <span className="fs-sm fw-normal text-muted">Keep track of every detail at job site each and everyday</span> */}
              </Link>
            </div>
          </div>
        </div>
         
          {/* Meeting Model Starts */}
          {/* <div className="modal fade" id="meetingModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">Choose what you want to do?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <Link to={"/meetingsconfiguration/"+id} className="btn btn-primary ml-5 mr-3"> Meeting Configuration</Link>
                  <Link to={"/managemeetings/"+id} className="btn btn-primary mr-6"> Manage Meetings</Link>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div> */}
          {/* Meeting Model Ends */}

          {/* Daily Log Model Starts */}
          {/* <div className="modal fade" id="dlModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">Choose what you want to do?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <a href="/dailylogsconfiguration" className="btn btn-primary ml-5 mr-3"> Daily Log Configuration</a>
                  <a href="/managedailylogs" className="btn btn-primary mr-6"> Manage Daily Logs</a>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div> */}
          {/* Daily log Model Ends */}

      </div>
    );
  }
}