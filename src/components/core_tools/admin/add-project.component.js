import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProjectDataService from "./../../../services/project.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';


export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.newProject = this.newProject.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      location: "", 
      published: false,
      startdate: "",
      enddate: "",

      submitted: false,
      lastproject:[],
      currentIndex: -1,
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeLocation(e) {
    this.setState({
      location: e.target.value
    });
  }
  onChangeStartDate(e) {
    this.setState({
      startdate: e.target.value
    });
  }
  onChangeEndDate(e) {
    this.setState({
      enddate: e.target.value
    });
  }

  saveProject() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      location: this.state.location,
      startdate: this.state.startdate,
      enddate: this.state.enddate
    };

    ProjectDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          location: response.data.location,
          startdate: response.data.startdate,
          enddate: response.data.enddate,
          published: response.data.published,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    //this.state.getLastProjectID();
  }

  newProject() {
    this.setState({
      id: null,
      title: "",
      description: "",
      location: "",
      startdate: "",
      enddate: "",
      published: false,

      submitted: false
    });
  }

  getLastProjectID(){
    ProjectDataService.findlastProject()
      .then(response => {
          this.setState({
            lastproject: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }

  render() {
    const {lastproject, currentIndex} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success m-2" onClick={this.newProject}>Add Project</button>
            <Link className="btn btn-primary m-2" to={"/projects"}>Back Home</Link>
            <div>
              {lastproject && lastproject.map((project, index) => (
                <div
                    className={
                      "container col-3" +  (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                  {/* unit data */}
                  <Link to={"/adddepartment/"+project.id} className="btn btn-warning"  style={{ 'text-decoration': 'none' }}>Add Departments</Link>
                </div>
              ))}
            </div>
            </center>
          </div>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add New Project</h2>
            <h5>Step 1: Project Settings</h5>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                required
                value={this.state.location}
                onChange={this.onChangeLocation}
                name="location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="startdate"
                required
                value={this.state.startdate}
                onChange={this.onChangeStartDate}
                name="startDate"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                className="form-control"
                id="enddate"
                required
                value={this.state.enddate}
                onChange={this.onChangeEndDate}
                name="endDate"
              />
            </div>

            <button onClick={()=>{this.saveProject(); setTimeout(this.setState.bind(this, {position:1}), 3000); this.getLastProjectID()}} className="btn btn-success">
              Create Project
            </button>
            </div>
            <div className="container col-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1 </strong>Project Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2 :</strong>Define departments</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3 :</strong>Define milestones</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 4 :</strong>Assign users for the project</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>

          </div>
          </div>
        )}
      </div>
    );
  }
}