import React from "react";
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
      areaValue: '',
      disabledParse: true,
      disabledSend: true,
      emailStatus: 'Not Started'
    };
    this.handleChangeArea = this.handleChangeArea.bind(this);
    this.handleClickParse = this.handleClickParse.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    
  }

  handleChangeArea(event){
    this.setState({
      areaValue: event.target.value
    });
  }

  handleClickParse(event){
    const extractedEmails = this.extractEmails(this.state.areaValue);
    const emailsObj = [];
    // console.log(extractedEmails);
    extractedEmails.forEach(function (item, index) {
      emailsObj.push({
        id: index + 1,
        email: item,
        status: 'Not Started'
      })
    });
    // console.log(emailsObj);
    this.setState({
      emails: emailsObj
    });
  }

  handleClickClear(event){
    this.setState({
      areaValue: '',
      emails: []
    });
  }


  extractEmails(text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  }

  render() {
    const areaValue = this.state.areaValue;
    const rows = this.state.emails.map((email, index) =>
    <tr key={email.id}>
      <th scope="row">{email.id}</th>
      <td>{email.email}</td>
      <td>{email.status}</td>
      <td><button type="button" className="btn btn-sm btn-secondary">Resend</button></td>
    </tr>
    );
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Bulk Sending emails</h2>
              <div className="form-group">
                
                { areaValue.length === 0  
                  ?<button type="button" className="btn btn-info btn-sm disabled" disabled>Paste emails</button>
                  :<React.Fragment>
                    <button type="button" className="btn btn-info btn-sm" onClick={this.handleClickParse}>Parse</button>
                    <button type="button" className="btn btn-sm btn-light" onClick={this.handleClickClear}>Clear</button>
                  </React.Fragment>
                }
                
                <button type="button" className="btn btn-primary btn-sm disabled" disabled>Bulk Send</button>
                <hr/>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  value={this.state.areaValue} 
                  onChange={this.handleChangeArea}>
                </textarea>
              </div>
              <h4>Results</h4>   
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">To Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
