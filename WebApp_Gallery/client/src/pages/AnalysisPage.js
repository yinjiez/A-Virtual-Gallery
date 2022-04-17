// import React, { useState, useEffect } from 'react';
// import { FormInput, FormGroup, Button, Badge, CardBody, CardTitle, Progress } from "shards-react";
// import { WordCloud, Heatmap } from '@ant-design/plots';

// import {
//     Table,
//     Row,
//     Col,
//     Divider,
//     Image,
//     Tag,
//     Typography,
//     Menu,
//     Layout,
//     Input,
//     Form,
//     Card

// } from 'antd'

// import { getArtwork, getSimilarArtworks } from '../fetcher'
// import { getSearchByFilter, getSearchByKeyword, getNaughtyByHeight, getNaughtyByBirthYear } from '../fetcher'
// import MenuBar from '../components/MenuBar';

// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

// const { Header, Content, Sider, Footer } = Layout;

// const { SubMenu } = Menu;
// const { Title } = Typography;
// const { Column, ColumnGroup } = Table;
// const { Meta } = Card;

// // Keywords chart pre-setup: to return keyword map
// const DemoWordCloud = () => {
//     const [data, setData] = useState([]);
  
//     useEffect(() => {
//       asyncFetch();
//     }, []);
  
//     const asyncFetch = () => {
//       fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/antv-keywords.json')
//         .then((response) => response.json())
//         .then((json) => setData(json))
//         .catch((error) => {
//           console.log('fetch data failed', error);
//         });
//     };
//     const config = {
//       data,
//       wordField: 'name',
//       weightField: 'value',
//       colorField: 'name',
//       wordStyle: {
//         fontFamily: 'Verdana',
//         fontSize: [8, 32],
//         rotation: 0,
//       },

//       random: () => 0.5,
//     };
  
//     return <WordCloud {...config} />;
//   };  


// //   Pre-setup for heatmap
// const DemoHeatmap = () => {
//     const [data, setData] = useState([]);
  
//     useEffect(() => {
//       asyncFetch();
//     }, []);
  
//     const asyncFetch = () => {
//       fetch('https://gw.alipayobjects.com/os/basement_prod/a719cd4e-bd40-4878-a4b4-df8a6b531dfe.json')
//         .then((response) => response.json())
//         .then((json) => setData(json))
//         .catch((error) => {
//           console.log('fetch data failed', error);
//         });
//     };
//     const config = {
//       width: 650,
//       height: 500,
//       autoFit: false,
//       data,
//       xField: 'Month of Year',
//       yField: 'District',
//       colorField: 'AQHI',
//       color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'],
//       meta: {
//         'Month of Year': {
//           type: 'cat',
//         },
//       },
//     };
  
//     return <Heatmap {...config} />;
//   };


// class AnalysisPage extends React.Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             //getting object ID from url: ...artwork?objectID=${objectID}
//             //window.location.search: ?objectID=${objectID}
//             //substring(1): objectID=${objectID}
//             //after split: ["objectID", objectID]; index 1 gets the object ID
//             searchArtwork: '',
//             searchArtist: '',
//             filterClassification: 'painting',
//             filterNationality: 'American',
//             filterBeginyear: 1700,
//             filterEndyear: 1800,
//             filterStyle: '',
//             selectedObjectID: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
//             searchResults: []

//         }

//         this.goToArtwork = this.goToArtwork.bind(this)
//         this.searchArtwork = this.searchArtwork.bind(this)
//         this.searchArtist = this.searchArtist.bind(this)
//     }

//     goToArtwork(objectID) {
//         window.location = `/artwork?objectID=${objectID}`
//     }

//     searchArtwork(event) {
//         this.setState({ searchArtwork: event.target.value })
//     }

//     searchArtist(event) {
//         this.setState({ searchArtist: event.target.value })
//     }

//     updateSearchResults() {
//         getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, null, null).then(res => {
//             this.setState({ searchResults: res.results })
//         })
//     }

//     updateFilterResults() {
//         getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, null, null).then(res => {
//             this.setState({ searchResults: res.results })
//         })
//     }

//     componentDidMount() {
//         getSearchByKeyword(this.state.searchArtwork, this.state.searchArtist, null, null).then(res => {
//             this.setState({ searchResults: res.results })
//         })

