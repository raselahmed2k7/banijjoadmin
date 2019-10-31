import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import  { Redirect } from 'react-router-dom';


import {  Badge,Label,FormGroup, Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL; 

const Login = React.lazy(() => import('../Login'));

class Rogistar extends Component {
  constructor(props) {
    super(props);

    // this.print_bank_infos = [];

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      stateNext:'',
      userName: '',
      userPassword: '',
      vendorId: '',
      user_type: '',
      inputValue: '',

      bank: '',
      shopFound:'',
      productsCategory: [],
      productsChildCategory: [],
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleBackButton () {
    console.log(this.state.stateNext);

    if (this.state.stateNext == 'two') {
      this.setState({stateNext: ''});
    }
    else {
      this.setState({stateNext: 'two'});
    }
  }

  handleClick(){
    
    console.log('Presonal Details : ', this.state);

    fetch(base+'/api/vendor-details-personal' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(this.state)
      // body: this.state
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Personal Information Succesfully inserted !!");
        console.log('Success : ', info.message);
        
        setTimeout(
          function() {
            this.setState({stateNext: 'two'});
          }
          .bind(this),
          2000
        );
      }
      else {
        ToastsStore.warning("Personal Information Insertion Faild. Please try again !!");
        console.log('Error : ', info.success);
      }
      
    })

  }

  handleClickTwo(){
    console.log('Second Step : ', this.state);

    // this.setState({stateNext: 'three'});

    fetch(base+'/api/vendor-details-shop' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(this.state)
      // body: this.state
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Shop Information Succesfully inserted !!");
        console.log('Success : ', info.success);
        
        setTimeout(
          function() {
            this.setState({stateNext: 'three'});
          }
          .bind(this),
          2000
        );
      }
      else {
        ToastsStore.warning("Shop Information Insertion Faild. Please try again !!");
        console.log('Error : ', info.success);
      }
      
    })

    // fetch('/api/updateShop', {
    //   method: 'GET'
    // })
    // .then(res => {
    //   console.log(res);
    //   return res.json()
    // })
    // .then(data => {
    //   console.log(data.message); 
    //   localStorage.setItem('user_status', 'approved');
    //   this.props.history.push("/dashboard");
    // });
    
  }

  handleClickThree () {
    console.log('Third Step : ', this.state);
    
    fetch(base+'/api/vendor-details-business' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
      // body: this.state
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Business Information Succesfully inserted !!");
        console.log('Success : ', info.success);
        localStorage.setItem('user_status', 'approved');
        setTimeout(
          function() {
            this.props.history.push("/");
          }
          .bind(this),
          3000
        );
      }
      else {
        ToastsStore.warning("Business Information Insertion Faild. Please try again !!");
        console.log('Error : ', info.success);
      }
      
    })
  }

  handleChildCategory = (event) => {
    console.log('parent value : ', event.target.value);

    fetch(base+`/api/child-category/?id=${event.target.value}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(category => {
      console.log(category.data); 

      this.setState({ 
        productsChildCategory : category.data
      })
      
      return false;
    });

  }

  componentDidMount () {
    this.state.userName = localStorage.getItem('userName');
    this.state.userPassword = localStorage.getItem('userPassword');
    this.state.vendorId = localStorage.getItem('employee_id');
    this.state.user_type = localStorage.getItem('user_type');

    fetch(base+'/api/parent-category', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(category => {
      console.log(category.data); 

      this.setState({ 
        productsCategory : category.data
      })
      
      return false;
    });

    // if(userName=== null && userPassword === null)
    // {
    //   this.props.history.push("/login");
    // }
    // else {
    //   this.props.history.push("/dashboard");
    // }

    console.log('User Name : ', this.state.userName);
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
    
  }

  changeTransactionSystem = (event) => {
    console.log('changeTransactionSystem : ', event.target.value);

    if (event.target.value == 'Cash') {
      this.state.bank = 'false';
    }
    else if (event.target.value == 'Bank') {
      this.state.bank = 'true';
    }
    else {
      console.log('Please Select at least one element!')
    }

    console.log(this.state.print_bank_infos_name);
  }

  

  handleSubmit (event) {
    event.preventDefault();
    
    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);

    fetch(base+'/api/vendor-registration' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
      // body: this.state
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("User  Successfully Registered !!");
        console.log('Success : ', info.success);
        
        setTimeout(
          function() {
            this.props.history.push("/");
          }
          .bind(this),
          3000
        );
      }
      else {
        ToastsStore.warning("User Registration Faild. Please try again !!");
        console.log(info.success);
      }
      
    })
  }

  handleShopName(event){
    this.setState({
      inputValue: event.target.value
    },()=>{
      fetch(base+'/api/checkShopExist', {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
      .then((result) => result.json())
    .then((info) => { 
      if(info.message){
        this.setState({shopFound:'yes'});
      }
      else{
        this.setState({shopFound:'no'});
      }
    })
    });
  }

  render() {
    const currentState = this.state.stateNext;

    if (currentState=='two') {
      return (
        <div id="nextShop" className="app align-items-center">
          <Container>
            <Row className="justify-content-center">
            <ToastsContainer store={ToastsStore}/>
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
                      <h1>Shop Preferences</h1>
                      
                      <p className="text-muted">Lets get started, Tell us about your Shop</p>
                      
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="shopName"> Shop Name </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input onChange={this.handleShopName.bind(this)} className={this.state.shopFound=="yes"? "is-valid form-control":this.state.shopFound=="no"? "is-invalid form-control":''} value={this.state.inputValue} placeholder="Shop Name" type="text" name="shopName" id="shopNameId">
                         
                          </Input>
                          <React.Fragment>
                              {
                                  this.state.shopFound=="yes" ?
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="valid-feedback">Shop Name Available</div>
                                  : this.state.shopFound=="no" ? 
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="invalid-feedback">Shop Name Unvailable</div>
                                  :''
                                }              
                        </React.Fragment>
                        </Col>
                      </FormGroup>


                      {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>

                    
                      <Input type="text" className={this.state.shopFound=="yes"? "is-valid form-control":this.state.shopFound=="no"? "is-invalid form-control":''} value={this.state.inputValue} name="userName" onChange={this.handleUsernameChange.bind(this)} required="true" placeholder="User Name" autoComplete="username" />
                        <React.Fragment>
                              {
                                  this.state.shopFound=="yes" ?
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="valid-feedback">Username Available</div>
                                  : this.state.shopFound=="no" ? 
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="invalid-feedback">Username Unvailable</div>
                                  :''
                                }              
                        </React.Fragment>
                    </InputGroup> */}


                  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="shopLanguage">Shop Language </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="shopLanguageName" id="shopLanguageId"  value={this.state.shopLanguageName}>
                          <option value="">Select</option>
                          <option value="ENG">English</option>
                          <option value="BAN">Bangla</option>
                          </Input>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="shopCountry">Shop Country </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="shopCountryName" id="shopCountryId"  value={this.state.shopCountryName}>
                          <option value="">Select</option>
                          <option value="BAN">Bangladesh</option>
                          <option value="IND">India</option>
                          </Input>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="shopCurrency">Shop Currency </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="shopCurrencyName" id="shopCurrencyId"  value={this.state.shopCurrencyName}>
                          <option value="">Select</option>
                          <option value="dollar">Dollar</option>
                          <option value="bdt">BDT</option>
                          </Input>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label>Which of these best describes you?</Label>
                        </Col>
                        <Col md="8">
                          <FormGroup check className="radio">
                            <Input className="form-check-input" type="radio" id="radio1" name="your_description" value="option1" />
                            <Label check className="form-check-label" htmlFor="radio1">Selling is my full time job</Label>
                          </FormGroup>
                          <FormGroup check className="radio">
                            <Input className="form-check-input" type="radio" id="radio2" name="your_description" value="option2" />
                            <Label check className="form-check-label" htmlFor="radio2">I spell parttime</Label>
                          </FormGroup>
                          <FormGroup check className="radio">
                            <Input className="form-check-input" type="radio" id="radio3" name="your_description" value="option3" />
                            <Label check className="form-check-label" htmlFor="radio3">Other</Label>
                          </FormGroup>
                        </Col>
                      </FormGroup>
                      
                      <Button type="button" onClick={this.handleClickTwo.bind(this)}  color="success" block>Save and Continue</Button>
                      <Button type="button" onClick={this.handleBackButton.bind(this)}  color="warning" block>Back</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    else if (currentState == 'three') {
      return (
        <div id="nextShop" className="app align-items-center">
          <Container>
            <Row className="justify-content-center">
            <ToastsContainer store={ToastsStore}/>
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
                      <h1>Business Preferences</h1>

                      <p className="text-muted">Lets get started, Tell us about your business</p>
  
                  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="tradeLicence"> Trade Licence </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="text" placeholder="Trade Liscense" name="tradeLicenceName" id="tradeLicenceId">
                         
                          </Input>
                        </Col>
                      </FormGroup>

                      {/* <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="businessStartDate">Business Start Date </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="text" name="businessStartDateName" id="businessStartDateId"  value={this.state.businessStartDateName}>
                         
                          </Input>
                        </Col>
                      </FormGroup> */}

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="businessStartDate">Date of Birth</Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="date" name="businessStartDateName" id="businessStartDateId" placeholder="date"  value={this.state.dateOfBirthName}/>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="tin">TIN </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="TIN Number " type="text" name="tinName" id="tinId"  value={this.state.tinName}>
                         
                          </Input>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="businessAddress">Business Address </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="Business Address  " type="textarea" name="businessAddressName" id="businessAddressId" required="true"  value={this.state.businessAddressName}>
                         
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="webAddress">Web Address </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="Web Address" type="text" name="webAddressName" id="webAddressId" required="true"  value={this.state.webAddressName}>
                         
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="transactionInformation">Transaction Information </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="transactionInformationName" id="transactionInformationId" required="true" onChange={this.changeTransactionSystem} value={this.state.transactionInformationName}>
                          <option value="">Select</option>
                          <option value="Cash">Cash</option>
                          <option value="Bank">Bank</option>
                          </Input>
                        </Col>
                      </FormGroup>

                      {/* If Bank then need add another option which is call bank details */}

                      {
                        this.state.bank == 'true'?
                          <React.Fragment>
                            <FormGroup row>
                              <Col md="4">
                                <Label>Bank Name</Label>
                              </Col>
                              <Col xs="12" md="8">
                                <Input placeholder="Bank Name" type="text" name="bankName" id="bankNameId" required="true"  value={this.state.bankName}>
                                
                                </Input>
                              </Col>                            </FormGroup>
                            
                            <FormGroup row>
                              <Col md="4">
                                <Label>Account Name</Label>
                              </Col>
                              <Col xs="12" md="8">
                                <Input placeholder="Account Name" type="text" name="accountName" id="accountNameId" required="true"  value={this.state.accountName}>
                                
                                </Input>
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="4">
                                <Label> Account No </Label>
                              </Col>
                              <Col xs="12" md="8">
                                <Input placeholder="Account No" type="text" name="accountNo" id="accountNoId" required="true"  value={this.state.accountNo}>
                                
                                </Input>
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="4">
                                <Label>Branch</Label>
                              </Col>
                              <Col xs="12" md="8">
                                <Input placeholder="Branch" type="text" name="branch" id="branchId" required="true"  value={this.state.branch}>
                                
                                </Input>
                              </Col>
                            </FormGroup>

                            <FormGroup row>
                              <Col md="4">
                                <Label>Routing No</Label>
                              </Col>
                              <Col xs="12" md="8">
                              <Input placeholder="Routing No" type="text" name="routingNo" id="routingNoId" required="true"  value={this.state.routingNo}>
                              
                              </Input>
                              </Col>
                            </FormGroup>
                          </React.Fragment>
                        :
                        null
                      }
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="vendorCategory">Vendor Category </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="vendorCategoryName" id="vendorCategoryId" required="true"  value={this.state.vendorCategoryName}>
                          <option value="Standard">Standard</option>
                          <option value="Gold">Gold</option>
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="productCategory">Product Category </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="select" name="productCategoryName" id="productCategoryId" required="true" onChange={this.handleChildCategory} value={this.state.productCategoryName}>
                            <option value="0">Please select</option>
                            {
                              this.state.productsCategory.map((productsCategoryValue, key) =>
                                <option value={productsCategoryValue.id} > {productsCategoryValue.category_name} </option>
                              ) 
                            }
                          </Input>
                        </Col>
                      </FormGroup>

                      {
                        this.state.productsChildCategory.length > 0 ?
                          <FormGroup row>
                            <Col md="4">
                              <Label htmlFor="productCategory">Child Product Category </Label>
                            </Col>
                            <Col xs="12" md="8">
                              <Input type="select" name="productCategoryChildName" id="productCategoryChildId" required="true"  value={this.state.productCategoryChildName}>
                                <option value="0">Please select</option>
                                {
                                  this.state.productsChildCategory.map((productsCategoryValue, key) =>
                                    <option value={productsCategoryValue.id} > {productsCategoryValue.category_name} </option>
                                  ) 
                                }
                              </Input>
                            </Col>
                          </FormGroup> :
                        null
                      }

                      <FormGroup row>
                        
                        <Col md="6">
                          <Label htmlFor="TermsAndCondition"> Terms and Conditions </Label>
                        </Col>

                        <Col md="3">
                          <Label htmlFor="productCategory"> <Input className="form-check-input" required="true" type="checkbox" id="TermsAndConditionId" name="TermsAndConditionName" value="Yes" /> I agree </Label>
                        </Col>

                        <Col md="3">
                          &nbsp; <a href="#">see more</a>
                        </Col>
                      </FormGroup>
                      
                      <Button type="button" onClick={this.handleClickThree.bind(this)}  color="success" block>Save and Continue</Button>
                      <Button type="button" onClick={this.handleBackButton.bind(this)}  color="warning" block>Back</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    else{
      return (
        <div id="nextShop" className="app align-items-center">
          <Container>
            <Row className="justify-content-center">
            <ToastsContainer store={ToastsStore}/>
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
                      <h1>Presonal Preferences</h1>

                      <p className="text-muted">Lets get started, Tell us about you</p>
  
                  
                      {/* <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="name"> Name </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="Full Name" type="text" name="fullName" id="fullNameId"  value={this.state.fullName}>
                         
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="email">Email </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="text" name="businessEmail" id="businessEmailId"  value={this.state.businessEmail}>
                         
                          </Input>
                        </Col>
                      </FormGroup> */}
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="mobile">Mobile </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="Mobile Number" type="text" name="mobileNumber" id="mobileNumberId"  value={this.state.mobileNumber}>
                         
                          </Input>
                        </Col>
                      </FormGroup>
  
                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="nationalId">National ID </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="National ID" type="text" name="nationalIdName" id="nationalIdsId"  value={this.state.nationalIdName}>
                         
                          </Input>
                        </Col>
                      </FormGroup>
  
                      {/* <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="dateOfBirth">Date of Birth </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input type="text" name="dateOfBirthName" id="dateOfBirthId"  value={this.state.dateOfBirthName}>
                         
                          </Input>
                        </Col>
                      </FormGroup> */}

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input  type="date" name="dateOfBirthName" id="dateOfBirthId" placeholder="date"  value={this.state.dateOfBirthName}/>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="4">
                          <Label htmlFor="address">Present Address </Label>
                        </Col>
                        <Col xs="12" md="8">
                          <Input placeholder="Present Address" type="textarea" name="presentAddress" id="presentAdressId"  value={this.state.presentAddress}>
                         
                          </Input>
                        </Col>
                      </FormGroup>
                      
                      <Button type="button" onClick={this.handleClick.bind(this)}  color="success" block>Save and Continue</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    
  }
}

export default Rogistar;
