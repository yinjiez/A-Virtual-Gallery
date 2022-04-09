import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getArtwork, getSimilarArtworks } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


class ArtworkPage extends React.Component {
    constructor(props) {
        super(props)
            this.state = {
            //getting object ID from url: ...artwork?id=${objectID}
            //window.location.search: ?id=${objectID}
            //substring(1): id=${objectID}
            //after split: [id, objectID]; index 1 gets the object ID
            objectID: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            artwork_P1: null,
            artwork_P2: null,
            artwork_P3: null,
            similarDetails: null,
        }
    }

    componentDidMount() {
        getArtwork(this.state.objectID).then(res => {
            this.setState({objectID: res.results[0] })
        })

        getSimilarArtworks(this.state.objectID).then(res => {
            this.setState({objectID: res.results[0] })
        })
    }


    render() {
        return (
            <div>
                <MenuBar />
                
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Home Team</label>
                            <FormInput placeholder="Home Team" value={this.state.homeQuery} onChange={this.handleHomeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Away Team</label>
                            <FormInput placeholder="Away Team" value={this.state.awayQuery} onChange={this.handleAwayQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>
                </Form>

                <Divider />
                {/* TASK 12: Copy over your implementation of the matches table from the home page */}
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>Matches</h3>
                    <Table onRow={(record, rowIndex) => { return {onClick: event => {this.goToMatch(record.MatchId)},  }; } } 
                            dataSource={this.state.matchesResults} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                            <ColumnGroup title="Teams">
                                <Column title="H" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/> 
                                <Column title="A" dataIndex="Away" key="Away" sorter= {(a, b) => a.Away.localeCompare(b.Away)}/>
                            </ColumnGroup>
                                            
                            <ColumnGroup title="Goals">
                                <Column title="HomeGoals" dataIndex="HomeGoals" key="HomeGoals" sorter= {(a, b) => a.HomeGoals - b.HomeGoals}/>
                                <Column title="AwayGoals" dataIndex="AwayGoals" key="AwayGoals" sorter= {(a, b) => a.AwayGoals - b.AwayGoals}/>
                            </ColumnGroup>
                            
                            <Column title="Date" dataIndex="Date" key="Date"/>
                            <Column title="Time" dataIndex="Time" key="Time"/>
                    </Table>
                    </div>
                <Divider />

                {this.state.selectedMatchDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    
                    <Card>
                        <CardBody>
                            {/****** ROW: Home vs. Away Team ********/}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Home}</CardTitle>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'center' }}>
                                    {this.state.selectedMatchDetails.Date} at {this.state.selectedMatchDetails.Time}
                                </Col>
                                {/* TASK 13: Add a column with flex = 2, and text alignment = right to display the name of the away team - similar to column 1 in this row */}
                                <Col flex={2} style={{ textAlign: 'right' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Away}</CardTitle>
                                </Col>
                            </Row>
                            
                            {/****** ROW: Goals (full-time) ********/}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedMatchDetails.HomeGoals}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals
                                </Col >
                                {/* TASK 14: Add a column with span = 9, and text alignment = right to display the # of goals the away team scored - similar 1 in this row */}
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.selectedMatchDetails.AwayGoals}</h3>
                                </Col>
                            </Row>
                            
                            {/* TASK 15: create a row for goals at half time similar to the row for 'Goals' above, but use h5 in place of h3!  */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.HTHomeGoals}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals (Half-Time)
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.HTAwayGoals}</h5>
                                </Col>
                            </Row>
                            
                            {/****** ROW: Shot Accuracy with Progress-Bar-Visualization ********/}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <Progress value={this.state.selectedMatchDetails.ShotsOnTargetHome * 100 / this.state.selectedMatchDetails.ShotsHome}>{this.state.selectedMatchDetails.ShotsOnTargetHome} / {this.state.selectedMatchDetails.ShotsHome}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Shot Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    {/* TASK 18: add a progress bar to display the shot accuracy for the away team -  look at the progress bar in column 1 of this row for reference*/}
                                    <Progress value={this.state.selectedMatchDetails.ShotsOnTargetAway * 100 / this.state.selectedMatchDetails.ShotsAway}>{this.state.selectedMatchDetails.ShotsOnTargetAway} / {this.state.selectedMatchDetails.ShotsAway}</Progress>
                                </Col>
                            </Row>
                            
                            {/****** ROW: Corner Shots ********/}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Corners
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersAway}</h5>
                                </Col>
                            </Row>
                            
                            {/* TASK 16: add a row for fouls cards - check out the above lines for how we did it for corners */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Fouls
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsAway}</h5>
                                </Col>
                            </Row>

                            {/****** ROW: Red Cards ********/}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.RCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Red Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.RCAway}</h5>
                                </Col>
                            </Row>
                            
                            {/* TASK 17: add a row for yellow cards - check out the above lines for how we did it for red cards */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.YCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Yellow Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.YCAway}</h5>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    
                </div> : null}
                
                <Divider />

            </div>
        )
    }
}

export default MatchesPage

