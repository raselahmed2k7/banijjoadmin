import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';

// import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
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

class Vendor extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      vendorList: [],
      pictures: [],
      submittedValue: [],
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  componentDidMount() {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    fetch('/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(vendors => {
      console.log(vendors.data); 
      this.setState({ 
        vendorList : vendors.data
      })

      console.log('Vendor Data : ', this.state.vendorList);
      return false;
    });
  }

  // handleProductChange(event) {
  //   console.log('Picture : ', event);

  //   if (!(event instanceof Event)) {
  //     console.log('synthetic');

  //     this.setState({
  //       ['image']: this.state.pictures.concat(event),
  //     }); 
  //   }
  //   else {
  //     let target = event.target;
  //     let value = target.type === 'checkbox' ? target.checked : target.value;
  //     let name = target.name;

  //     this.setState({
  //       [name]: value
  //     });

  //     console.log('non synthetic');
  //   }

  // }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    console.log('Picture : ', event);

    let target = event.target;
    // let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    // this.setState({
    //   [name]: value
    // });

    if (name == 'image') {
      let value = target.files[0];

      this.setState({
        [name]: value
      });
    }
    else {
      let value = target.type === 'checkbox' ? target.checked : target.value;

      this.setState({
        [name]: value
      });
    }

    console.log(target.name);
    // console.log(target.files[0]);

    
  }

  onDrop(picture) {
    console.log('Calling handler !', picture);
    this.handleProductChange(picture);
    console.log('Calling handler !', picture);

    // this.setState({
    //     pictures: this.state.pictures.concat(picture),
    // }); 

    // console.log('Pictures : ', this.state.pictures);

  }

  handleSubmit (event) {
    event.preventDefault();
    
    console.log('submitted value : ', JSON.stringify(this.state));
    console.log('submitted Image : ', this.state.image);
    console.log('submitted Image value : ', this.state);

    // this.setState({
    //   pictures: this.state.pictures.concat(this.state.image),
    // });

    // console.log('submitted Picture value : ', this.state.pictures);

    // fetch('/api/saveVendor' , {
    //   method: "POST",
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    // })
    // .then((result) => result.json())
    // .then((info) => { 
    //   if (info.success == true) {
    //     ToastsStore.success("Vendor Successfully inserted !!");
    //     console.log(info.success);
    //   }
    //   else {
    //     ToastsStore.warning("Vendor Insertion Faild. Please try again !!");
    //     console.log(info.success);
    //   }
      
    // })

    let formData = new FormData();

    formData.append('image', this.state.image);
    formData.append('name', this.state.name);

    // console.log('form data : ', formData);

    // for (var key of formData.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }
    
    axios.post('/api/saveVendor', formData)
    .then(res => {console.log(res)});
  }

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Vendor</strong> 
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name">Vendor Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email">Vendor Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="email" name="email" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="phoneNumber">Vendor Phone Number</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="phoneNumber" name="phoneNumber" placeholder="Vendor Phone Number" />
                </Col>
              </FormGroup>
              
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="website">Vendor Website</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="website" name="website" placeholder="Vendor Website" />
                </Col>
              </FormGroup>
              
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="address">Address</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="textarea" name="address" id="address" rows="9"
                             placeholder="Address..." />
                    </Col>
              </FormGroup>

              {/* <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="file" id="image" name="image" />
                    </Col>
              </FormGroup> */}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="file" id="image" name="image" />
                      {/* <ImageUploader
                        id="iamge"
                        name="image"
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop.bind(this)}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        withPreview = {true}
                      /> */}
                    </Col>
              </FormGroup>
              <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>
          <CardFooter>
            
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Vendor List
              </CardHeader>
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Email</th>
                    <th>Website</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.vendorList.map((vendorListValue, key) =>
                    <tr>
                      <td>{vendorListValue.name}</td>
                      <td>{vendorListValue.email}</td>
                      <td>{vendorListValue.website}</td>
                      <td>{vendorListValue.address}</td>
                      <td>
                        {vendorListValue.status == 'active' ? <Badge color="success">Active</Badge> : <Badge color="secondary">Inactive</Badge> }
                      </td>
                    </tr>
                    )
                  }
                  </tbody>
                </Table>
                <Pagination>
                  <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>

      
    </Row>
    
    )
  }
}



export default Vendor;
