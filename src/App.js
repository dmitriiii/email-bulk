import React from "react";
import styles from  './App.module.css';


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
    this.handleClickRemove = this.handleClickRemove.bind(this);
    
  }
  // Changes in textarea
  handleChangeArea(event){
    this.setState({
      areaValue: event.target.value
    });
  }
  
  handleClickParse(){
    let extractedEmails = this.extractEmails(this.state.areaValue);
    extractedEmails = this.removeDuplicates(extractedEmails);

    this.setState({
      emails: this.getEmailsObj(extractedEmails),
      areaValue: extractedEmails.join(" | ")
    });
  }

  //Click on clear button to empty
  handleClickClear(){
    this.setState({
      areaValue: '',
      emails: []
    });
  }

  handleClickRemove(index) {
    const email = this.state.emails[index].email;
    const areaValue = this.state.areaValue.replace(email, '');
    
    let extractedEmails = this.extractEmails(areaValue);
    extractedEmails = this.removeDuplicates(extractedEmails);
    
    this.setState({
      emails: this.getEmailsObj(extractedEmails),
      areaValue: extractedEmails.join(" | ")
    });
  }

  // Retrieve emails from inserted text
  extractEmails(text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  }

  //Remove duplicate emails
  removeDuplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }
    return ret_arr;
  }

  //Prepare emails object for state
  getEmailsObj(emails){
    let emailsObj = [];
    emails.forEach(function (item, index) {
      emailsObj.push({
        email: item,
        status: 'Not Started'
      })
    });
    return emailsObj;
  }
  
  render() {
    const areaValue = this.state.areaValue;
    const rows = this.state.emails.map((email,index) =>
    <tr key={index}>
      <th scope="row">{index+1}</th>
      <td>{email.email}</td>
      <td>{email.status}</td>
      <td>
        <button type="button" className="btn btn-sm btn-secondary"><i className="fas fa-redo"></i> Resend</button>
        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.handleClickRemove(index)}><i className="far fa-trash-alt"></i></button>
      </td>
    </tr>
    );
    return (
      <div className="App">
        <div className={styles.side}></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Bulk Sending emails</h2>
              <div className="form-group">
                
                { areaValue.length === 0  
                  ?<button type="button" className="btn btn-info btn-sm disabled" disabled><i className="fas fa-paste"></i> Paste emails</button>
                  :<React.Fragment>
                    <button type="button" className="btn btn-info btn-sm" onClick={this.handleClickParse}><i className="fas fa-hat-wizard"></i> Parse</button>
                    <button type="button" className="btn btn-sm btn-light" onClick={this.handleClickClear}><i className="fas fa-broom"></i> Clear All</button>
                  </React.Fragment>
                }
                
                <button type="button" className="btn btn-primary btn-sm disabled" disabled><i className="fas fa-mail-bulk"></i> Bulk Send</button>
                <hr/>
                <textarea 
                  className="form-control" 
                  rows="5" 
                  value={this.state.areaValue} 
                  onChange={this.handleChangeArea}
                  placeholder="Paste emails here">
                </textarea>
              </div>
              <h5 className={styles.results}>
                <span>Results</span>  
                <span>Total: {this.state.emails.length}</span>
              </h5>   
              <table className="table table-sm table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col" className={styles.firstCol}>#</th>
                    <th scope="col">To Email</th>
                    <th scope="col">Status</th>
                    <th scope="col" className={styles.lastCol}>Action</th>
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
