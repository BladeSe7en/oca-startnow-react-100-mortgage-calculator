import React from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
var AmortizeJS = require('amortizejs').Calculator;
var moment = require('moment');



export default class App extends React.Component {
  // your Javascript goes here
  constructor() {
    super();
    this.state = {
      balance: "",
      rate: "",
      term: "15",
      output: null,
      mortgage: null
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit   = this.handleSubmit.bind(this);
    this.calculate      = this.calculate.bind(this)
  }
  handleOnChange(event) { //this manages the change of input and name, sets new state
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    var principal       = parseFloat(this.state.balance);
    var rate            = parseFloat(this.state.rate) / 100 / 12;
    var numberOfMonths  = (+(this.state.term)) * 12;
    var monthlyPayment  = principal * (rate * ((1 + rate) ** numberOfMonths)) / (((1 + rate) ** numberOfMonths) - 1);
    this.calculate();
    this.setState({
      output: Math.ceil(monthlyPayment * 100) / 100,
    });
  }
  calculate() {
    const mortgage = AmortizeJS.calculate({
      method: 'mortgage',
      apr: parseFloat(+(this.state.rate)) / 100 / 12,
      balance: (+(this.state.balance)),
      loanTerm: (+(this.state.term)) * 12,
      startDate: new Date()
    });
    this.setState({ mortgage });
  }

  render() {
    return (
      <div className='container'>
        <h3>Mortgage Calculator</h3>
        <form className="form-horizontal" onSubmit={this.handleSubmit}>

          <div className="form-group">
            <label className="col-sm-2 control-label">Loan Balance</label>
            <div className="col-sm-10">
              <input name="balance" type="number" className="form-control" placeholder="Loan Balance" value={this.state.balance} onChange={this.handleOnChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Interest Rate (%)</label>
            <div className="col-sm-10">
              <input name="rate" type="number" step="0.01" className="form-control" placeholder="APR%" value={this.state.rate} onChange={this.handleOnChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Loan Term (years)</label>
            <div className="col-sm-10">
              <select name="term" className="form-control" value={this.state.term} onChange={this.handleOnChange}>
                <option value="15">15 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-small-10">
              <button name="submit" className="btn btn-primary">Calculate</button>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <div id="output" value={this.state.output}>
                <h3>Monthly Payment: ${this.state.output} {this.state.mortgage &&
                'End Date: ' + moment(this.state.mortgage.endDate).format('MM/DD/YYYY')}</h3>
                {/* <thead>
            <tr>
              <th><strong>Monthly Payment: ${this.state.output}}</strong></th>
              <th><strong>'End Date: ' + {moment(this.state.mortgage.endDate).format('MM/DD/YYYY')}</strong></th>
              </tr>
              <tr>
              <td><strong>Total Of All Payments: $({this.state.output} * numberOfMonths)</strong></td>
              <td><strong>Total Interest Payed: $({this.state.output} * numberOfMonths - {this.state.balance}) </strong></td>
              </tr>
              </thead> */}
              </div>
            </div>
          </div>
          <AmortizationSchedule
            mortgage={this.state.mortgage}
            />

        </form>
      </div >
    );
  };
}


class AmortizationSchedule extends React.Component {
  render() {
    return (
      <div>
        <h3> Amortization Schedule Logic </h3>


        <table className="amortization-table table">
        
          <thead>
            <tr>
              <th>Date</th>
              <th><strong>Interest</strong></th>
              <th><strong>Principal</strong></th>
              <th><strong>Balance</strong></th>
            </tr>
          </thead>

          {this.props.mortgage && this.props.mortgage.schedule.map((element) =>
            <tr key={element.principal}>
              <td><strong>{moment(element.date).format('MM/DD/YYYY')}</strong></td>
              <td><strong>{element.interest.toFixed(2)}</strong></td>
              <td><strong>${element.principal.toFixed(2)}</strong></td>
              <td><strong>${element.remainingBalance.toFixed(2)}</strong></td>
            </tr>
          )
          }
        </table>

      </div>

    )
  }

}
