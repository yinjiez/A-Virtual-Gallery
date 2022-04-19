import React, { useState, useEffect } from 'react';
import { getOverview } from '../fetcher'
import MenuBar from '../components/MenuBar';
import {Row, Typography, Button} from 'antd'
import {Link, Redirect} from 'react-router-dom';


import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';

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
            </div>

        )
    }
}

export default HomePage