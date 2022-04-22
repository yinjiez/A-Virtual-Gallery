import React, { useState, useEffect } from 'react';
import { getOverview } from '../fetcher'
import MenuBar from '../components/MenuBar';
import {Row, Typography, Button, Divider, Form} from 'antd'
import {Link, Redirect} from 'react-router-dom';


import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';

import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'

const { Title } = Typography;

//prepare map

const ArtMap = () => {
    const [data, setData] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getChartData();
    }, []);

    const bubbleData = [
        { 'Artwork Country of Origin': 'Italy', 'Number of Artwork in Collections': 892 },
        { 'Artwork Country of Origin': 'United States of America', 'Number of Artwork in Collections': 4917 },
        { 'Artwork Country of Origin': 'Austria', 'Number of Artwork in Collections': 77 },
        { 'Artwork Country of Origin': 'Belgium', 'Number of Artwork in Collections': 196 },
        { 'Artwork Country of Origin': 'Czech Republic', 'Number of Artwork in Collections': 113 },
        { 'Artwork Country of Origin': 'United Kingdom', 'Number of Artwork in Collections': 700 },
        { 'Artwork Country of Origin': 'Canada', 'Number of Artwork in Collections': 24 },
        { 'Artwork Country of Origin': 'China', 'Number of Artwork in Collections': 7 },
        { 'Artwork Country of Origin': 'Denmark', 'Number of Artwork in Collections': 14 },
        { 'Artwork Country of Origin': 'Netherlands', 'Number of Artwork in Collections': 416 },
        { 'Artwork Country of Origin': 'France', 'Number of Artwork in Collections': 1165 },
        { 'Artwork Country of Origin': 'Germany', 'Number of Artwork in Collections': 737 },
        { 'Artwork Country of Origin': 'Japan', 'Number of Artwork in Collections': 65 },
        { 'Artwork Country of Origin': 'Mexico', 'Number of Artwork in Collections': 25 },
        { 'artwork country of origin': 'Norway', 'Number of Artwork in Collections': 5 },
        { 'artwork country of origin': 'Rassia', 'Number of Artwork in Collections': 45 },
        { 'artwork country of origin': 'Spain', 'Number of Artwork in Collections': 50 },
        { 'artwork country of origin': 'Sweden', 'Number of Artwork in Collections': 22 },
        { 'artwork country of origin': 'Switzerland', 'Number of Artwork in Collections': 110 },
      ];

    const getChartData = () => {
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
            .then((res) => res.json())
            .then((data) => {
                const ds = new DataSet();
                const dv = ds.createView('back').source(data, {
                    type: 'GeoJSON',
                });
                const userData = bubbleData
                const userDv = ds
                    .createView()
                    .source(userData)
                    .transform({
                        geoDataView: dv,
                        field: 'Artwork Country of Origin',
                        type: 'geo.centroid',
                        as: ['longitude', 'latitude'],
                    });
                const chart = new Chart({
                    container: 'container',
                    autoFit: true,
                    height: 500,
                });
                chart.scale({
                    longitude: {
                        sync: true,
                    },
                    latitude: {
                        sync: true,
                    },
                });
                chart.axis(false);

                chart.legend(false);
                chart.tooltip({
                    showTitle: false,
                    showMarkers: false,
                });
                const bgView = chart.createView();
                bgView.data(dv.rows);
                bgView.tooltip(false);
                bgView
                    .polygon()
                    .position('longitude*latitude')
                    .color('#cbd0d1')
                    .style({
                        lineWidth: 1,
                        stroke: '#d8e3e6',
                    });

                const userView = chart.createView();
                userView.data(userDv.rows);
                userView
                    .point()
                    .position('longitude*latitude')
                    .color('#e65c1ddb')
                    .tooltip('Artwork Country of Origin*Number of Artwork in Collections')
                    .shape('circle')
                    // .label('name', {offset: 0, style:{lineWidth: 1, stroke: '#5c1ddb',}})
                    .size('Number of Artwork in Collections', [8, 25])
                    .style({
                        lineWidth: 1,
                        stroke: '#e65c1ddb',
                    });
                    userView.interaction('element-active');
                    chart.render()
            });  
    };
    
    // return <div id="container">{isLoading ? "...loading" : data}</div>;
    return <div id="container">{data}</div>;
};

class HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            msg: "",
            painting:{},
            drawing:{},
            print:{}

            
        }
    
    }


    componentDidMount() {
        getOverview().then(res => {
            this.setState({painting: res.results[0]})
            this.setState({drawing: res.results[1]})
            this.setState({print: res.results[2]})
            this.setState({ msg: res.msg})
          })
        

    }

    render() {
    
        return (
            <div>
                <MenuBar />

                <Slider autoplay={3000} infinite={true}>
                    <div>
                    <div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.15), rgba(0, 0, 0, 0.15)),url('https://api.nga.gov/iiif/c66840d0-00b2-47d1-a4de-d157ad5712c2/full/!1200,1200/0/default.jpg')",
                    width: 1700, height: 500, backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box',
                    position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end',margin: '0 auto',
                    width: '100%'}}>
                    <Typography.Title level={1} style={{color: 'white', width: 600, textAlign:'center', position: 'absolute', top: '35%', left: "25%",
                    wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'}}>
                        {this.state.msg.substring(0,22)}</Typography.Title>
                    <Typography.Title level={1} style={{color: 'white', width: 600, textAlign:'center', position: 'absolute', top: 180, left: "25%"}}>
                        {this.state.msg.substring(22,38)}</Typography.Title>
                    <Typography.Title level={1} style={{color: 'white', width: 600, textAlign:'center', position: 'absolute', top: 230, left: "25%"}}>
                        <Button ghost><Link to={`/search`}>Explore</Link></Button></Typography.Title>
                    <Typography.Title level={3} style={{color: 'white', width: 600, textAlign:'center', position: 'absolute', top: 310, left: "25%"}}>
                        - {this.state.msg.substring(39,73)} -</Typography.Title>
                    </div></div>
                
                    <div><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.1), rgba(0, 0, 0, 0.1)),url('https://api.nga.gov/iiif/da9ff160-755f-4f9a-a78c-75727ce61a3b/full/!1200,1200/0/default.jpg')",
                    width: 1700, height: 500, backgroundSize: 'cover', backgroundPosition: 'top', boxSizing: 'border-box',
                    position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end',margin: '0 auto',
                    width: '100%'}}>
                    <Typography.Title level={2} style={{color: 'white', width: 600, textAlign:'left', position: 'absolute', top: '25%', left: "10%",
                    wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'}}>
                        Discover : </Typography.Title>
                    <Typography.Title level={3} style={{color: 'white', width: 600, textAlign:'left', position: 'absolute', top: 150, left: "10%"}}>
                        {Number(this.state.painting.artworkCounts).toLocaleString()} paintings, <br></br>
                        {Number(this.state.drawing.artworkCounts).toLocaleString()} drawings, <br></br>
                        {Number(this.state.print.artworkCounts).toLocaleString()} prints, and more...</Typography.Title>
                    <Typography.Title level={1} style={{color: 'white', width: 600, textAlign:'left', position: 'absolute', top: 230, left: "10%"}}>
                        <Button ghost><Link to={`/analysis`}>View</Link></Button></Typography.Title>
                    </div></div>

                    <div><div style={{backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.3), rgba(0, 0, 0, 0.2)),url('https://api.nga.gov/iiif/3c501c01-f1eb-42be-ac8f-21e06527c687/full/!1200,1200/0/default.jpg')",
                    width: 1700, height: 500, backgroundSize: '100%', backgroundPosition: '50% 15%', boxSizing: 'border-box',
                    display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end',margin: '0 auto',
                    width: '100%'}}>
                    <Typography.Title level={2} style={{color: 'white', width: 600, textAlign:'right', position: 'absolute', top: '50%', right: "10%",
                    wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'}}>
                        We hope you enjoy your visit! </Typography.Title>
                    <Typography.Title level={1} style={{color: 'white', width: 600, textAlign:'right', position: 'absolute', top: 230, right: "10%"}}>
                        <Button ghost><Link to={`/analysis`}>Enjoy</Link></Button></Typography.Title>
                    </div></div>
                </Slider>

                <Divider>
                    <Form style={{ width: '80vw', margin: '0 auto', minHeight: 600 }}>
                    <Row justify="space-around" align="middle">
                        <Title level={2}>Collections Around the World</Title>
                    </Row>
                        {/* console.log(<ArtMap />) */}
                        <ArtMap />
                    </Form>
                </Divider>

            </div>

        )
    }
}

export default HomePage