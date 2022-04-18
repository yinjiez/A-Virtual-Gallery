import React, { useState, useEffect } from 'react';
import { FormInput, FormGroup, Button, Badge, CardBody, CardTitle, Progress, CardImgOverlay } from "shards-react";
import { WordCloud, Heatmap } from '@ant-design/plots';

import {
    Table,
    Row,
    Col,
    Divider,
    Tag,
    Typography,
    Menu,
    Layout,
    Input,
    Form,
    Card

} from 'antd'

import ItemsCarousel from 'react-items-carousel';
import {Link, Redirect} from 'react-router-dom';

import { getArtwork, getSimilarArtworks } from '../fetcher'
import { getSearchByFilter, getSearchByKeyword, getNaughtyByHeight, getNaughtyByBirthYear } from '../fetcher'
import MenuBar from '../components/MenuBar';

import { UserOutlined, LaptopOutlined, NotificationOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;

const { SubMenu } = Menu;
const { Title } = Typography;
const { Column, ColumnGroup } = Table;
const { Meta } = Card;

// Keywords chart pre-setup: to return keyword map
const DemoWordCloud = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      asyncFetch();
    }, []);
  
    const asyncFetch = () => {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/antv-keywords.json')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
          console.log('fetch data failed', error);
        });
    };
    const config = {
      data,
      wordField: 'name',
      weightField: 'value',
      colorField: 'name',
      wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [8, 32],
        rotation: 0,
      },

      random: () => 0.5,
    };
  
    return <WordCloud {...config} />;
  };  


//   Pre-setup for heatmap
const DemoHeatmap = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      asyncFetch();
    }, []);
  
    const asyncFetch = () => {
      fetch('https://gw.alipayobjects.com/os/basement_prod/a719cd4e-bd40-4878-a4b4-df8a6b531dfe.json')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
          console.log('fetch data failed', error);
        });
    };
    const config = {
      width: 650,
      height: 500,
      autoFit: false,
      data,
      xField: 'Month of Year',
      yField: 'District',
      colorField: 'AQHI',
      color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
      meta: {
        'Month of Year': {
          type: 'cat',
        },
      },
    };
  
    return <Heatmap {...config} />;
  };

//horizonal scroll

const StyleCollection = () => {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 40;
    return (
      <div style={{ padding: `0 ${chevronWidth}px` }}>
        <ItemsCarousel
          infiniteLoop
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          alwaysShowChevrons={false}
          numberOfCards={5}
          gutter={0}
          leftChevron={<LeftOutlined>{'<'}</LeftOutlined>}
          rightChevron={<RightOutlined>{'>'}</RightOutlined>}
          outsideChevron
          chevronWidth={chevronWidth}
        >
        <a><Link to={`/search/byFilter?style=Impressionist`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/0b9cefb5-1ee4-401a-8154-8d4039191a28/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Impressionist</Typography.Title>
            <p style={{color: 'white', margin: 0}}>927 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Post-Impressionist`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0), rgba(0, 0, 0, 0.3)), url('https://api.nga.gov/iiif/aebdb01a-10f8-406f-9b7d-210281d4af11/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Post-Impressionist</Typography.Title>
            <p style={{color: 'white', margin: 0}}>744 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Baroque`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/c66840d0-00b2-47d1-a4de-d157ad5712c2/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', backgroundPosition: 'right', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Baroque</Typography.Title>
            <p style={{color: 'white', margin: 0}}>675 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Realist`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/990b6b8d-118e-4302-83b9-9a6e184515e4/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Realist</Typography.Title>
            <p style={{color: 'white', margin: 0}}>586 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Renaissance`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/8f29e3c9-a289-4d53-abf0-31a66e9e98fa/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Renaissance</Typography.Title>
            <p style={{color: 'white', margin: 0}}>531 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Romantic`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/e69c25bb-f772-4ac2-966f-2954eb420a84/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: '200%', backgroundPosition: 'right', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Romantic</Typography.Title>
            <p style={{color: 'white', margin: 0}}>310 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=Naive`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/9693cf05-1a96-4da7-ab21-dfa2f10e81b6/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Naive</Typography.Title>
            <p style={{color: 'white', margin: 0}}>284 Items</p>
        </div></Link></a>
        <a><Link to={`/search/byFilter?style=abstract expression`}><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.2), rgba(0, 0, 0, 0.2)), url('https://api.nga.gov/iiif/aefb55ba-3f17-410f-9c42-f7fd797320f5/full/!600,600/0/default.jpg')",
        width: 300, height: 350, backgroundSize: 'cover', backgroundPosition: 'top', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Abstract Expressionist</Typography.Title>
            <p style={{color: 'white', margin: 0}}>624 Items</p>

        </div></Link></a>
        </ItemsCarousel>
      </div>
    );
  };


class AnalysisPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    
    this.goToStyleSearch = this.goToStyleSearch.bind(this)
    }



    goToStyleSearch(style) {
        window.location = `/search/byFilter=nationality=&style=${style}&beginYear=0&endYear=2022&classfication=painting&page=1&pagesize=60`
        
    }




    componentDidMount() {

    }

    render() {
        return (
            <div>
                <MenuBar />

                <Divider>
                        {/* Have two graphs in one row */}
                        {/* <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
                        <Row gutter={200} justify="space-around" align="middle">
                                <Col flex={1}><FormGroup style={{ width: '30vw', margin: '0 auto' }}>
                                    <label>Keywords:</label>
                                    <DemoWordCloud />
                                </FormGroup></Col>
                                <Col flex={1}><FormGroup style={{ width: '30vw', margin: '0 auto' }}>
                                    <label>Heatmap:</label>
                                    <DemoHeatmap />
                                </FormGroup></Col>
                            </Row>
                        </Form> */}
                        {/* Display keyword graph on top */}
                    <Row justify="space-around" align="middle">
                        <Title level={3}>Collections Keywords</Title>
                    </Row>
                    <Form style={{ width: '60vw', margin: '0 auto', minHeight: 280}}>
                        <DemoWordCloud />
                    </Form>
                                                      
                        
                </Divider>

                <Row justify="space-around" align="middle">
                <Title level={3}>Top 8 Styles in Collection</Title>
                </Row>
                <StyleCollection />
                 
                

                {/* Artworks in different time span*/}
                {/* <Divider>
                    <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
                    <Layout className="site-layout-background" style={{ padding: '0 50px' }}>
                        <Content className="site-layout-content" style={{ padding: '0 50px', minHeight: 280 }}>
                            <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
                                <Row style={{ padding: '0 24px', minHeight: 10 }}>
                                    <Row justify="space-around" align="middle">
                                        <Title level={3}>Artwork Collections In Different Time Span</Title>
                                    </Row>
                                    <Row gutter={200} justify="space-around" align="middle">
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
                                </Row>
                            </Form>
                        </Content>
                    </Layout>
                </Divider> */}


                 {/* Artworks in different region*/}
                 {/* <Divider>
                    <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
                    <Layout className="site-layout-background" style={{ padding: '0 50px' }}>
                        <Content className="site-layout-content" style={{ padding: '0 50px', minHeight: 280 }}>
                            <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
                                <Row style={{ padding: '0 24px', minHeight: 10 }}>
                                    <Row justify="space-around" align="middle">
                                        <Title level={3}>Artwork Collections In Different Regions</Title>
                                    </Row>
                                    <Row gutter={200} justify="space-around" align="middle">
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                        <Col span={1}>
                                            <Card hoverable={true}
                                                style={{ width: 200 }}
                                                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
                                            >
                                                <Meta title="Europe Street beat" />
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
                                </Row>
                            </Form>
                        </Content>
                    </Layout>
                </Divider> */}

                {/* Display heatmap */}
                <Divider>
                        {/* Display heatmap graph at bottom */}
                    <Row justify="space-around" align="middle">
                        <Title level={3}>Collections Distribution</Title>
                    </Row>
                    <Form style={{ width: '100vw', margin: '0 auto', minHeight: 280, marginTop: '5 vh'}}>
                        {/* <DemoHeatmap /> */}
                    </Form>
                                                      
                </Divider>

            </div>

        )
    }
}

export default AnalysisPage