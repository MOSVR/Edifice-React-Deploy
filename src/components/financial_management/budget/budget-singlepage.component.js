import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BudgetDataService from "./../../../services/budget.service";
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import UpdateIcon from '@material-ui/icons/Update';
import { Route, useParams } from "react-router-dom";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Link } from "react-router-dom";


const Budget = props => {

  /**validation */
  const validationSchema = Yup.object().shape({
    costCode: Yup.string().required('Cost Code is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
    estimatedBudget: Yup.string().required('Amount is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2));
  };
/**End of validation */


  //const {projectId}= useParams();
  const initialBudgetState = {
    id: null,
    costCode: "",
    description: "",
    date: "",
    estimatedBudget: "",
    projectId:""
  };
  const [currentBudget, setCurrentBudget] = useState(initialBudgetState);
  const [message, setMessage] = useState("");

  const getBudget = id => {
    BudgetDataService.get(id)
      .then(response => {
        setCurrentBudget(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getBudget(props.match.params.id);
  },[props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentBudget({ ...currentBudget, [name]: value });
  };



  const updateBudget = () => {
    BudgetDataService.update(currentBudget.id, currentBudget)
      .then(response => {
        console.log(response.data);
        setMessage("The budget line item was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteBudget = () => {
    BudgetDataService.remove(currentBudget.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/budget/"+currentBudget.projectId);//check this again
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">
      {currentBudget ? (
        <div class="container">
          <h4>Budget Line Item</h4>
          <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="costCode">Cost Code</label>
             {/* <input
                type="text"
                className="form-control"
                id="costCode"
                required
                value={this.state.costCode}
                onChange={this.onChangeCostCode}
                name="costCode"
             />*/}
                <input
               
                id="costCode"
                {...register('costCode')}
                value={currentBudget.costCode}
                onChange={handleInputChange}
                className={`form-control ${errors.costCode ? 'is-invalid' : ''}`}
                name="costCode"
              />

              <div className="invalid-feedback">{errors.costCode?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="title">Description</label>
              <input
                type="text"
                
                id="description"
                name="description"
                {...register('description')}
                value={currentBudget.description}
                onChange={handleInputChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description"> Date</label>
              <input
                type="date"
               
                id="date"
                name="date"
                {...register('date')}
                value={currentBudget.date}
                onChange={handleInputChange}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.date?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Estimated Budget Amount</label>
              <input
                type="text"
               
                id="estimatedBudget"
                name="estimatedBudget"
                {...register('estimatedBudget')}
                value={currentBudget.estimatedBudget}
                onChange={handleInputChange}
                className={`form-control ${errors.estimatedBudget ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.estimatedBudget?.message}</div>
            </div>
            <div className="form-group">

            <button className="btn btn-danger" onClick={deleteBudget}>
            Delete <DeleteIcon/> 
          </button>

          <button
            type="submit"
            className="btn btn-success m-2"
            onClick={updateBudget}
          >
            Update <UpdateIcon/>
          </button>
          <Link to={"/budgetestimates/" + currentBudget.projectId}>
            <button className="btn btn-success">
            Cancel
            </button></Link>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>

            </div>
</form>
          </div>
          
          <div className="col-sm-6">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 1</strong><br/>Edit a Budget Line Item</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Estimated Budget Amount will be automatically updated in the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a Budget Line Item.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
          


     
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a budget line item...</p>
        </div>
      )}
    </div>
  );
};

export default Budget;