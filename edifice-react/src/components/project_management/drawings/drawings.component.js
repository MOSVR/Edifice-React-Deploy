import React, { Component } from "react";
import { Link } from "react-router-dom";
import DrawingDataService from "./../../../services/drawing.service";
import DrawingCategoryService from "../../../services/drawing-category.service";
// import DeleteIcon from '@material-ui/icons/Delete';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import UpdateIcon from '@material-ui/icons/Update';
import Pdfviewer from "./pdfviewer.component";
import Card from 'react-bootstrap/Card';
import drawingcover from "././../../../assets/PM/photos/drawing.jpg";

export default class Drawings extends Component {
    constructor(props) {
      super(props);
      this.retrieveDrawing = this.retrieveDrawing.bind(this);
      this.state = {
        drawings: [],
        drawingcategories: [],
        currentIndex: -1,
        content: "",
        id: this.props.match.params.id
      };
    }
    componentDidMount() {
      this.retrieveDrawing(this.props.match.params.id);
      this.retriveDrawingCategory(this.props.match.params.id);
    }
    retrieveDrawing(id) {
      DrawingDataService.getAll(id)
        .then(response => {
          this.setState({
            drawings: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
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

    render() {
        const { drawings , drawingcategories, currentIndex,id } = this.state;
        // const classes = useStyles();
        return (
        <div>
            <div className="container row">
                <div className="col-12">
                    <h2>Drawings</h2>
                    <h6>Manage the drawings,other related planning materials in here</h6>
                </div>
            <hr></hr>
            </div>
            <div className="container">
                
                <Link className="btn btn-primary mr-2" to={"/adddrawing/"+id}>
                Add New Drawing
                </Link>
                <Link className="btn btn-primary" to={"/adddrawingcategory/"+id}>
                Add Catgory
                </Link>
                <hr></hr>
            </div>
        <div className="container">
        <h3>Drawing Category</h3>
        <div className="container row">
            {drawingcategories &&
                drawingcategories.map((drawingcategory, index) => (
                    <div
                    className={
                    "container col-3" +
                    (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                {/* unit data */}
                <Link to={"/viewdrawingcategory/"+drawingcategory.id}>
                        <Card
                        bg={'secondary'}
                        text={'dark'}
                        style={{ width: '15rem' }}
                        className="bg-dark mb-2"
                        >
                        <Card.Img src={drawingcover} alt="Card image" />
                        <Card.ImgOverlay>
                        <Card.Title><h4>{drawingcategory.title}</h4></Card.Title>
                        <Card.Text>
                           {drawingcategory.description == "" ? "No Description" : drawingcategory.description} 
                        </Card.Text>
                        </Card.ImgOverlay>
                        </Card>
                </Link>
                </div>
            ))}
            </div>
        </div>
        <hr></hr>
        <div className="container">
        <h3>Custom Drawing Viewer</h3>
        <p>View the drawing before use in a system and rapid file viewer</p>
        <Pdfviewer/>            
        </div>
        <hr></hr>
        <div className="container">
            {/* <h3>Recent List</h3>
            
            <ul className="list-group">
            {drawings &&
                drawings.map((drawing, index) => (
                <div
                    className={
                    "list-group-item row" +
                    (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                <div className="row">
                <div className="col-10">
                {drawing.name}
                    <h6>{drawing.description}</h6>
                    <p>{drawing.drawtype}</p>
                    
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-primary">View <VisibilityIcon/> </button>
                    </Link>
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-success m-2">Update <UpdateIcon/> </button>
                    </Link>
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-danger">Delete <DeleteIcon/> </button>
                    </Link>
                </div>
                </div>    
                </div>
                ))}
            </ul> */}
          </div> 
          </div>
        );
    }
}