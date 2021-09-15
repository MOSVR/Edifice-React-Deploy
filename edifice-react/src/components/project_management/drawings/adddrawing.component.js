import React, { Component } from "react";
import { Link } from "react-router-dom";
import DrawingDataService from "./../../../services/drawing.service";
import DrawingCategoryService from "../../../services/drawing-category.service";
import UploadService from "./../../../services/document.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

export default class AddDrawing extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.saveDrawing = this.saveDrawing.bind(this);
    this.newDrawing = this.newDrawing.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      // category default value is 1(gallery mode)
      category: "1",
      status: "Not Complete",
      version: 1, 
      projectId: this.props.match.params.id, 
      
      drawingcategories: [],
      currentIndex: -1,
      submitted: false,

      //file
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
    };
  }
  componentDidMount() {
    this.retriveDrawingCategory(this.props.match.params.id);
  }
  onChangeName(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeType(e) {
    this.setState({
      category: e.target.value
    });
  }
  retriveDrawingCategory(id){
    DrawingCategoryService.getAll(id)
    .then(response => {
        this.setState({
          drawingcategories: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  saveDrawing() {  
    var data = {
      title: this.state.title,
      description: this.state.description,
      category: this.state.category,
      version: this.state.version,
      status: this.state.status,
      projectId: this.state.projectId
    };

    DrawingDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          version: response.data.version,
          status: response.data.status,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  upload() {
    let currentFile = this.state.selectedFiles[0];
    let fileName = this.state.title+".pdf";
    console.log(currentFile);
    console.log(fileName);
    
    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, fileName, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }
  newDrawing() {
    this.setState({
      id: null,
      title: "",
      description: "",
      category: "",
      projectId: this.props.match.params.id,
      
      submitted: true
    });
  }

  render() {
    const {projectId, currentIndex, drawingcategories,selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
      title} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>Drawing details successfully submitted!</h4>
            <Link to={"/drawing/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Back Home
            </Link>
            <Link to={"/adddrawing/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Add Drawing
            </Link>
          </center>
          </div>
        ) : (
          <div class="container">
            <h2>Add New Drawing</h2>
            <div className="row">
            <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeName}
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
              <label htmlFor="category">Drawing Category</label>
              <select 
                className="form-control"
                id="datatype"
                required
                name="category"
                value={this.state.category}
                onChange={this.onChangeType}
              >
                {drawingcategories &&
                drawingcategories.map((drawingcategory, index) => (
                <option
                    value={drawingcategory.id}
                    onChange={this.onChangeType}
                    key={index}
                >
                {/* unit data */}
                {drawingcategory.title}
                </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Version</label>
              <input
                type="text"
                className="form-control"
                value="1.0.0"
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Status</label>
              <input
                type="text"
                className="form-control"
                value="Not Complete 🔴"
                disabled
              />
            </div>  
            <div>
              <h5>Upload the Drawing Source</h5>
              <p>File source document : - {title}{".pdf"}</p>
              {/* Div starts */}
              <div>
                {currentFile && (
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-info progress-bar-striped"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: progress + "%" }}
                    >
                      {progress}%
                    </div>
                  </div>
                )}

                <label className="btn btn-default">
                  <input type="file" onChange={this.selectFile} />
                </label>

                <button className="btn btn-success"
                  disabled={!selectedFiles}
                  onClick={this.upload}
                >
                  Upload
                </button>

                <div className="alert alert-light" role="alert">
                  {message}
                </div>
                {/*Ends div here  */}
                </div>
            {/* End the container uploading here */}
            </div> 
            </div>
            <div className="col-sm-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1</strong><br/>Drawing Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Upload File</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            </div>
            <button onClick={this.saveDrawing} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}