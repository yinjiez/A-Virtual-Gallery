import React from 'react';
import {FormInput, FormGroup, Button, Badge, CardBody, CardTitle, Container, Progress } from "shards-react";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
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
    Card,
    List

} from 'antd'

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
            searchArtwork: '',
            searchArtist: '',
            filterClassification: 'painting',
            filterNationality: '',
            filterBeginyear: 0,
            filterEndyear: 2022,
            filterStyle: '',
            searchResults:[],
            visible: 6,
            mode:'k'

        }

        this.goToArtwork = this.goToArtwork.bind(this)
        this.searchArtwork = this.searchArtwork.bind(this)
        this.searchArtist = this.searchArtist.bind(this)
        this.handleClassChange = this.handleClassChange.bind(this)
        this.handleNationalityChange = this.handleNationalityChange.bind(this)
        this.handleBegYearChange = this.handleBegYearChange.bind(this)
        this.handleEndYearChange = this.handleEndYearChange.bind(this)
        this.handleStyleChange = this.handleStyleChange.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.updateFilterResults = this.updateFilterResults.bind(this)        

    }

    goToArtwork(objectID) {
        window.location = `/artwork?objectID=${objectID}`
    }
    
    /** handle search box changes */
    searchArtwork(event) {
      this.setState({ searchArtwork: event.target.value })
    }

    searchArtist(event) {
        this.setState({ searchArtist: event.target.value })
    }

    /** handle filter changes */
    handleClassChange(event) {
        this.setState({ filterClassification: event.key })
    }

    handleNationalityChange(event) {
      this.setState({ filterNationality: event.target.value })
    }

    handleStyleChange(event) {
        this.setState({ filterStyle: event.target.value })
    }

    handleBegYearChange(event) {
        this.setState({ filterBeginyear: event.target.value })
    }

    handleEndYearChange(event) {
        this.setState({ filterEndyear: event.target.value })
    }

    loadMore() {
      this.setState( {visible: this.state.visible + 6})
    }
  


    /**update keyword search */
    updateSearchResults() {
      getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, 1, this.state.visible).then(res => {
        var jsonObj ={}
        var list2 = []
        for (let i = 0; i < res.results.length; i++) {
            jsonObj = res.results[i]
            list2.push(jsonObj)
            this.setState({ searchResults: list2})
        }
        this.setState( {mode: 'k'})
      })
    }

    /** update filter search */
    updateFilterResults(){
        getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, 1, this.state.visible).then(res => {
          var jsonObj ={}
          var list4 = []
          for (let i = 0; i < res.results.length; i++) {
              jsonObj = res.results[i]
              list4.push(jsonObj)
              this.setState({ searchResults: list4})
          }
          this.setState( {mode: 'f'})
        })
    }


    componentDidMount() {

        getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, 1, this.state.visible).then(res => {
            var jsonObj ={}
            var list1 = []
            for (let i = 0; i < res.results.length; i++) {
                jsonObj = res.results[i]
                list1.push(jsonObj)
                this.setState({ searchResults: list1})
          }
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
                <FormInput placeholder="artwork" value={this.state.searchArtwork} onChange={this.searchArtwork} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>

              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Search by artist:</label>
                <FormInput placeholder="artist" value={this.state.searchArtist} onChange={this.searchArtist} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
            </Row>
            <Row>
            </Row>
          </Form>
        </Row>
        <Layout className="site-layout-background" style={{ padding: '24px 0'}}>
          <Sider className="site-layout-background" width = {300} style={{marginLeft: '1.5vw'}} >
            <Menu
              mode="inline"
              defaultSelectedKeys={['painting']}
              style={{ height: '100%' }}
              onSelect={this.handleClassChange}
            >
               <Button theme="dark" style={{ marginTop: '1vh'}} size='30' block> Filter:</Button>
               <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
              <SubMenu key="classification" title="Classification" >
                <Menu.Item key='painting' >Painting</Menu.Item>
                <Menu.Item key='print'  >Print</Menu.Item>
                <Menu.Item key='drawing' >Drawing</Menu.Item>
              </SubMenu>
              <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
              <Form name="filter" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} >
                <Form.Item name="style" label="Style" > <Input placeholder="style" onChange={this.handleStyleChange}/> </Form.Item>
                <Form.Item name="nationality" label="Nationality" > <Input placeholder="American" onChange={this.handleNationalityChange}/> </Form.Item>
                <Form.Item name="beginYear" label="Begin Year" > <Input type="text" pattern="[0-9]*" placeholder={1500}  onChange={this.handleBegYearChange}/> </Form.Item>
                <Form.Item name="endYear" label="End Year" > <Input type="text" pattern="[0-9]*" placeholder={1800} onChange={this.handleEndYearChange}/> </Form.Item>
              </Form>
              <Button theme="dark" style={{ marginTop: '2vh', marginBotton: '2vh' }} onClick={this.updateFilterResults} block>Search</Button>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 80px'}}>
            <Masonry columnsCount={3}>
              {this.state.searchResults.map(item => <Card hoverable = {true}
              style={{ width: 220, marginTop: '2vh',whiteSpace: 'normal' }}
              cover={<img src={item.thumbURL} maxHeight={300}></img>} onClick={() => this.goToArtwork(item.objectID)}>
                  <Meta title={<a>{item.title}</a>}></Meta>
                  <Meta description={item.attribution}></Meta>
            </Card>)}
            </Masonry>
            <Row justify='center'><button          
            onClick={() => [this.state.mode ==='k'? [this.loadMore(), this.updateSearchResults()] :  [this.loadMore(), this.updateFilterResults()]]} type="button" className="load-more">Load more</button></Row>
          </Content>
        </Layout>
        </Divider>
      </div>
      
    )
  }
}

export default SearchPage