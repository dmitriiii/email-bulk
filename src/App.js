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
      emailStatus: 'Not Started',
      
      smtp_from: '',
      smtp_email: '',
      smtp_pass: '',
      smtp_reply: '',
      smtp_subject: '',
      smtp_body: ''
    };
    this.handleChangeArea = this.handleChangeArea.bind(this);
    this.handleClickParse = this.handleClickParse.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleClickBulk = this.handleClickBulk.bind(this);
    this.fetchSingleEmail = this.fetchSingleEmail.bind(this);
    
    
    
    
    this.handleClickSmtpDefault = this.handleClickSmtpDefault.bind(this);
    this.handleChangeSmtpFrom = this.handleChangeSmtpFrom.bind(this);
    this.handleChangeSmtpEmail = this.handleChangeSmtpEmail.bind(this);
    this.handleChangeSmtpPass = this.handleChangeSmtpPass.bind(this);
    this.handleChangeSmtpReply = this.handleChangeSmtpReply.bind(this);
    this.handleChangeSmtpSubject = this.handleChangeSmtpSubject.bind(this);
    this.handleChangeSmtpBody = this.handleChangeSmtpBody.bind(this);
  }

  componentDidMount() {
    this.handleClickSmtpDefault();
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

  async fetchSingleEmail(email,index){
    try {
      const res = await fetch('http://dev.pro24web.site/', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify({ email, index })
      });
      const data = await res.json();
      
    } catch (error) {
      console.error(error);
    }
  }

  async handleClickBulk(){
    const emails = this.state.emails;
    for (let index = 0; index < emails.length; index++) {
      const emailData = emails[index];
      await this.fetchSingleEmail(emailData.email, index);
    }

    // emails.forEach( async (emailData, index) => {
    //   await this.fetchSingleEmail(emailData.email, index);
    // });
  }


  // SMTP Events
  handleClickSmtpDefault(){
    this.setState({
      smtp_from: 'Martin',
      smtp_email: 'vpntester@geroy.ooo',
      smtp_pass: 'vavt1234#',
      smtp_reply: 'martin@vpntester.net',
      smtp_subject: 'Your NordVPN account has been hacked',
    });
  }
  handleChangeSmtpFrom(event){
    this.setState({
      smtp_from: event.target.value
    });
  }
  handleChangeSmtpEmail(event){
    this.setState({
      smtp_email: event.target.value
    });
  }
  handleChangeSmtpPass(event){
    this.setState({
      smtp_pass: event.target.value
    });
  }
  handleChangeSmtpReply(event){
    this.setState({
      smtp_reply: event.target.value
    });
  }
  handleChangeSmtpSubject(event){
    this.setState({
      smtp_subject: event.target.value
    });
  }
  handleChangeSmtpBody(event){
    this.setState({
      smtp_body: event.target.value
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
  getEmailsObj(emails, status='Not Started'){
    let emailsObj = [];
    emails.forEach(function (item, index) {
      emailsObj.push({
        email: item,
        status: status
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
        <button type="button" className="btn btn-sm btn-secondary" onClick={() => this.fetchSingleEmail(email.email, index)}><i className="fas fa-redo"></i> Resend</button>
        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.handleClickRemove(index)}><i className="far fa-trash-alt"></i></button>
      </td>
    </tr>
    );
    return (
      <div className="App">
        <div className={styles.side}>
          <h4>SMTP Settings</h4>
          <div className="form-group">
            <small className="form-text text-muted">Name ( from )</small>
            <input type="text" className="form-control form-control-sm" value={this.state.smtp_from} onChange={this.handleChangeSmtpFrom} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Yandex smtp email</small>
            <input type="text" className="form-control form-control-sm" value={this.state.smtp_email} onChange={this.handleChangeSmtpEmail} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Yandex smtp pass</small>
            <input type="text" className="form-control form-control-sm" value={this.state.smtp_pass} onChange={this.handleChangeSmtpPass} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Reply to</small>
            <input type="text" className="form-control form-control-sm" value={this.state.smtp_reply} onChange={this.handleChangeSmtpReply} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Subject</small>
            <input type="text" className="form-control form-control-sm" value={this.state.smtp_subject} onChange={this.handleChangeSmtpSubject}/>
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Body</small>
            <textarea 
              className="form-control" 
              rows="5" 
              value={this.state.smtp_body} 
              onChange={this.handleChangeSmtpBody}
            >
            </textarea>
          </div>
          <button type="button" className="btn btn-warning btn-sm" onClick={this.handleClickSmtpDefault}><i className="fas fa-street-view"></i> Default</button>
        </div>
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
                
                <button type="button" className="btn btn-primary btn-sm" onClick={this.handleClickBulk}><i className="fas fa-mail-bulk"></i> Bulk Send</button>
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
