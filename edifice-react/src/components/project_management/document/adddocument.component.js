import React, { Component } from "react";
import { Link } from "react-router-dom";
import DocumentDataService from "./../../../services/documentfile.service";
import DirectoryDataService from "./../../../services/directory.service";
import UploadService from "./../../../services/document.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

export default class AddDocument extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangePath = this.onChangePath.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.newDocument = this.newDocument.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      category: "1",
      status: "Not Complete",
      projectId: this.props.match.params.id, 
      
      directory: [],
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
    this.retriveDocumentCategory(this.props.match.params.id);
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
  onChangePath(e) {
    this.setState({
      path: e.target.value
    });
  }
  retriveDocumentCategory(id){
    DirectoryDataService.getAll(id)
    .then(response => {
        this.setState({
          directory: response.data,
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  saveDocument() {  
    var data = {
      title: this.state.title,
      description: this.state.description,
      category: this.state.category,
      status: this.state.status,
      projectId: this.state.projectId
    };

    DocumentDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
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

  newDocument() {
    this.setState({
      id: null,
      title: "",
      description: "",
      category: "",
      status: "Not Complete",
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

  render() {
    const {projectId, title,currentIndex, directory,selectedFiles,
      currentFile,
      progress,
      message,
    } = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>Document details successfully submitted!</h4>
            <Link to={"/document/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Back Home
            </Link>
            <Link to={"/adddocument/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Add Document
            </Link>
          </center>
          </div>
        ) : (
          <div class="container">
            <h2>Add New Document</h2>
            <div className="row">
            <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Document Title</label>
              <input
                type="text"
                className="form-control"
                id="name"
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
              <label htmlFor="category">Document Category</label>
              <select 
                className="form-control"
                id="datatype"
                required
                name="category"
                value={this.state.category}
                onChange={this.onChangeType}
              >
                {directory &&
                directory.map((singledirectory, index) => (
                <option
                    value={singledirectory.id}
                    onChange={this.onChangeType}
                    key={index}
                >
                {/* unit data */}
                {singledirectory.title}
                </option>
                ))}
              </select>
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
              <h5>Upload the Document source</h5>
              <p>Document name : - {title}{".pdf"}</p>
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
            <button onClick={this.saveDocument} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}