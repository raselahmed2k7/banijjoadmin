import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import  { Redirect } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

const Login = React.lazy(() => import('../Login'));

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    // if(userName=== null && userPassword === null)
    // {
    //   this.props.history.push("/login");
    // }
    // else {
    //   this.props.history.push("/dashboard");
    // }
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

  handleSubmit (event) {
    event.preventDefault();
    
    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);

    fetch('/api/vendor-registration' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
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

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
          <ToastsContainer store={ToastsStore}/>
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="name" required="true" placeholder="Name" autoComplete="name" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="userName" required="true" placeholder="User Name" autoComplete="username" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="userEmail" required="true" placeholder="Email" autoComplete="email" />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="userPassword" required="true" placeholder="Password" autoComplete="new-password" />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="userRePassword" required="true" placeholder="Repeat password" autoComplete="new-password" />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="textarea" name="userAddress" required="true" placeholder="Address" autoComplete="userAddress" />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="userWebsite" required="true" placeholder="Website" autoComplete="userWebsite" />
                    </InputGroup>

                    <Button type="submit" color="success" block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
