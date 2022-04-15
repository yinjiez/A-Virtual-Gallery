import React from 'react';
import {FormInput, FormGroup, Button, Badge, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Row,
    Col,
    Divider,
    Image,
    Tag,
    Typography,
    Menu,
    Layout,
    Input,
    Form,
    Card

} from 'antd'

import { getArtwork, getSimilarArtworks } from '../fetcher'
import { getSearchByFilter, getSearchByKeyword, getNaughtyByHeight, getNaughtyByBirthYear } from '../fetcher'
import MenuBar from '../components/MenuBar';

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;

const { SubMenu } = Menu;
const { Title } = Typography;
const { Column, ColumnGroup } = Table;
const { Meta } = Card;

class SearchPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        //getting object ID from url: ...artwork?objectID=${objectID}
        //window.location.search: ?objectID=${objectID}
        //substring(1): objectID=${objectID}
        //after split: ["objectID", objectID]; index 1 gets the object ID
            searchArtwork:'',
            searchArtist:'',
            filterClassification: 'painting',
            filterNationality: 'American',
            filterBeginyear: 1700,
            filterEndyear: 1800,
            filterStyle: '',
            selectedObjectID: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            searchResults: []

        }

        this.goToArtwork = this.goToArtwork.bind(this)
        this.searchArtwork = this.searchArtwork.bind(this)
        this.searchArtist = this.searchArtist.bind(this)
        // this.filterClassification = this.filterClassification.bind(this)
        // this.filterNationality = this.filterNationality.bind(this)
        // this.filterBeginyear = this.filterBeginyear.bind(this)
        // this.filterEndyear = this.filterEndyear.bind(this)
        // this.filterStyle = this.filterStyle.bind(this)
    }

    goToArtwork(objectID) {
        window.location = `/artwork?objectID=${objectID}`
    }
    
    searchArtwork(event) {
      this.setState({ searchArtwork: event.target.value })
    }

    searchArtist(event) {
      this.setState({ searchArtist: event.target.value })
    }

    updateSearchResults() {
      getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, null, null).then(res => {
          this.setState({ searchResults: res.results })
      })
  }

   updateFilterResults(){
    getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, null, null).then(res => {
      this.setState({ searchResults: res.results })
  })
   }

    componentDidMount() {
      getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, null, null).then(res => {
        this.setState({ searchResults: res.results })
    })

      getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, null, null).then(res => {
      this.setState({ searchResults: res.results })
    })
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Divider>
        <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
        <Row justify="space-around" align="middle">  
        <Title>Explore Collections</Title>
          {/* create search fields */}
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '0vh', marginBottom: '2vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Search by artwork:</label>
                <FormInput placeholder="artwork" OnChange={this.state.searchArtwork} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>

              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Search by artist:</label>
                <FormInput placeholder="artist" OnChange={this.state.searchArttist} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
        </Row>
        
        <Layout className="site-layout-background" style={{ padding: '24px 0'}}>
          <Sider className="site-layout-background" width = {300} style={{marginLeft: '1.5vw'}} >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
               <Button theme="dark" style={{ marginTop: '1vh'}} size='30' block> Filter:</Button>
               <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
              <SubMenu key="classification" title="Classification">
                <Menu.Item key='painting' onClick={this.state.filterClassification}>Painting</Menu.Item>
                <Menu.Item key='print'  onClick={this.state.filterClassification}>Print</Menu.Item>
                <Menu.Item key='drawing'  onClick={this.state.filterClassification}>Drawing</Menu.Item>
              </SubMenu>
              <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
              <Form name="filter" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} >
                <Form.Item name="style" label="Style" > <Input placeholder="style" OnChange={this.state.filterStyle}/> </Form.Item>
                <Form.Item name="nationality" label="Nationality" > <Input placeholder="American" OnChange={this.state.filterNationality}/> </Form.Item>
                <Form.Item name="beginYear" label="Begin Year" > <Input placeholder={1700} OnChange={this.state.filterBeginyear}/> </Form.Item>
                <Form.Item name="endYear" label="End Year" > <Input placeholder={1800} OnChange={this.state.filterEndyear}/> </Form.Item>
              </Form>
              <Button theme="dark" style={{ marginTop: '2vh', marginBotton: '2vh' }} onClick={this.updateFilterResults} block>Search</Button>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Row gutter={16} justify="space-around" align="middle">
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220}}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220}}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
            </Row>
            <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
            <Row gutter={16} justify="space-around" align="middle">
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220}}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable = {true}
                  style={{ width: 220}}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat"/>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
        </Divider>
        

        {/* Naughty search */}
        <Divider>
        <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
        <Row justify="space-around" align="middle"> 
        <Title level ={2}>Not Sure What To See? Try Explore Collections From Here</Title>
          {/* create search fields */}
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Enter your height (in centimeters):</label>
                <FormInput placeholder="height (eg. 180)" OnChange={this.state.searchArtwork} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>

              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Enter your birth year:</label>
                <FormInput placeholder="year (eg. 2000)" OnChange={this.state.searchArttist} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
        </Row>
        <Layout className="site-layout-background" style={{ padding: '24px 0'}}>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Row gutter={16} justify="space-around" align="middle" >
              <Col style={{ padding: '0 24px', width: 10 }} />
              <Col span={7}>
                <Card hoverable={true}
                  style={{ width: 220 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat" />
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable={true}
                  style={{ width: 220 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat" />
                </Card>
              </Col>
              <Col span={7}>
                <Card hoverable={true}
                  style={{ width: 220 }}
                  cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                >
                  <Meta title="Europe Street beat" />
                </Card>
              </Col>
            </Row>
            
          </Content>
          </Layout>
        </Divider>
      </div>
      

    )
  }
}

export default SearchPage