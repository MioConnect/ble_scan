import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button, Input } from 'antd';

const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

let steps = []

class Bind extends Component {
    constructor(props){
        super(props)

        this.state={
            current:0,
            status:'',
            bind: false,
            HubSn:'',
            mac1:'',
            mac2:'',
            mac3:'',
            mac4:'',
            mac5:'',
        }

        steps= [
            {
                title: 'AnyHub',
                content: <div>
                    <h1>Please input the AnyHub SN</h1>
                    <Input id="AnyHub SN" placeholder="AnyHub SN" defaultValue={this.state.HubSn} onChange={(e)=>this.handleValueChange(e, 'HubSn')}></Input>
                </div>,
            },
            {
                title: '血压计',
                content: <div>
                    <h1>Please input the 血压计Mac</h1>
                    <Input id="血压计Mac" placeholder="血压计Mac" defaultValue={this.state.mac1} onChange={(e)=>this.handleValueChange(e, 'mac1')}></Input>
                </div>,
            },
            {
                title: '体脂称',
                content: <div>
                    <h1>Please input the 体脂称Mac</h1>
                    <Input placeholder="体脂称Mac" defaultValue={this.state.mac2} onChange={(e)=>this.handleValueChange(e, 'mac2')}></Input>
                </div>,
            },
            {
                title: '体温计',
                content: <div>
                    <h1>Please input the 体温计Mac</h1>
                    <Input placeholder="体温计Mac" defaultValue={this.state.mac3} onChange={(e)=>this.handleValueChange(e, 'mac3')} ></Input>
                </div>,
            },
            {
                title: '血氧仪',
                content: <div>
                    <h1>Please input the 血氧仪Mac</h1>
                    <Input placeholder="血氧仪Mac" defaultValue={this.state.mac4} onChange={(e)=>this.handleValueChange(e, 'mac4')}></Input>
                </div>,
            },
            {
                title: '手环',
                content: <div>
                    <h1>Please input the 手环Mac</h1>
                    <Input placeholder="手环Mac" defaultValue={this.state.mac5} onChange={(e)=>this.handleValueChange(e, 'mac5')}></Input>
                </div>,
            },
            {
                title: 'do bind'
            }
        ]
    }

    handleValueChange = (e, value) => {
        this.setState({
            [value]: e.target.value
        })
    }

    next = () => {
        let sn_mac = [this.state.HubSn, this.state.mac1, this.state.mac2, this.state.mac3, this.state.mac4, this.state.mac5]
        let mac = sn_mac[this.state.current]
        if(mac === '11:23'){
            console.log("success")
            this.setState({
                status:'process',
                current: this.state.current + 1
            })
        }
        else{
            console.log("error")
            this.setState({
                status: 'error',
            })
        }
        console.log(this.state.current)
    }

    doBind = () => {

    }

    render(){
        const{current, status} = this.state
        return(
            <Layout>
                <Content style={{"height": '100vh'}}>
                    <Row style={{"marginTop":'10vh'}}>
                        <Col span={18} offset={3}>
                            <div>
                                <Steps current={current} status={status}>
                                    {(steps).map((item) => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps>
                                <div className="steps-content">{steps[current].content}</div>
                                <div className="steps-action">
                                    {current < steps.length - 1 && (
                                        <Button type="primary" onClick={this.next}>
                                            Next
                                        </Button>
                                    )}
                                    {current === 6 && (
                                        <Button type="primary" onClick={this.doBind}>
                                            Bind
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }
}

export default Bind