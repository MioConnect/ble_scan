import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button } from 'antd';


import Scanner from './scanner';
import Prepare from './prepare';
import Bind from "./bind";

class Index extends Component {
    constructor(props){
        super(props)

        this.state = {
            prepared: false
        }
    }

    setPrepared = (bool) => {
        this.setState({
            prepared: bool
        })
    }

    render(){
        const {prepared} = this.state
        return(
            <div>
                {!prepared && (
                    <Prepare prepared={this.setPrepared}/>
                )}
                {prepared && (
                    <Bind />
                )}
            </div>
        )
    }
}

export default Index