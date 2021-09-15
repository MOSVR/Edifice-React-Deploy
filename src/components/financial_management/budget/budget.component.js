import React, { Component } from "react";
import { Link } from "react-router-dom";
import BudgetDataService from "./../../../services/budget.service";
import DirectCostDataService from "./../../../services/directcost.service";
import SovDataService from "./../../../services/sov.service";
import Table from 'react-bootstrap/Table';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckIcon from '@material-ui/icons/Check';
import HomeIcon from '@material-ui/icons/Home';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

export default class BudgetList extends Component {
    constructor(props) {
      super(props);
      this.getBudgetOverview  = this.getBudgetOverview.bind(this);
      this.calculateTotalDirectCosts = this.calculateTotalDirectCosts.bind(this);
      this.calculateTotalSovs = this.calculateTotalSovs.bind(this);
      this.calculateTotalEstimatedBudget = this.calculateTotalEstimatedBudget.bind(this);
      this.onChangeSearchCostCode= this.onChangeSearchCostCode.bind(this);
      this.findByCostCode=this.findByCostCode.bind(this);
      this.handleClose=this.handleClose.bind(this);
      this.handleClick=this.handleClick.bind(this);
      this.state = {
        id: this.props.match.params.id,
        budgets: [],
        projectId: "",
        directCostTotal:"",
        budgetTotal:"",
        sovTotal:"",
        tot:"",
        searchCostCode: "",
        anchorEl:null
      };
    }
  
    componentDidMount() {
      this.getBudgetOverview(this.props.match.params.id);
      this.calculateTotalDirectCosts(this.props.match.params.id);
      this.calculateTotalSovs(this.props.match.params.id);
      this.calculateTotalEstimatedBudget(this.props.match.params.id);
    }

    handleClick(e){
      const anchorEl = e.target.value;
  
      this.setState({
        anchorEl: anchorEl
      });
    }
  
    handleClose(){
      this.setState({
        anchorEl: null
      });
    };

    onChangeSearchCostCode(e) {
      const searchCostCode = e.target.value;
  
      this.setState({
        searchCostCode: searchCostCode
      });
    }

