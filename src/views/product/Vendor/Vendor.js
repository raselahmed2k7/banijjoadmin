import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
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

  onDrop(picture) {
    
    this.setState({
        pictures: this.state.pictures.concat(picture),
    });

  }

  handleSubmit (event) {
    event.preventDefault();
    console.log('submitted value : ', this.state);
    console.log('submitted Image : ', this.state.image);
    console.log('submitted Image value : ', this.state.pictures[0].path);

    // this.setState({
    //   pictures: this.state.pictures.concat(this.state.image),
    // });

    console.log('submitted Picture value : ', this.state.pictures);

    fetch('/api/saveVendor' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Vendor Successfully inserted !!");
        console.log(info.success);
        setTimeout(
          function() {
          // this.props.history.push("/product/vendor");
          window.location = '/product/vendor';
          }
          .bind(this),
          3000
        );
      }
      else {
        ToastsStore.warning("Product Insertion Faild. Please try again !!");
        console.log(info.success);
      }
      
    })
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
                      {/* <Input type="file" id="image" name="image" /> */}
                      <ImageUploader
                        id="iamge"
                        name="image"
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        withPreview = {true}
                      />
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
