import React, { Component } from 'react';
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
class Categories extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      productsCategory: [],
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    this.handleGet = this.handleGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
  }

  componentDidMount() {
    console.log('component mount executed');

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    fetch('/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data); 
      this.setState({ 
        productsCategory : users.data
      })
      return false;
    });
  }

  handleGet(event) {
    fetch('/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => { 
      console.log(users.data); 
      this.setState({ users })
      return false;
    });
    // .then(console.log(response));
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.categoryName);

    console.log(this.state);

    const { categoryName, parentCategory, categoryDescription, isActive } = this.state;

    fetch('/api/saveCategory' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => { console.log(info); })
  }

  handleChange(event) {
    // this.setState({value: event.target.value});
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // alert(value)
    // alert(name)

    this.setState({
      [name]: value
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }
  render() {

    return (
      <Row>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add New Category</strong> 
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Category Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="categoryName" name="categoryName" value={this.state.value} required="true" placeholder="Text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="parentCategory">Parent Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="parentCategory" id="parentCategory" value={this.state.value} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    {
                      this.state.productsCategory.map((productsCategoryValue, key) =>
                        // productsCategory.parent_category_id == productsCategoryValue.id ? productsCategoryValue.category_name : null
                        <option value={productsCategoryValue.id}> {productsCategoryValue.category_name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryDescription">Category Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="categoryDescription" name="categoryDescription" value={this.state.value} required="true" placeholder="Text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="isActive">Status</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="isActive" id="isActive" value={this.state.value} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                  </Input>
                </Col>
              </FormGroup>

              <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
              
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>
          <CardFooter>
          {/* <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
            <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp;
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify"></i> Category List
                  </Col>
                  <Col md="6">
                    <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp;
                  </Col>
                </Row>
              </CardHeader>
              
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Parent Category</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>

                    { 
                      this.state.productsCategory.map((productsCategory, key) =>
                        <tr>
                          <td>{productsCategory.category_name}</td>
                          <td>
                          {
                            this.state.productsCategory.map((productsCategoryValue, key) =>
                              productsCategory.parent_category_id == productsCategoryValue.id ? productsCategoryValue.category_name : null
                            )
                          }
                          </td>
                          <td>{productsCategory.description}</td>
                          <td>{productsCategory.status}</td>
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



export default Categories;
