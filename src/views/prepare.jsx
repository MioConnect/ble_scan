import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button } from 'antd';
import Auth from "../auth/smart-product";

const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

const steps = [
    {key:"First", title:"Find an AnyHub with order number xxx"},
    {key:"Second", title:"Find a Sphygmomanometer with order number xxx"},
    {key:"Third", title:"Find a Scale with order number xxx"},
    {key:"Forth", title:"Find a Thermometer with order number xxx"},
    {key:"Fifth", title:"Find an Oximeter with order number xxx"},
    {key:"Sixth", title:"Find a Bracelet with order number xxx"}
]

class Prepare extends Component {
    constructor(props){
        super(props)

        this.state = {
            current: 0
        }
    }

    next = async() => {
        this.setState({
            current: this.state.current + 1
        })
    }

    prepared = () => {
        this.props.prepared(true)
    }

    render(){
        const {current} = this.state
        return(
            <Row>
                <Col span={18} offset={3} style={{"marginTop":'5vh'}}>
                    <h1>Welcome Please check below</h1>
                    <Steps direction="vertical" current={current}>
                        {(steps).map((item) => (
                            <Step key={item.key} title={item.title} />
                        ))}
                    </Steps>
                    {current < steps.length - 1 && (
                        <Button type="primary"  onClick={this.next}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={this.prepared}>
                            I'm Sure, Go Bind Device
                        </Button>
                    )}
                </Col>
            </Row>
        )
    }
}

export default Prepare