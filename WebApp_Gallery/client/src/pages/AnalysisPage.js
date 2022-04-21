import React, { useState, useEffect } from 'react';
import { FormInput, FormGroup, Badge, CardBody, CardTitle, Progress, CardImgOverlay } from "shards-react";
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
    Card,
    Button,
    Tooltip

} from 'antd'

import ItemsCarousel from 'react-items-carousel';
import {Link, Redirect} from 'react-router-dom';

import { getArtwork, getSimilarArtworks } from '../fetcher'
import { getAnalysisOverview, getAnalysisByType, getPortraitsAcrossTime } from '../fetcher'

import MenuBar from '../components/MenuBar';

import { UserOutlined, LaptopOutlined, NotificationOutlined, LeftOutlined, RightOutlined, RedoOutlined } from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;

const { SubMenu } = Menu;
const { Title } = Typography;
const { Column, ColumnGroup } = Table;
const { Meta } = Card;

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

//horizonal scroll implementation

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
        width: 300, height: 350, backgroundSize: '130%', backgroundPosition: 'top', padding: '20px', top: 0}}>
            <Typography.Title level={4} style={{color: 'white', margin: 0}}>Abstract Expressionist</Typography.Title>
            <p style={{color: 'white', margin: 0}}>283 Items</p>
        </div></Link></a>
        </ItemsCarousel>
      </div>
    );
  };



class AnalysisPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            portraitSet: [], //the set of 6 periods currently being redered
            p1: [], //6 portraits from 15th century (1400 -1499)
            p2: [], //6 portraits from 16th century (1500 -1599)
            p3: [], //6 portraits from 17th century (1600 -1699)
            p4: [], //6 portraits from 18th century (1700 -1799)
            p5: [], //6 portraits from 19th century (1800 -1899)
            p6: [], //6 portraits from 20th century (1900 -1999)
            k: 0
        }
    
    this.shufflePortraitSet = this.shufflePortraitSet.bind(this)
    this.goToArtwork = this.goToArtwork.bind(this)

    }


    goToArtwork(objectID) {
        window.location = `/artwork?objectID=${objectID}`
    }

    shufflePortraitSet(){
        if (this.state.k < 7){
            this.setState({k: this.state.k + 1})
        } else {
            this.setState({k: 0})
        }
        var temp = []
        temp.push(this.state.p1[this.state.k])
        temp.push(this.state.p2[this.state.k])
        temp.push(this.state.p3[this.state.k])
        temp.push(this.state.p4[this.state.k])
        temp.push(this.state.p5[this.state.k])
        temp.push(this.state.p6[this.state.k])
        this.setState({ portraitSet: temp})
    }

    keywordGraph = (dataset) => {

        const config = {
          data: dataset,
          wordField: 'name',
          weightField: 'value',
          colorField: 'name',
          wordStyle: {
            fontFamily: 'Verdana',
            fontSize: [12, 38],
            rotation: 0,
          },
    
          random: () => 0.5,
        };
      
        return <WordCloud {...config} />;
      };  

    componentDidMount() {

        Promise.all([
            getPortraitsAcrossTime("painting", 1400, 1499, 1, 8),
            getPortraitsAcrossTime("painting", 1500, 1599, 1, 8),
            getPortraitsAcrossTime("painting", 1600, 1699, 1, 8),
            getPortraitsAcrossTime("painting", 1700, 1799, 1, 8),
            getPortraitsAcrossTime("painting", 1800, 1899, 1, 8),
            getPortraitsAcrossTime("painting", 1900, 1999, 1, 8)
        ]).then(([r1, r2, r3, r4, r5, r6]) => {
            this.setState({ p1: r1.results}) //store 5 portraits from 15th century
            this.setState({ p2: r2.results}) //store 5 portraits from 16th century
            this.setState({ p3: r3.results}) //store 5 portraits from 17th century
            this.setState({ p4: r4.results}) //store 5 portraits from 18th century
            this.setState({ p5: r5.results}) //store 5 portraits from 19th century
            this.setState({ p6: r6.results}) //store 5 portraits from 20th century
            this.setState({ portraitSet: [this.state.p1[0], this.state.p2[0],  this.state.p3[0], this.state.p4[0],this.state.p5[0], this.state.p6[0]]}) //push the 1st item of each period into the display set
        })

        getAnalysisOverview().then(res => {
            var jsonObj = {}
            var keys = []
            for (let i = 0; i < res.Style.length; i++) {
                jsonObj = res.Style[i]
                keys.push(jsonObj)
            }
            for (let i = 0; i < res.School.length; i++) {
                jsonObj = res.School[i]
                keys.push(jsonObj)
            }
            for (let i = 0; i < res.Theme.length; i++) {
                jsonObj = res.Theme[i]
                keys.push(jsonObj)
            }
            for (let i = 0; i < res.Technique.length; i++) {
                jsonObj = res.Technique[i]
                keys.push(jsonObj)
            }
            for (let i = 0; i < res.Keyword.length; i++) {
                jsonObj = res.Keyword[i]
                keys.push(jsonObj)
            }
            for (let i = 0; i < res.PlaceExecuted.length; i++) {
                jsonObj = res.PlaceExecuted[i]
                keys.push(jsonObj)
            }
            
            this.setState({ keywordSelections: keys })
        })
        
    }

    render() {
        return (
            <div>
                <MenuBar />

                <Divider>
                        {/* Display keyword graph on top */}
                    <Row justify="space-around" align="middle">
                        <Title level={2}>Collections Keywords</Title>
                    </Row>
                    <Form style={{ width: '80vw', margin: '0 auto', minHeight: 400}}>
                        {this.keywordGraph(this.state.keywordSelections)}
                    </Form>        
                </Divider>

                <Row justify="space-around" align="middle">
                <Title level={2}>Top 8 Styles in Collection</Title>
                </Row>
                {/* Collection by styles, fully set up above*/}
                <StyleCollection />
                 

                {/* Portraits across time*/}
                <Row style={{ padding: '0 24px', minHeight: 50 }}></Row>
                <Row justify="space-around" align="middle">
                <Title level={2}>Portraits across time</Title>
                </Row>
                <div style={{ padding: `0 50px` }}><ItemsCarousel
                        alwaysShowChevrons={true}
                        rightChevron={<Tooltip title="Try me!"><Button shape="circle" icon={<RedoOutlined />} onClick={this.shufflePortraitSet} size='large' /></Tooltip>}
                        numberOfCards={6}
                        gutter={0}
                        outsideChevron
                        chevronWidth={50}>
                {this.state.portraitSet.map(item => <a><div style={{backgroundImage: `url('${item.thumbURL.replace('!200,200','!500,500')}`,
                    width: 250, height: 350, backgroundSize: 'cover', padding: '20px'}} onClick={() => this.goToArtwork(item.objectID)}>
                    <Typography.Title level={4} style={{color: 'white', margin: 0, position: 'absolute'}}>{item.endYear}s</Typography.Title>
                    <p style={{color: 'white', width: 210, margin: 0, position: 'absolute', bottom: 12, wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'}}>{item.title}</p>
                    </div></a>)}
                </ItemsCarousel></div>
                
                {/* Display heatmap */}
                <Divider>
                        {/* Display heatmap graph at bottom */}
                    <Row style={{ padding: '0 24px', minHeight: 50 }}></Row>
                    <Row justify="space-around" align="middle">
                        <Title level={2}>Collections Distribution</Title>
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