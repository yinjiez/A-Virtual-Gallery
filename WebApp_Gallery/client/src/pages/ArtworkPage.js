import React from 'react';
import { ColorExtractor } from 'react-color-extractor';

import {
    Row,
    Col,
    Divider,
    Tag,
    Typography

} from 'antd'

import { getArtwork, getSimilarArtworks } from '../fetcher'

import MenuBar from '../components/MenuBar';


const SWATCHES_STYLES = {
    marginTop: 20,
    display: "flex",
    justifyContent: "center"
};

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
            selectedObjectID: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            colors: [],
            err1: false, //when no such objectID exists - print error message
            err2: false, //when no similar artwork is found - won't render the recommendation at all

        }

        this.goToArtwork = this.goToArtwork.bind(this)

    }

    goToArtwork(objectID) {
        window.location = `/artwork?objectID=${objectID}`
    }

    renderSwatches = () => {
        return this.state.colors.map((color, id) => {
          return (
            <div
              key={id}
              style={{
                backgroundColor: color,
                width: 100,
                height: 100
              }}
            />
          )
        })
    }
    
    getColors = (colors => {
        this.setState(state => ({ colors: [...state.colors, ...colors] }))
    })


    componentDidMount() {
        getArtwork(this.state.selectedObjectID).then(res => {
            //edge case 1: no "?objectID" in URL (i.e. /artwork) => store & render default results
            //edge case 2: invalid objectID in URL => no result fetched => render error message
            if (this.state.selectedObjectID != 0 && res.results_P1.length == 0){
                this.setState({err1: true})
            } else {
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
            }
        })
        

        getSimilarArtworks(this.state.selectedObjectID).then(res => {
            if ((res.results_P1 === "NOTHING" && res.results_P2 === "NOTHING")|| (res.results_P1.length==0 && res.results_P2.length==0)){
                this.setState({err2: true})
            } else if (res.results_P1.length == 0){
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
            } else {
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
            // this.setState({err2: true})})
    }

    
    render() {
        if (this.state.err1){
            return ("Sorry, this object doesn't exist. Please try again.");
        } else {
            return (
                <div>
                    <MenuBar />
                    <Row justify="space-around" align="middle">
                        <Col span={12} style={{textAlign: 'center'}}>
                        <div>
                        <ColorExtractor getColors={this.getColors}>
                        <img width={600} src={this.state.P1.URL}></img>
                        </ColorExtractor>
                        <div style={SWATCHES_STYLES}>{this.renderSwatches()}</div>
                        </div>
                        </Col>
                        <Col span={12} style={{ textAlign: 'left' }}>
                            {/* margin: top, right, bottom, left */}
                            <Typography.Title level={2} style={{ margin: "20px 20px 20px 0px" }}>
                            {this.state.P1.title}
                            </Typography.Title>
                            <Typography.Title level={4} italic="True" underline="True" style={{ margin: "20px 20px 20px 0px" }}>
                            {this.state.P1.attribution}
                            </Typography.Title>
                            {this.state.P1.medium && <div>
                            <th scope="row">Medium</th><p>{this.state.P1.medium}</p><Divider></Divider>
                            </div>}
                            {this.state.P1.dimensions && <div>
                            <th scope="row">Dimensions</th><p>{this.state.P1.dimensions}</p><Divider></Divider>
                            </div>}
                            {this.state.P1.classification && <div>
                            <th scope="row">Classfication</th><p>{this.state.P1.classification}</p><Divider></Divider>
                            </div>}
                            {this.state.P1.series && <div>
                            <th scope="row">Series</th><p>{this.state.P1.series}</p><Divider></Divider>
                            </div>}
                            {this.state.P1.portfolio && <div>
                            <th scope="row">Portfolio</th><p>{this.state.P1.portfolio}</p><Divider></Divider>
                            </div>}
                            {this.state.P1.volume && <div>
                            <th scope="row">Volume</th><p>{this.state.P1.volume}</p><Divider></Divider>
                            </div>}
                            {this.state.P2_artist_1.preferredDisplayName && <div>
                            <th scope="row">Artist(s)</th>
                            <text>
                            {this.state.P2_artist_1.preferredDisplayName}, {this.state.P2_artist_1.displayDate}, {this.state.P2_artist_1.visualBrowserNationality}</text><br/>
                            {this.state.P2_artist_2.preferredDisplayName && <text>
                            {this.state.P2_artist_2.preferredDisplayName}, {this.state.P2_artist_2.displayDate}, {this.state.P2_artist_2.visualBrowserNationality}</text>}<br/>
                            {this.state.P2_artist_3.preferredDisplayName && <text>
                            {this.state.P2_artist_3.preferredDisplayName}, {this.state.P2_artist_3.displayDate}, {this.state.P2_artist_3.visualBrowserNationality}, Et al.</text>}                      
                            <Divider></Divider>
                            </div>}
                            {this.state.P3 && <div>
                            <th scope="row">Keywords</th>
                            <ul style={{padding: 0}}>
                            {this.state.P3.map(term => <Tag color="purple" key={term}> {term} </Tag>)}
                            </ul>
                            </div>}
                        </Col>
                    </Row>
                    <Row>
                    {!this.state.err2 && <Typography.Title level={4} style={{ margin: "10px 20px 10px 70px" }}>You may also like:</Typography.Title>}
                    </Row>
                    <Row justify="space-around" align="middle">
                        <Col span={6} style={{textAlign: 'center'}}>
                        <figure>
                        <a onClick={() => this.goToArtwork(this.state.similarArtwork_1.objectID)}><img src={this.state.similarArtwork_1.thumbURL}height="200"></img>
                        <figcaption><u>{this.state.similarArtwork_1.title}</u></figcaption></a>
                        </figure>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                        <figure>
                        <a onClick={() => this.goToArtwork(this.state.similarArtwork_2.objectID)}><img src={this.state.similarArtwork_2.thumbURL}height="200"></img>
                        <figcaption><u>{this.state.similarArtwork_2.title}</u></figcaption></a>
                        </figure>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                        <figure>
                        <a onClick={() => this.goToArtwork(this.state.similarArtwork_3.objectID)}><img src={this.state.similarArtwork_3.thumbURL}height="200"></img>
                        <figcaption><u>{this.state.similarArtwork_3.title}</u></figcaption></a>
                        </figure>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                        <figure>
                        <a onClick={() => this.goToArtwork(this.state.similarArtwork_4.objectID)}><img src={this.state.similarArtwork_4.thumbURL}height="200"></img>
                        <figcaption><u>{this.state.similarArtwork_4.title}</u></figcaption></a>
                        </figure>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}

export default ArtworkPage