    findByCostCode(id,searchCostCode){
      BudgetDataService.findByCostCode(id,searchCostCode)
        .then((response) => {
          this.setState({
            budgets: response.data
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getBudgetOverview(id) {
      BudgetDataService.getBudgetOverview(id)
        .then(response => {
          this.setState({
            budgets: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

    calculateTotalDirectCosts(id){
 
      DirectCostDataService.getTotalDirectCosts(id)
      .then(response => {
        this.setState({
         directCostTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }
  
    calculateTotalSovs(id){
   
      SovDataService.getTotalSovs(id)
      .then(response => {
        this.setState({
         sovTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }
  
    calculateTotalEstimatedBudget(id){
   
      BudgetDataService.getTotalBudget(id)
      .then(response => {
        this.setState({
          budgetTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }

    render() {
        const { id,directCostTotal,budgetTotal,sovTotal,searchCostCode,budgets,currentIndex,anchorEl} = this.state;
        const data = [
          {
            name: "Estimated Budget",
            EB: (budgetTotal),
          },
          {
            name: "Total Cost",
            TC : (sovTotal + directCostTotal)
          }
        ];
        return (
            <div>
              <div className="row">
              <div className="col" >
               <div  className="row"> <Link to={"/financialmanagementhome/" + id}><HomeIcon style={{ color: "#2b2d42"}}/></Link>&nbsp;<h3>BUDGET OVERVIEW</h3></div>
              <p>See the Overview of the Project Budget</p>
</div>
<div className="col" >
<div className="row">
<div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
 {(Number(sovTotal)+Number(directCostTotal)) > budgetTotal ? 
              <div className="row"><ReportProblemOutlinedIcon style={{ color: "red" }}/><h3 className="h5 nav-heading-title mb-0">&nbsp;Over Budgeted</h3></div>
: <CheckIcon/>
}
<br />
</div>
</div>

<div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0">Revised Amount(Rs.) : <span style={{ color: 'red' }}>{Number(sovTotal)+Number(directCostTotal)-Number(budgetTotal)}</span></h3>
<br />
</div>
</div>
</div>
</div>
              </div>
              {/*<Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
Financial Management Home
</Button>
<Menu
  id="simple-menu"
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={this.handleClose}
>
<Link  to={"/budgetestimates/"+id}><MenuItem onClick={this.handleClose}>Budget Overview</MenuItem></Link>
     <Link  to={"/budgetestimates/"+id}><MenuItem onClick={this.handleClose}>Budget Estimates</MenuItem></Link>
   <Link  to={"/directcost/"+id}><MenuItem onClick={this.handleClose}>Direct Costs</MenuItem></Link>
 <Link  to={"/commitment/"+id}><MenuItem onClick={this.handleClose}>Commitments</MenuItem></Link>
        </Menu>*/}
              <hr></hr>
              <div className="row" style={{alignItems: "center"}} >
              <div className="col" >
              <BarChart
      width={500}
      height={200}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="EB" fill="#82ca9d" />
      <Bar dataKey="TC" fill="#EF253D" />
    </BarChart>
   </div>
  
   <div className="col" >     
   <div className="row" style={{alignItems: "center"}} >
          <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Estimated Budget</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {budgetTotal}</span>
              </div>
            </div>
<div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Direct Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {directCostTotal}</span>
              </div>
    </div>
    </div>
    <div className="row" style={{alignItems: "center"}} >
          <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Commited Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {sovTotal} </span>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
              <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {sovTotal+directCostTotal}</span>
              </div>
            </div>
            </div>
            {/*<div className="form-group col-md-4">
        <div className="input-group mb-3">
        
 <select 
                
                id="costCode"
           
                
                name="costCode"
                className="form-control"
            placeholder="Search by cost code"
            value={searchCostCode}
            onChange={this.onChangeSearchCostCode}
              >
                <option  selected value="">All</option>
             {budgets &&
                budgets.map((budget, index) => (
                <option
                    //value={budget.costCode}
                    //onChange={onChangeSearchCostCode}
                    key={index}
                >
                
                {budget.costCode}
                </option>
                ))}

           
             
              </select>

          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.findByCostCode}
            >
              Search
            </button>
          </div>
        </div>
      </div>*/}
          </div>
          </div>   
          <hr /> 
          <br />
            
              {/* Drawing List */}
              <Table  className="table table-striped table-bordered" responsive>
                <thead className="Table-header">
                  <tr>
                  <th>#</th>
                    <th>Cost Code</th>
                    <th>Estimated Budget</th>
                    <th>Direct Cost</th>
                    <th>Commited Cost</th>
                    <th>Total Cost</th>
                    <th>Revised Amount</th>
                    <th>Over/Under</th>
                  </tr>
                </thead>
                {/* Functional for table data */}
                <tbody>
                {budgets &&
                    budgets.map((budget, index) => (
                    <tr
                        // className={
                        // "list-group-item row" +
                        // (index === currentIndex ? "active" : "")
                        // }
                        // onClick={() => this.setActiveProject(project, index)}
                        key={index}
                    >

<td>{budget.id}</td>
                    <td>{budget.costCode}</td>
                    <td>{budget.btotal}</td>
                    <td>{budget.dtotal}</td>
                    <td>{budget.stotal}</td>
                    <td>{Number(budget.stotal)+Number(budget.dtotal)}.00</td>
                    <td>{Number(Number(budget.stotal)+Number(budget.dtotal))-Number(budget.btotal)}.00</td> 
                    <td>{(Number(budget.stotal)+Number(budget.dtotal)) > budget.btotal ? <ArrowUpwardIcon style={{ color: "red" }}/>:(Number(budget.stotal)+Number(budget.dtotal)) < budget.btotal ? <ArrowDownwardIcon style={{ color: "green" }}/>:<CheckIcon/>}</td>    
                    </tr>
                    ))}
                </tbody>
                {/*Ends */}
              </Table>
             
            </div>
        );
    }
}