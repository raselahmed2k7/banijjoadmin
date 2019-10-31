import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Pagination, PaginationItem, PaginationLink, Table,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL; 
const publicUrl = process.env.REACT_APP_PUBLIC_URL; 

class TermsAndCondition extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isUpdateClicked: 0,
      termsAndCondition: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.reSet = this.reSet.bind(this);
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  componentDidMount () {
    fetch(base+'/api/getTermsAndCondition', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(termsAndCondition => {
      console.log(termsAndCondition.data); 
      this.setState({ 
        termsAndCondition : termsAndCondition.data
      })

      // console.log('Terms & Condition Data : ', this.state.termsAndCondition[0].terms_and_conditions);
      return false;
    });
  }

  handleSubmit (event) {
    event.preventDefault();
    console.log(this.state);

    fetch(base+'/api/saveTermsAndCondition' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => { 
      console.log('the result is : ',info.result);

      if (info.success == true) {
        ToastsStore.success("Data Inserted Successfully !!");

        this.setState({ 
          termsAndCondition : info.data,
          termsCondition: '',
          isUpdateClicked: 0
        })

        console.log(info.success);

      }
      else {
        ToastsStore.warning("Data Did Not Inserted !!");
        console.log(info.success);

      }
      
    })

  }

  handleChange (event) {
    let target = event.target;

    let value = target.value;
    let name = target.name;

    this.setState ({
      [name]: value
    });

  }

  updateClicked (event) {
    this.setState({
      isUpdateClicked: 1
    });

    console.log(this.state.isUpdateClicked);

    fetch(base+'/api/getTermsAndCondition', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(termsAndCondition => {
      console.log(termsAndCondition.data); 
      this.setState({ 
        termsCondition : termsAndCondition.data[0].terms_and_conditions,
      })

      console.log('Terms & Condition Data : ', this.state.termsCondition);
      return false;
    });
  }

  reSet (event) {
    this.setState({ 
      termsCondition : '',
      isUpdateClicked: 0
    })
  }

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
        <Col xs="12" md="6">
        <Card>
            <CardHeader>
              <strong>
              Terms & Condition
              </strong>
            </CardHeader>
            <CardBody>
              <Form refs action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
                
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="name">Terms & Condition</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="textarea" id="termsCondition" name="termsCondition" value={this.state.termsCondition} onChange={this.handleChange.bind(this)} placeholder="Terms & Condition" required />
                  </Col>
                </FormGroup>

                {
                  this.state.isUpdateClicked == 1 ?
                  <Button type="submit" size="sm" color="primary" ><i className="fa fa-dot-circle-o"></i> update </Button>
                  :
                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit </Button>
                }&nbsp;
                <Button type="reset" size="sm" color="primary" onClick={this.reSet}><i className="fa fa-dot-circle-o"></i> Reset </Button>

              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" md="6">
          <Card>
            <CardHeader>
              
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                <tr>
                  <th>Terms & Condition</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>
                  {
                    this.state.termsAndCondition.length > 0 ?
                    this.state.termsAndCondition[0].terms_and_conditions
                    :null
                  }
                  </td>
                  <td>
                  <a href="#" ref="updateId" onClick={this.updateClicked.bind(this)}>
                    <i className="fa fa-edit fa-lg"  title="Edit users Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                  </a>
                  </td>
                </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
    </Row>
    
    )
  }
}



export default TermsAndCondition;
