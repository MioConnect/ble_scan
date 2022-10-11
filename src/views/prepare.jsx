import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button } from 'antd';
import Auth from "../auth/smart-product";

const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

const steps = [
    {key:"First", title:"找出订单号为xxx的一台AnyHub"},
    {key:"Second", title:"找出订单号为xxx的一台血压计"},
    {key:"Third", title:"找出订单号为xxx的一台体脂称"},
    {key:"Forth", title:"找出订单号为xxx的一台温度计"},
    {key:"Fifth", title:"找出订单号为xxx的一台血氧仪"},
    {key:"Sixth", title:"找出订单号为xxx的一台手环"}
]

class Prepare extends Component {
    constructor(props){
        super(props)

        this.state = {
            current: 0
        }
    }

    next = () => {
        Auth.getApiKey()
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