import React, { useState, useEffect, useRef } from 'react';
import { getOverview } from '../fetcher'
import MenuBar from '../components/MenuBar';
import { Row, Typography, Button, Divider, Form } from 'antd'
import { Link, Redirect } from 'react-router-dom';


import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';

import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'

const { Title } = Typography;

//prepare map
const ArtMap = () => {

    const [data, setData] = useState([]);
    const [marker, setMarker] = useState([]);
    const didMount = useRef(false);

    useEffect(() => {
        getInputData();
    }, []);

    useEffect(() => {
        // Return early, if this is the first render:
        if (!didMount.current) {
            return didMount.current = true;
        }
        // Paste code to be executed on subsequent renders:
        getChartData();
    }, [marker]);

    const getInputData = () => {
        getOverview().then(res => {
            var dynamicData = [];
            for (let x in res.ArtworkOrigins) {
                console.log(x);
                console.log(res.ArtworkOrigins[x])
                dynamicData.push({
                    "Country of Origin": x,
                    "Artwork Counts in Our Gallery": res.ArtworkOrigins[x]
                });
            };
            // inputData = dynamicData
            setMarker(dynamicData);
        });
    }
        
    const getChartData = () => {
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
            .then((res) => res.json())
            .then((data) => {
                const ds = new DataSet();
                const dv = ds.createView('back').source(data, {
                    type: 'GeoJSON',
                });
                const userData = marker //use React-Hook feature useState()
                const userDv = ds
                    .createView()
                    .source(userData)
                    .transform({
                        geoDataView: dv,
                        field: 'Country of Origin',
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
                    .tooltip('Country of Origin*Artwork Counts in Our Gallery')
                    .shape('circle')
                    // .label('name', {offset: 0, style:{lineWidth: 1, stroke: '#5c1ddb',}})
                    .size('Artwork Counts in Our Gallery', [8, 25])
                    .style({
                        lineWidth: 1,
                        stroke: '#e65c1ddb',
                    });
                    userView.interaction('element-active');
                    chart.render()
            });
    };
    return <div id="container">{data}</div>;
};

class HomePage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            msg: "",
            painting: {},
            drawing: {},
            print: {},
            artworkOrigins: [] // for WorldMap display origins of artworks and their counts
        }

    }


    componentDidMount() {
        getOverview().then(res => {
            // var dynamicData = [];
            // for (let x in res.ArtworkOrigins){
            //     dynamicData.push({
            //         "Artwork Country of Origin": x,
            //         "Number of Artwork in Collections": res.ArtworkOrigins[x]
            //     });
            // };
            // this.setState({artworkOrigins: dynamicData})
            this.setState({painting: res.results[0]})
            this.setState({drawing: res.results[1]})
            this.setState({print: res.results[2]})
            this.setState({msg: res.msg})
          })
    }

    render() {

        return (
            <div>
                <MenuBar />

                <Slider autoplay={4000} infinite={true}>
                    <div>
                        <div style={{
                            backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.15), rgba(0, 0, 0, 0.15)),url('https://api.nga.gov/iiif/c66840d0-00b2-47d1-a4de-d157ad5712c2/full/!1200,1200/0/default.jpg')",
                            width: 1700, height: 500, backgroundSize: 'cover', backgroundPosition: 'center', boxSizing: 'border-box',
                            position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', margin: '0 auto',
                            width: '100%'
                        }}>
                            <Typography.Title level={1} style={{
                                color: 'white', width: 600, textAlign: 'center', position: 'absolute', top: '35%', left: "30%",
                                wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'
                            }}>
                                {this.state.msg.substring(0, 22)}</Typography.Title>
                            <Typography.Title level={1} style={{ color: 'white', width: 600, textAlign: 'center', position: 'absolute', top: 180, left: "30%" }}>
                                {this.state.msg.substring(22, 38)}</Typography.Title>
                            <Typography.Title level={1} style={{ color: 'white', width: 600, textAlign: 'center', position: 'absolute', top: 230, left: "30%" }}>
                                <Button ghost><Link to={`/search`}>Explore</Link></Button></Typography.Title>
                            <Typography.Title level={3} style={{ color: 'white', width: 600, textAlign: 'center', position: 'absolute', top: 310, left: "30%" }}>
                                - {this.state.msg.substring(39, 73)} -</Typography.Title>
                        </div></div>

                    <div><div style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.1), rgba(0, 0, 0, 0.1)),url('https://api.nga.gov/iiif/da9ff160-755f-4f9a-a78c-75727ce61a3b/full/!1200,1200/0/default.jpg')",
                        width: 1700, height: 500, backgroundSize: 'cover', backgroundPosition: 'top', boxSizing: 'border-box',
                        position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', margin: '0 auto',
                        width: '100%'
                    }}>
                        <Typography.Title level={2} style={{
                            color: 'white', width: 600, textAlign: 'left', position: 'absolute', top: '25%', left: "10%",
                            wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'
                        }}>
                            Discover : </Typography.Title>
                        <Typography.Title level={3} style={{ color: 'white', width: 600, textAlign: 'left', position: 'absolute', top: 150, left: "10%" }}>
                            {Number(this.state.painting.artworkCounts).toLocaleString()} paintings, <br></br>
                            {Number(this.state.drawing.artworkCounts).toLocaleString()} drawings, <br></br>
                            {Number(this.state.print.artworkCounts).toLocaleString()} prints, and more...</Typography.Title>
                        <Typography.Title level={1} style={{ color: 'white', width: 600, textAlign: 'left', position: 'absolute', top: 230, left: "10%" }}>
                            <Button ghost><Link to={`/analysis`}>View</Link></Button></Typography.Title>
                    </div></div>

                    <div><div style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(256, 256, 256, 0.3), rgba(0, 0, 0, 0.2)),url('https://api.nga.gov/iiif/3c501c01-f1eb-42be-ac8f-21e06527c687/full/!1200,1200/0/default.jpg')",
                        width: 1700, height: 500, backgroundSize: '100%', backgroundPosition: '50% 15%', boxSizing: 'border-box',
                        display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', margin: '0 auto',
                        width: '100%'
                    }}>
                        <Typography.Title level={2} style={{
                            color: 'white', width: 600, textAlign: 'right', position: 'absolute', top: '50%', right: "10%",
                            wordBreak: 'normal', whiteSpace: 'normal', overflowWrap: 'break-word'
                        }}>
                            We hope you enjoy your visit! </Typography.Title>
                        <Typography.Title level={1} style={{ color: 'white', width: 600, textAlign: 'right', position: 'absolute', top: 230, right: "10%" }}>
                            <Button ghost><Link to={`/analysis`}>Enjoy</Link></Button></Typography.Title>
                    </div></div>
                </Slider>

                <Divider>
                    <Form style={{ width: '80vw', margin: '0 auto', minHeight: 600 }}>
                        <Row justify="space-around" align="middle">
                            <Title level={2}>Collections Around the World</Title>
                        </Row>
                        <ArtMap />
                    </Form>
                </Divider>

            </div>

        )
    }
}

export default HomePage