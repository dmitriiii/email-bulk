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
    this.handleClickParse = this.handleClickParse.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleClickBulk = this.handleClickBulk.bind(this);
    this.fetchSingleEmail = this.fetchSingleEmail.bind(this);
    
    
    this.handleClickSmtpDefault = this.handleClickSmtpDefault.bind(this);
    this.handleChangeFields = this.handleChangeFields.bind(this);
  }

  componentDidMount() {
    this.handleClickSmtpDefault();
  }
  
  handleClickParse(){
    let extractedEmails = this.extractEmails(this.state.areaValue);
    // console.log(extractedEmails);
    
    if(extractedEmails == null){
      this.setState({
        emails: '',
        areaValue: ''
      });  
      alert('no emails!');
      return false;
    }
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

  //Remove 1 email
  handleClickRemove(index) {
    const oldEmails = this.state.emails;
    const email = oldEmails[index].email;
    oldEmails.splice(index,1);
    const areaValue = this.state.areaValue.replace(email, '');

    let extractedEmails = this.extractEmails(areaValue);
    extractedEmails = this.removeDuplicates(extractedEmails);

    this.setState({
      emails: oldEmails,
      areaValue: extractedEmails.join(" | ")
    });
  }

  // Send Request single
  async fetchSingleEmail(email,index){
    const url = 'http://dev.pro24web.site/bulk_email/email.php';
    const smtp = {
      smtp_body: this.state.smtp_body,
      smtp_email: this.state.smtp_email,
      smtp_from: this.state.smtp_from,
      smtp_pass: this.state.smtp_pass,
      smtp_reply: this.state.smtp_reply,
      smtp_subject: this.state.smtp_subject
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ email, index, smtp })
      });
      const data = await res.json();
      
      //Successfully sent
      // if( data.type==='success' ){
        let emails = this.state.emails;
        // console.log(emails);
        emails[data.emails_index].status = data.emails_status;
        emails[data.emails_index].classcss = data.emails_classcss;
        emails[data.emails_index].msg = data.msg;
        
        this.setState({
          emails: emails
        });
      // }

    } catch (error) {
      console.error(error);
    }
  }

  //Sending massive emails
  async handleClickBulk(){
    const emails = this.state.emails;
    for (let index = 0; index < emails.length; index++) {
      const emailData = emails[index];
      await this.fetchSingleEmail(emailData.email, index);
    }
  }

  // Set default SMTP data
  handleClickSmtpDefault(){
    this.setState({
      smtp_from: 'Martin',
      smtp_email: 'vpntester@geroy.ooo',
      smtp_pass: 'vavt1234#',
      smtp_reply: 'martin@vpntester.net',
      smtp_subject: 'Your NordVPN account has been hacked',
    });
  }

  // Universal changing input/textarea and update states
  handleChangeFields(event){
    const name = event.target.name;
    const value = event.target.value;
    const obj = {};
    obj[name] = value;    
    this.setState(obj);
  }
 
  // Retrieve emails from inserted text
  extractEmails(text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  }

  //Remove duplicate emails from inserted text
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
        status: status,
        classcss: ''
      })
    });
    return emailsObj;
  }

  
  
  render() {
    const areaValue = this.state.areaValue;
    const emails = this.state.emails;
    let rows;
    if( Array.isArray(emails) && emails.length ){
      rows = emails.map((email,index) =>
        <tr key={index} className={ email.classcss }>
          <th scope="row">{index+1}</th>
          <td>{email.email}</td>
          <td>{email.status}</td>
          <td>{email.msg}</td>
          <td>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => this.fetchSingleEmail(email.email, index)}><i className="fas fa-redo"></i> Send</button>
            <button type="button" className="btn btn-sm btn-danger" onClick={() => this.handleClickRemove(index)}><i className="far fa-trash-alt"></i></button>
          </td>
        </tr>
      );
    }
    
    return (
      <div className="App">
        <div className={styles.side}>
          <h4>SMTP Settings</h4>
          <div className="form-group">
            <small className="form-text text-muted">Name ( from )</small>
            <input type="text" name="smtp_from" className="form-control form-control-sm" value={this.state.smtp_from} onChange={this.handleChangeFields} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Yandex smtp email</small>
            <input type="text" name="smtp_email" className="form-control form-control-sm" value={this.state.smtp_email} onChange={this.handleChangeFields} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Yandex smtp pass</small>
            <input type="text" name="smtp_pass" className="form-control form-control-sm" value={this.state.smtp_pass} onChange={this.handleChangeFields} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Reply to</small>
            <input type="text" name="smtp_reply" className="form-control form-control-sm" value={this.state.smtp_reply} onChange={this.handleChangeFields} />
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Subject</small>
            <input type="text" name="smtp_subject" className="form-control form-control-sm" value={this.state.smtp_subject} onChange={this.handleChangeFields}/>
          </div>

          <div className="form-group">
            <small className="form-text text-muted">Body</small>
            <textarea 
              className="form-control" 
              rows="5" 
              name="smtp_body"
              value={this.state.smtp_body} 
              onChange={this.handleChangeFields}
            >
            </textarea>
          </div>
          <button type="button" className="btn btn-warning btn-sm" onClick={this.handleClickSmtpDefault}><i className="fas fa-street-view"></i> Default</button>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3>Bulk Sending emails</h3>
              
              <div className="form-group">
                <textarea 
                  className="form-control mb-2" 
                  rows="5"
                  value={areaValue} 
                  name='areaValue'
                  onChange={this.handleChangeFields}
                  placeholder="Paste emails here">
                </textarea>
                { areaValue.length === 0  
                  ?<React.Fragment></React.Fragment>
                  :<React.Fragment>
                    <button type="button" className="btn btn-info btn-sm" onClick={this.handleClickParse}><i className="fas fa-hat-wizard"></i> Parse</button>
                    <button type="button" className="btn btn-sm btn-light" onClick={this.handleClickClear}><i className="fas fa-broom"></i> Clear All</button>
                  </React.Fragment>
                }
                { emails.length === 0  
                  ?<React.Fragment></React.Fragment>
                  :<React.Fragment>
                    <button type="button" className="btn btn-primary btn-sm" onClick={this.handleClickBulk}><i className="fas fa-mail-bulk"></i> Bulk Send</button>
                  </React.Fragment>
                }
              </div>
              <h5 className={styles.results}>
                <span>Results</span>  
                <span>Total: {this.state.emails.length}</span>
              </h5>   
              <table className="table table-sm table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col" className={styles.firstCol}>#</th>
                    <th scope="col" className={styles.secondCol}>To Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Message</th>
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
