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
      amountPerDay: '',

      smtp_from: '',
      smtp_email: '',
      smtp_pass: '',
      smtp_reply: '',
      smtp_subject: '',
    };
    this.handleClickParse = this.handleClickParse.bind(this);
    this.handleClickEmPass = this.handleClickEmPass.bind(this);

    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
    this.handleClickBulk = this.handleClickBulk.bind(this);
    // this.handleClickAddDB = this.handleClickAddDB.bind(this);
    
    this.fetchSingleEmail = this.fetchSingleEmail.bind(this);
    
    
    this.handleClickSmtpDefault = this.handleClickSmtpDefault.bind(this);
    this.handleChangeFields = this.handleChangeFields.bind(this);
  } 

  componentDidMount() {
    this.handleClickSmtpDefault();
  }
  
  //Text to emails & passwords
  rawToData(txt) {
    let rez = [];
    let txt_n = txt.split('\n');
    txt_n.forEach(el1 => {
      let txt_space = el1.split(' ');
      txt_space.forEach(el2 => {
        if(this.checkIfEmailInString(el2)){
          el2 = el2.replace('|','');
          let txt_tchk = el2.split(':');
          rez.push({
            email: txt_tchk[0],
            pass: txt_tchk[1],
            status: 'Not Started',
            classcss: ''
          });
        }
      });
    });
    return rez;
  }

  checkIfEmailInString(text) { 
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  }

  // Retrieve emails only from inserted text
  extractEmails(text){
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  }

  //Parse emails only
  handleClickParse(){
    let extractedEmails = this.extractEmails(this.state.areaValue);
    let emailsObj = [];
    if(extractedEmails == null){
      this.setState({
        emails: '',
        areaValue: ''
      });  
      alert('no emails!');
      return false;
    }
    extractedEmails.forEach(function (item, index) {
      emailsObj.push({
        email: item,
        status: 'Not Started',
        classcss: ''
      })
    });
    this.setState({
      emails: emailsObj,
    });
  }

  //Parse emails & passwords
  handleClickEmPass(){
    const areaValue = this.state.areaValue;
    const emailsData = this.rawToData(areaValue);
    if(emailsData.length === 0){
      this.setState({
        emails: '',
        areaValue: ''
      });  
      alert('no emails!');
      return false;
    }
    this.setState({
      emails: emailsData
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
    // const email = oldEmails[index].email;
    oldEmails.splice(index,1);
    this.setState({
      emails: oldEmails,
    });
  }

  //Sending massive emails
  async handleClickBulk( toDB ){
    const emails = this.state.emails;
    for (let index = 0; index < emails.length; index++) {
      const emailData = emails[index];
      await this.fetchSingleEmail(emailData.email, index, emailData.pass, toDB);
    }
    alert('Procedure finished!');
  }

  // Send Request single
  async fetchSingleEmail(email,index,pass='', toDB){
    // console.log(toDB);
    // return false;

    let url = 'http://dev.pro24web.site/bulk_email/email.php';
    const smtp = {
      // smtp_body: this.state.smtp_body,
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
        body: JSON.stringify({ email, index, pass, smtp, toDB })
      });
      const data = await res.json();
      
      //Response from server
        let emails = this.state.emails;
        emails[data.emails_index].status = data.emails_status;
        emails[data.emails_index].classcss = data.emails_classcss;
        emails[data.emails_index].msg = data.msg;
        
        this.setState({
          emails: emails,
          amountPerDay: data.amountPerDay
        });

    } catch (error) {
      console.error(error);
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
 
  
  
  
  render() {
    const areaValue = this.state.areaValue;
    const emails = this.state.emails;
    let rows;
    if( Array.isArray(emails) && emails.length ){
      rows = emails.map((email,index) =>
        <tr key={index} className={ email.classcss }>
          <th scope="row">{index+1}</th>
          <td>{email.email}</td>
          <td>{email.pass}</td>
          <td>{email.status}</td>
          <td>{email.msg}</td>
          <td>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => this.fetchSingleEmail(email.email, index, email.pass)}><i className="fas fa-envelope-open-text"></i> Send</button>
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

          <button type="button" className="btn btn-warning btn-sm" onClick={this.handleClickSmtpDefault}><i className="fas fa-street-view"></i> Default</button>
        </div>
        <div className={styles.amountPerDay}>
          <b>Sent today</b> <br/>
          {this.state.amountPerDay}
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
                    <button type="button" className="btn btn-info btn-sm" onClick={this.handleClickParse}><i className="fas fa-hat-wizard"></i> Emails only</button>
                    <button type="button" className="btn btn-info btn-sm" onClick={this.handleClickEmPass}><i className="fas fa-hat-wizard"></i> Emails & Pass</button>
                    <button type="button" className="btn btn-sm btn-light" onClick={this.handleClickClear}><i className="fas fa-broom"></i> Clear All</button>
                  </React.Fragment>
                }
                { emails.length === 0  
                  ?<React.Fragment></React.Fragment>
                  :<React.Fragment>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => this.handleClickBulk(0)}><i className="fas fa-mail-bulk"></i> Bulk Send</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => this.handleClickBulk(1)}><i className="fas fa-database"></i> Bulk Add to DB</button>

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
                    <th scope="col">Password</th>
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