//         getSearchByFilter(this.state.filterNationality, this.state.filterStyle, this.state.filterBeginyear, this.state.filterEndyear, this.state.filterClassification, null, null).then(res => {
//             this.setState({ searchResults: res.results })
//         })
//     }

//     render() {
//         return (
//             <div>
//                 <MenuBar />

//                 <Divider>
//                         {/* Have two graphs in one row */}
//                         {/* <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
//                         <Row gutter={200} justify="space-around" align="middle">
//                                 <Col flex={1}><FormGroup style={{ width: '30vw', margin: '0 auto' }}>
//                                     <label>Keywords:</label>
//                                     <DemoWordCloud />
//                                 </FormGroup></Col>
//                                 <Col flex={1}><FormGroup style={{ width: '30vw', margin: '0 auto' }}>
//                                     <label>Heatmap:</label>
//                                     <DemoHeatmap />
//                                 </FormGroup></Col>
//                             </Row>
//                         </Form> */}
//                         {/* Display keyword graph on top */}
//                     <Row justify="space-around" align="middle">
//                         <Title level={3}>Collections Keywords</Title>
//                     </Row>
//                     <Form style={{ width: '60vw', margin: '0 auto', minHeight: 280}}>
//                         <DemoWordCloud />
//                     </Form>
                                                      
                        
//                 </Divider>

//                 <Divider>
//                     <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
//                     <Layout className="site-layout-background" style={{ padding: '0 50px' }}>
//                         <Content className="site-layout-content" style={{ padding: '0 50px', minHeight: 280 }}>
//                             <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
//                                 <Row style={{ padding: '0 24px', minHeight: 10 }}>
//                                     <Row justify="space-around" align="middle">
//                                         <Title level={3}>Semantic Analysis By Contents of Artwork</Title>
//                                     </Row>
//                                     <Row gutter={200} justify="space-around" align="middle">
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                     <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
//                                 </Row>
//                             </Form>
//                         </Content>
//                     </Layout>
//                 </Divider>


//                 {/* Artworks in different time span*/}
//                 <Divider>
//                     <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
//                     <Layout className="site-layout-background" style={{ padding: '0 50px' }}>
//                         <Content className="site-layout-content" style={{ padding: '0 50px', minHeight: 280 }}>
//                             <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
//                                 <Row style={{ padding: '0 24px', minHeight: 10 }}>
//                                     <Row justify="space-around" align="middle">
//                                         <Title level={3}>Artwork Collections In Different Time Span</Title>
//                                     </Row>
//                                     <Row gutter={200} justify="space-around" align="middle">
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                     <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
//                                 </Row>
//                             </Form>
//                         </Content>
//                     </Layout>
//                 </Divider>
//                  {/* Artworks in different region*/}
//                  <Divider>
//                     <Row style={{ padding: '0 24px', minHeight: 10 }}></Row>
//                     <Layout className="site-layout-background" style={{ padding: '0 50px' }}>
//                         <Content className="site-layout-content" style={{ padding: '0 50px', minHeight: 280 }}>
//                             <Form style={{ width: '80vw', margin: '0 auto', marginTop: '2vh', marginBottom: '2vh' }}>
//                                 <Row style={{ padding: '0 24px', minHeight: 10 }}>
//                                     <Row justify="space-around" align="middle">
//                                         <Title level={3}>Artwork Collections In Different Regions</Title>
//                                     </Row>
//                                     <Row gutter={200} justify="space-around" align="middle">
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                         <Col span={1}>
//                                             <Card hoverable={true}
//                                                 style={{ width: 200 }}
//                                                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} onClick={() => this.goToArtwork(this.state.selectedObjectID)}
//                                             >
//                                                 <Meta title="Europe Street beat" />
//                                             </Card>
//                                         </Col>
//                                     </Row>
//                                     <Row style={{ padding: '0 24px', minHeight: 30 }}></Row>
//                                 </Row>
//                             </Form>
//                         </Content>
//                     </Layout>
//                 </Divider>

//                 {/* Display heatmap */}
//                 <Divider>
//                         {/* Display heatmap graph at bottom */}
//                     <Row justify="space-around" align="middle">
//                         <Title level={3}>Collections Distribution</Title>
//                     </Row>
//                     <Form style={{ width: '100vw', margin: '0 auto', minHeight: 280, marginTop: '5 vh'}}>
//                         <DemoHeatmap />
//                     </Form>
                                                      
//                 </Divider>

//             </div>

//         )
//     }
// }

// export default AnalysisPage