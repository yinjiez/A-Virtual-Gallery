import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Row,
    Col,
    Divider,
    Image,
    Tag,
    Typography

} from 'antd'

import { getArtwork, getSimilarArtworks } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


class ArtworkPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        //getting object ID from url: ...artwork?objectID=${objectID}
        //window.location.search: ?objectID=${objectID}
        //substring(1): objectID=${objectID}
        //after split: ["objectID", objectID]; index 1 gets the object ID
            P1: [],
            P2_artist_1: [],
            P2_artist_2: [],
            P2_artist_3: [],
            P3: [],
            similarArtwork_1: [],
            similarArtwork_2: [],
            similarArtwork_3: [],
            similarArtwork_4: [],
            selectedObjectID: window.location.search ? window.location.search.substring(1).split('=')[1] : 0

        }

        this.goToArtwork = this.goToArtwork.bind(this)
        this.updateArtwork = this.updateArtwork.bind(this)
    }

    goToArtwork(objectID) {
        window.location = `/artwork?objectID=${objectID}`
    }

    updateArtwork() {
        getArtwork(this.state.selectedObjectID).then(res => {
            this.setState({ P1: res.results_P1[0]})
            this.setState({ P2_artist_1: res.results_P2[0]})
            if (res.results_P2.length > 1){
            this.setState({ P2_artist_2: res.results_P2[1]})
            }
            if (res.results_P2.length > 2){
            this.setState({ P2_artist_3: res.results_P2[2]})
            }
            if (res.results_P3.length > 0){
                var li = []
                for (let i = 0; i < res.results_P3.length; i++ ){
                    li.push(res.results_P3[i].term)
                    this.setState({P3: li})
                }
            }
        })

        getSimilarArtworks(this.state.selectedObjectID).then(res => {
            if (res.results_P1 === "NOTHING"){
                this.setState({similarArtworks: "This artwork is one of its kind!"})
            } else if (res.results_P1 == null){
                this.setState({ similarArtwork_1: res.results_P2[0]})
                if (res.results_P2.length > 3){
                    this.setState({ similarArtwork_4: res.results_P2[3]})
                }
                if (res.results_P2.length > 2){
                    this.setState({ similarArtwork_3: res.results_P2[2]})
                }
                if (res.results_P2.length > 1){
                    this.setState({ similarArtwork_2: res.results_P2[1]})
                }
            } else{
                this.setState({ similarArtwork_1: res.results_P1[0]})
                if (res.results_P1.length > 3){
                    this.setState({ similarArtwork_4: res.results_P1[3]})
                }
                if (res.results_P1.length > 2){
                    this.setState({ similarArtwork_3: res.results_P1[2]})
                }
                if (res.results_P1.length > 1){
                    this.setState({ similarArtwork_2: res.results_P1[1]})
                }
            }
        })

    }

    componentDidMount() {
        getArtwork(this.state.selectedObjectID).then(res => {
            this.setState({ P1: res.results_P1[0]})
            this.setState({ P2_artist_1: res.results_P2[0]})
            if (res.results_P2.length > 1){
            this.setState({ P2_artist_2: res.results_P2[1]})
            }
            if (res.results_P2.length > 2){
            this.setState({ P2_artist_3: res.results_P2[2]})
            }
            if (res.results_P3.length > 0){
                var li = []
                for (let i = 0; i < res.results_P3.length; i++ ){
                    li.push(res.results_P3[i].term)
                    this.setState({P3: li})
                }
            }
        })

        getSimilarArtworks(this.state.selectedObjectID).then(res => {
            if (res.results_P1 === "NOTHING"){
                this.setState({similarArtworks: "This artwork is one of its kind!"})
            } else if (res.results_P1 == null){
                this.setState({ similarArtwork_1: res.results_P2[0]})
                if (res.results_P2.length > 3){
                    this.setState({ similarArtwork_4: res.results_P2[3]})
                }
                if (res.results_P2.length > 2){
                    this.setState({ similarArtwork_3: res.results_P2[2]})
                }
                if (res.results_P2.length > 1){
                    this.setState({ similarArtwork_2: res.results_P2[1]})
                }
            } else{
                this.setState({ similarArtwork_1: res.results_P1[0]})
                if (res.results_P1.length > 3){
                    this.setState({ similarArtwork_4: res.results_P1[3]})
                }
                if (res.results_P1.length > 2){
                    this.setState({ similarArtwork_3: res.results_P1[2]})
                }
                if (res.results_P1.length > 1){
                    this.setState({ similarArtwork_2: res.results_P1[1]})
                }
            }
        })
    }


    render() {
        return (
            <div>
                <MenuBar />
                
                <Row justify="space-around" align="middle">
                    <Col span={12} style={{textAlign: 'center'}}>
                    <img
                    width={600}
                    src={this.state.P1.URL}
                    />
                    </Col>
                    <Col span={12} style={{ textAlign: 'left' }}>
                        {/* margin: top, right, bottom, left */}
                        <Typography.Title level={2} style={{ margin: "20px 20px 20px 0px" }}>
                        {this.state.P1.title}
                        </Typography.Title>
                        <Typography.Title level={4} italic="True" underline="True" style={{ margin: "20px 20px 20px 0px" }}>
                        {this.state.P1.attribution}
                        </Typography.Title>
                        <th scope="row">Medium</th>
                        <p>
                        {this.state.P1.medium}
                        </p>
                        <Divider orientation="left"></Divider>
                        <th scope="row">Dimensions</th>
                        <p>
                        {this.state.P1.dimensions}
                        </p>
                        <Divider orientation="left"></Divider>
                        <th scope="row">Classfication</th>
                        <p>
                        {this.state.P1.classification}
                        </p>
                        <Divider orientation="left"></Divider>
                        <th scope="row">Series</th>
                        <p>
                        {this.state.P1.series}
                        </p>
                        <Divider orientation="left" ></Divider>
                        <th scope="row">Portfolio</th>
                        <p>
                        {this.state.P1.portfolio}
                        </p>
                        <Divider orientation="left"></Divider>
                        <th scope="row">Volume</th>
                        <p>
                        {this.state.P1.volume}
                        </p>
                        <Divider orientation="left"></Divider>
                        <th scope="row">Artists</th>
                        <text>
                        {this.state.P2_artist_1.preferredDisplayName}, {this.state.P2_artist_1.displayDate}, {this.state.P2_artist_1.visualBrowserNationality}</text><br/>
                        {this.state.P2_artist_2.preferredDisplayName && <text>
                        {this.state.P2_artist_2.preferredDisplayName}, {this.state.P2_artist_2.displayDate}, {this.state.P2_artist_2.visualBrowserNationality}</text>}<br/>
                        {this.state.P2_artist_3.preferredDisplayName && <text>
                        {this.state.P2_artist_3.preferredDisplayName}, {this.state.P2_artist_3.displayDate}, {this.state.P2_artist_3.visualBrowserNationality}, Et al.</text>}                      
                        <Divider orientation="left"></Divider>
                        <th scope="row">Keywords</th>
                        <ul style={{padding: 0}}>
                        {this.state.P3 && this.state.P3.map(term => <Tag color="purple" key={term}> {term} </Tag>)}
                        </ul>
                    </Col>
                </Row>
                <Row>
                <Col span={24}> SWATCHES
                
                
                
                </Col>
                </Row>
                <Row justify="space-around" align="middle">
                    <Col span={6} style={{textAlign: 'center'}}>
                    <figure>
                    <a><img src={this.state.similarArtwork_1.thumbURL} onClick={() => this.goToArtwork(this.state.similarArtwork_1.objectID)}
                    height="200"></img></a>
                    <figcaption>{this.state.similarArtwork_1.title}</figcaption>
                    </figure>
                    </Col>
                    <Col span={6} style={{textAlign: 'center'}}>
                    <figure>
                    <a><img src={this.state.similarArtwork_2.thumbURL} onClick={() => this.goToArtwork(this.state.similarArtwork_2.objectID)}
                    height="200"></img></a>
                    <figcaption>{this.state.similarArtwork_2.title}</figcaption>
                    </figure>
                    </Col>
                    <Col span={6} style={{textAlign: 'center'}}>
                    <figure>
                    <a><img src={this.state.similarArtwork_3.thumbURL} onClick={() => this.goToArtwork(this.state.similarArtwork_3.objectID)}
                    height="200"></img></a>
                    <figcaption>{this.state.similarArtwork_3.title}</figcaption>
                    </figure>
                    </Col>
                    <Col span={6} style={{textAlign: 'center'}}>
                    <figure>
                    <a><img src={this.state.similarArtwork_4.thumbURL} onClick={() => this.goToArtwork(this.state.similarArtwork_4.objectID)}
                    height="200"></img></a>
                    <figcaption>{this.state.similarArtwork_4.title}</figcaption>
                    </figure>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default ArtworkPage

