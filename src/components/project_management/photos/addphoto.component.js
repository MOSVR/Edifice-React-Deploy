import React, { Component } from "react";
import { Link } from "react-router-dom";
import PhotoFileDataService from "./../../../services/photo.service";
import AlbumService from "../../../services/album.service";
import UploadService from "./../../../services/photoupload.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
// import CameraCapture from './cameracpature.component';

export default class AddPhoto extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangePath = this.onChangePath.bind(this);
    this.savePhoto = this.savePhoto.bind(this);
    this.newPhoto = this.newPhoto.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      category: "1",
      path: "http://localhost:8080/api/photos/", 
      projectId: this.props.match.params.id, 
      
      albums: [],
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
    this.retriveAlbum(this.props.match.params.id);
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
  onChangeType(e) {
    this.setState({
      category: e.target.value
    });
  }
  onChangePath(e) {
    this.setState({
      path: e.target.value
    });
  }
  retriveAlbum(id){
    AlbumService.getAll(id)
    .then(response => {
        this.setState({
          albums: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  savePhoto() {  
    var data = {
      title: this.state.title,
      description: this.state.description,
      category: this.state.category,
      path: this.state.path,
      projectId: this.state.projectId
    };

    PhotoFileDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          path: response.data.path,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPhoto() {
    this.setState({
      id: null,
      title: "",
      description: "",
      category: "",
      path: "",
      projectId: this.props.match.params.id,
      
      submitted: false
    });
  }
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  upload() {
    let currentFile = this.state.selectedFiles[0];
    let fileName = this.state.title+".png";
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

  render() {
    const {projectId, title,currentIndex, albums,selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>Photo details successfully submitted!</h4>
            <Link to={"/photos/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Back Home
            </Link>
            <Link to={"/addphoto/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Add Photo
            </Link>
          </center>
          </div>
        ) : (
          <div class="container">
            <h2>Add New Photo</h2>
            <div className="row">
            <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Image Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
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
              <label htmlFor="category">Album</label>
              <select 
                className="form-control"
                id="datatype"
                required
                name="category"
                value={this.state.category}
                onChange={this.onChangeType}
              >
                {albums &&
                albums.map((album, index) => (
                <option
                    value={album.id}
                    onChange={this.onChangeType}
                    key={index}
                >
                {/* unit data */}
                {album.title}
                </option>
                ))}
              </select>
            </div>  
            <div>
              <h5>Upload the Image Source</h5>
              <p>File source document : - {title}{".png"}</p>
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
                <TimelineContent><h5><strong>Step 1</strong><br/>Document Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Submit</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            </div>
            <button onClick={this.savePhoto} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}