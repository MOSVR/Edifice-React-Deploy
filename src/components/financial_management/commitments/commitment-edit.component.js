import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import CommitmentDataService from "./../../../services/commitment.service";
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


const EditCommitment = props => {

/**validation */
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    contractCompany: Yup.string().required('Contract Company is required'),
    status: Yup.string().required('Status is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.string().required('Start Date is required'),
    estimatedCompletionDate: Yup.string().required('Estimated Copletion Date is required'),
 actualCompletionDate: Yup.string().required('Actual Completion Date is required'),
 signedContractReceivedDate: Yup.string().required('Signed Contract Received Date is required'),
    inclusions: Yup.string().required('Inclusions are required'),
exclusions: Yup.string().required('Exclusions are required'),
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
  const initialCommitmentState = {
    id: null,
    title :"",
    contractCompany :"",
    status :"",
    description :"",
    startDate :"",
    estimatedCompletionDate :"",
actualCompletionDate :"",
signedContractReceivedDate :"",
    inclusions: "",
exclusions:"",
    projectId:props.match.params.id,  
    
  };
  const [currentCommitment, setCurrentCommitment] = useState(initialCommitmentState);
  const [message, setMessage] = useState("");

  const getCommitment = id => {
    CommitmentDataService.get(id)
      .then(response => {
        setCurrentCommitment(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCommitment(props.match.params.id);
  },[props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCommitment({ ...currentCommitment, [name]: value });
  };



  const updateCommitment = () => {
    CommitmentDataService.update(currentCommitment.id, currentCommitment)
      .then(response => {
        console.log(response.data);
        setMessage("The commitment was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  //delete is working but when deleting, validation errors occur
  const deleteCommitment = () => {
    CommitmentDataService.delete(currentCommitment.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/commitment/"+currentCommitment.projectId);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">
      {currentCommitment ? (
        <div class="container">
          <h4>#{currentCommitment.id} - {currentCommitment.title}</h4>
          
          <div className="col-12 text-right">
              
            <Link to={"/viewsov/"+currentCommitment.projectId+"/"+currentCommitment.id}>
                    <button className="btn btn-success m-2">View SoVs </button>
                    </Link><br />
                    {/*<Link to={"/viewpayment/"+currentCommitment.id}>
                    <button className="btn btn-success m-2">Payments </button>
                    </Link><br />
                    <Link to={"/addinvoice/"+currentCommitment.id}>
                    <button className="btn btn-success m-2">Invoices </button>
                    </Link>*/}
                    </div>
                    <hr />
          <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
         
                  id="title"
 {...register('title')}
                  value={currentCommitment.title}
                  onChange={handleInputChange}
  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                />
<div className="invalid-feedback">{errors.title?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="contractCompany">Contract Company :</label>
             
                <input
                type="text"
                
                id="contractCompany"
                 {...register('contractCompany')}
                value={currentCommitment.contractCompany}
                onChange={handleInputChange}
                name="contractCompany"
  className={`form-control ${errors.contractCompany ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.contractCompany?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status :</label>
            
              <input
                type="text"
            
                id="status"
                {...register('status')}
                value={currentCommitment.status}
                onChange={handleInputChange}
                name="status"
  className={`form-control ${errors.status ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.status?.message}</div>
              </div>
              {/*<div className="form-group">
                <label htmlFor="defaultRetainage">Default Retainage % :</label>
                <input
                type="text"
                className="form-control"
                id="defaultRetainage"
                required
                value={currentCommitment.defaultRetainage}
                onChange={this.onChangeDefaultRetainage}
                name="defaultRetainage"
              />
        </div>*/}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
           
                  id="description"
 {...register('description')}
                  value={currentCommitment.description}
                  onChange={handleInputChange}
  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                />
<div className="invalid-feedback">{errors.description?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date :</label>
            
              <input
                type="date"
              
                id="startDate"
                {...register('startDate')}
                value={currentCommitment.startDate}
                onChange={handleInputChange}
                name="startDate"
  className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.startDate?.message}</div>
              </div> 
              <div className="form-group">
                <label htmlFor="estimatedCompletionDate">Estimated Completion Date :</label>

              <input
                type="date"
         
                id="estimatedCompletionDate"
                {...register('estimatedCompletionDate')}
                value={currentCommitment.estimatedCompletionDate}
                onChange={handleInputChange}
                name="estimatedCompletionDate"
  className={`form-control ${errors.estimatedCompletionDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.estimatedCompletionDate?.message}</div>
              </div>
             
            <div className="form-group">
                <label htmlFor="actualCompletionDate">Actual Completion Date :</label>
 
              <input
                type="date"
      
                id="actualCompletionDate"
                   {...register('actualCompletionDate')}
                value={currentCommitment.actualCompletionDate}
                onChange={handleInputChange}
                name="actualCompletionDate"
  className={`form-control ${errors.actualCompletionDate? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.actualCompletionDate?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="signedContractReceivedDate">Signed Contract Received Date :</label>
 
              <input
                type="date"
   
                id="signedContractReceivedDate"
                      {...register('signedContractReceivedDate')}
                value={currentCommitment.signedContractReceivedDate}
                onChange={handleInputChange}
                name="signedContractReceivedDate"
 className={`form-control ${errors.signedContractReceivedDate? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.signedContractReceivedDate?.message}</div>
              </div>
             
            
            <div className="form-group">
                <label htmlFor="">Inclusions :</label>

              <input
                type="textarea"

                id="inclusions"
               {...register('inclusions')}
                value={currentCommitment.inclusions}
                onChange={handleInputChange}
                name="inclusions"
 className={`form-control ${errors.inclusions? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.inclusions?.message}</div>
              </div>
            
            <div className="form-group">
                <label htmlFor="">Exclusions :</label>
              
              <input
                type="textarea"

                id="exclusions"
              {...register('exclusions')}
                value={currentCommitment.exclusions}
                onChange={handleInputChange}
                name="exclusions"
 className={`form-control ${errors.exclusions? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.exclusions?.message}</div>
   </div>
            <div className="form-group">

            <button className="btn btn-danger" onClick={deleteCommitment}>
            Delete <DeleteIcon/> 
          </button>

          <button
            type="submit"
            className="btn btn-success m-2"
            onClick={updateCommitment}
          >
            Update <UpdateIcon/>
          </button>
          <Link to={"/commitment/" + currentCommitment.projectId}>
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
                <TimelineContent><h6><strong>Step 1</strong><br/>Create a Subcontract</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Add SoVs</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>Values will be automatically added to the Budget</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a Subcontract.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
          


     
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default  EditCommitment;