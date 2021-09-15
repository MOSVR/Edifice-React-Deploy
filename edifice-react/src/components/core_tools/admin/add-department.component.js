import React, { Component } from "react";
import { Link } from "react-router-dom";
import DepartmentDataService from "./../../../services/department.service";
import ProjectDataService from "./../../../services/project.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';


export default class AddDepartment extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePurpose = this.onChangePurpose.bind(this);
    this.saveDepartment = this.saveDepartment.bind(this);
    this.newDepartment = this.newDepartment.bind(this);

    this.state = {
      id: null,
      lastproject: [],
      title: "",
      description: "",
      purpose: "", 
      currentIndex: -1,
      projectId: "",

      submitted: false
    };
  }
  componentDidMount() {
    this.getLastProjectID();
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
  onChangePurpose(e) {
    this.setState({
      purpose: e.target.value
    });
  }
  getLastProjectID(){
    ProjectDataService.findlastProject()
      .then(response => {
          this.setState({
            lastproject: response.data,
            projectId: response.data[0].id
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }
  saveDepartment() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      purpose: this.state.purpose,
      projectId: this.state.projectId
    };
    DepartmentDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          purpose: response.data.purpose,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newDepartment() {
    this.setState({
      id: null,
      title: "",
      description: "",
      purpose: "",
      published: false,

      submitted: false
    });
  }

  render() {
    const {lastproject, currentIndex, projectId} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
            <h4>You add a Department successfully</h4>
           
            <button className="btn btn-success" onClick={this.newDepartment}  style={{ 'text-decoration': 'none' }}>
              Add Another Department
            </button>
            <Link to={"/addmilestone/"+projectId} className="btn btn-warning"  style={{ 'text-decoration': 'none' }}>
                       Add Milestone
                </Link>
          </div>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add New Department</h2>
            <h5>Step 2 : Define Departments</h5>
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
              <label htmlFor="description">Purpose</label>
              <input
                type="text"
                className="form-control"
                id="purpose"
                required
                value={this.state.purpose}
                onChange={this.onChangePurpose}
                name="purpose"
              />
            </div>
            <button onClick={this.saveDepartment} className="btn btn-success">
              Create Department
            </button>
            </div>
            <div className="container col-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 1 :</strong>Project Settings</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 2 </strong>Define departments</h5></TimelineContent>
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