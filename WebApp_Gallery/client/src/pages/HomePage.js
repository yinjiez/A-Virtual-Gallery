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


// class HomePage extends React.Component {
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
                       
//                 </Divider>

//                 <Divider>
                    
//                 </Divider>


//             </div>

//         )
//     }
// }

// export default HomePage