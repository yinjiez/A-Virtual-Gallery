import React from 'react';
import {FormInput, FormGroup, Button } from "shards-react";
import Masonry from "react-responsive-masonry"
import {
    Table,
    Row,
    Col,
    Divider,
    Typography,
    Menu,
    Layout,
    Input,
    Form,
    Card,
    List,
    Select,


} from 'antd'


import { getSearchByFilter, getSearchByKeyword, getNaughtyByHeight, getNaughtyByBirthYear } from '../fetcher'
import MenuBar from '../components/MenuBar';
import { useLocation } from 'react-router-dom';


const { Header, Content, Sider, Footer } = Layout;

const { SubMenu } = Menu;
const { Title } = Typography;
const { Meta } = Card;
const { Option } = Select;


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
            naughtyResults:[],
            visible: 6,
            mode:'f',
            height: 170,
            birthYear: 2001,
            style: window.location.search ? window.location.search.substring(1).split('=')[1] : ""
        }
        

        this.goToArtwork = this.goToArtwork.bind(this)
        this.searchArtwork = this.searchArtwork.bind(this)
        this.searchArtist = this.searchArtist.bind(this)
        this.handleClassChange = this.handleClassChange.bind(this)
        this.handleNationalityChange = this.handleNationalityChange.bind(this)
        this.handleBegYearChange = this.handleBegYearChange.bind(this)
        this.handleEndYearChange = this.handleEndYearChange.bind(this)
        this.handleStyleChange = this.handleStyleChange.bind(this)
        this.handleHeightChange = this.handleHeightChange.bind(this)
        this.handleBirthYearChange = this.handleBirthYearChange.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.updateFilterResults = this.updateFilterResults.bind(this)
        this.updateHeightResults = this.updateHeightResults.bind(this)        
        this.updateBirthYearResults = this.updateBirthYearResults.bind(this)  


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
      this.setState({ filterNationality: event }) //event.target.value 
    }

    handleStyleChange(event) {
        this.setState({ filterStyle: event })
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
  
    handleHeightChange(event){
      this.setState({ height: event.target.value })
    }

    handleBirthYearChange(event){
      this.setState({ birthYear: event.target.value })
    }


    /**update keyword search */
    updateSearchResults() {
      getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, 1, this.state.visible).then(res => {
        var jsonObj ={}
        var list2 = []
        for (let i = 0; i < res.results.length; i++) {
            jsonObj = res.results[i]
            list2.push(jsonObj)
            
        }
        this.setState({ searchResults: list2})
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
          }
          this.setState({ searchResults: list4})
          this.setState( {mode: 'f'})
        })
    }

     /** update naughty search */
    updateHeightResults(){
        getNaughtyByHeight(this.state.height, 1, 30).then(res => {
          var jsonObj ={}
          var list5 = []
          for (let i = 0; i < res.results.length; i++) {
              jsonObj = res.results[i]
              list5.push(jsonObj)
          }
          this.setState({ naughtyResults: list5})
        })
      }

    updateBirthYearResults(){
        getNaughtyByBirthYear(this.state.birthYear, 1, 30).then(res => {
          var jsonObj ={}
          var list6 = []
          for (let i = 0; i < res.results.length; i++) {
              jsonObj = res.results[i]
              list6.push(jsonObj)
          }
          this.setState({ naughtyResults: list6})
        })
    }

    /** update style collection results */
    updateStyleResults(){
      getSearchByFilter("", this.state.style, 0, 2022, "painting", 1, this.state.visible).then(res => {
        var jsonObj ={}
        var list8 = []
        for (let i = 0; i < res.results.length; i++) {
            jsonObj = res.results[i]
            list8.push(jsonObj)
        }
        this.setState({ searchResults: list8})
        this.setState({ mode: 's'})
      })
  }


    componentDidMount() {
        if (this.state.style !== ""){
          this.setState({ visible: 60})
          getSearchByFilter("", this.state.style, 0, 2022, "painting", 1, this.state.visible).then(res => {
            var jsonObj ={}
            var list7 = []
            for (let i = 0; i < res.results.length; i++) {
                jsonObj = res.results[i]
                list7.push(jsonObj)
            }
            this.setState({ searchResults: list7})
            this.setState({ mode: 's'})
          })

          // this.setState({ searchResults: []})
        } else {

          getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, 1, this.state.visible).then(res => {
            var jsonObj ={}
            var list1 = []
            for (let i = 0; i < res.results.length; i++) {
                jsonObj = res.results[i]
                list1.push(jsonObj)
            }
            this.setState({ searchResults: list1})
            this.setState( {mode: 'f'})
          })

          getNaughtyByBirthYear(this.state.birthYear, 1, 30).then(res => {
            var jsonObj ={}
            var list3 = []
            for (let i = 0; i < res.results.length; i++) {
                jsonObj = res.results[i]
                list3.push(jsonObj)
            }
            this.setState({ naughtyResults: list3})
          })
        }
        
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
                <Menu.Item key='' >All</Menu.Item>
              </SubMenu>
              <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
              <Form name="filter" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                <Form.Item name="style" label="Style"> 
                <Select placeholder="select a style" onChange={this.handleStyleChange}>
                  <Option value="Impressionist">Impressionist</Option>
                  <Option value="Post-Impressionist">Post-Impressionist</Option>
                  <Option value="Baroque">Baroque</Option>
                  <Option value="Realist">Realist</Option>
                  <Option value="Renaissance">Renaissance</Option>
                  <Option value="Romantic">Romantic</Option>
                  <Option value="Naive">Naive</Option>
                  <Option value="Abstract Expressionist">Abstract Expressionist</Option>
                  <Option value="Rococo">Rococo</Option>
                  <Option value="Neoclassic">Neoclassic</Option>
                  <Option value="Gothic">Gothic</Option>
                  <Option value="Minimalist">Minimalist</Option>
                  <Option value="">  </Option>
               </Select>
                </Form.Item>
                {/* <Form.Item name="nationality" label="Nationality" > <Input placeholder="American" onChange={this.handleNationalityChange}/> </Form.Item>*/}
                <Form.Item name="nationality" label="Nationality" > 
                <Select placeholder="artist's origin" onChange={this.handleNationalityChange}>
                  <Option value="American">American</Option>
                  <Option value="Mexican">Mexican</Option>
                  <Option value="Canadian">Canadian</Option>
                  <Option value="British">British</Option>
                  <Option value="English">English</Option>
                  <Option value="Scottish">Scottish</Option>
                  <Option value="Italian">Italian</Option>
                  <Option value="Spanish">Spanish</Option>
                  <Option value="French">French</Option>
                  <Option value="German">German</Option>
                  <Option value="Austrian">Austrian</Option>
                  <Option value="Dutch">Dutch</Option>
                  <Option value="Netherlandish">Netherlandish</Option>
                  <Option value="Norwegian">Norwegian</Option>
                  <Option value="Flemish">Flemish</Option>
                  <Option value="Swiss">Swiss</Option>
                  <Option value="Swedish">Swedish</Option>
                  <Option value="Belgian">Belgian</Option>
                  <Option value="Danish">Danish</Option>
                  <Option value="Russian">Russian</Option>
                  <Option value="Czech">Czech</Option>
                  <Option value="Bohemian">Bohemian</Option>
                  <Option value="Japanese">Japanese</Option>
                  <Option value="Chinese">Chinese</Option>
                  <Option value="Other">Other</Option>
                  <Option value="">  </Option>
               </Select>
                </Form.Item>
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
              cover={<img src={item.thumbURL.replace('!200,200', '!600,600')} maxHeight={300}></img>} onClick={() => this.goToArtwork(item.objectID)}>
                  <Meta title={<a>{item.title}</a>}></Meta>
                  <Meta description={item.attribution}></Meta>
            </Card>)}
            </Masonry>
            <Row justify='center'><button          
            onClick={() => [this.state.mode === 's'? [this.loadMore(), this.updateStyleResults()]: (this.state.mode ==='k'? [this.loadMore(), this.updateSearchResults()] :  [this.loadMore(), this.updateFilterResults()])]} type="button" className="load-more">Load more</button></Row>
          </Content>
        </Layout>
        </Divider>

        {/* Naughty search */}
        <Divider>
        <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
        <Row justify="space-around" align="middle"> 
        <Title level ={2}>Not Sure What To See? Try Explore Collections From Here</Title>
          {/* create search fields*/}
          <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
            <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Enter your height (in centimeters):</label>
                <FormInput placeholder="height (eg. 180)" onChange={this.handleHeightChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateHeightResults}>Search</Button>
              </FormGroup></Col>

              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Enter your birth year:</label>
                <FormInput placeholder="year (eg. 2000)" onChange={this.handleBirthYearChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                <Button theme="dark" style={{ marginTop: '3vh' }} onClick={this.updateBirthYearResults}>Search</Button>
              </FormGroup></Col>
            </Row>
          </Form>
        </Row>
        <Layout className="site-layout-background" style={{ padding: '24px 0'}}>
          <Content style={{ padding: '0 120px', minHeight: 280 }}>
            <List
            itemLayout="vertical"
            grid={{column: 3, md: true}}
            size="medium"
            pagination={{
              pageSizeOptions:[3, 6, 9], defaultPageSize: 3, showQuickJumper: true, showSizeChanger: true
            }}
            dataSource={this.state.naughtyResults}
            renderItem={item => <Card hoverable = {true}
              style={{ width: 220, marginTop: '2vh',whiteSpace: 'normal' }}
              cover={<img src={item.thumbURL.replace('!200,200', '!600,600')} maxHeight={300}></img>} onClick={() => this.goToArtwork(item.objectID)}>
                  <Meta title={<a>{item.title}</a>}></Meta>
                  <Meta description={item.attribution}></Meta>
            </Card>}
            />
          </Content>
          </Layout>
        </Divider>
      </div>
    )
  }
}

export default SearchPage