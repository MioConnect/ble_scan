import React, { Component, useRef } from "react";
import { Layout, Steps, Row, Col, Button, Input, notification, Space, Table } from 'antd';
import Auth from "../auth/smart-product";
import axios from "axios"
import QRCode  from 'qrcode.react';

const { Step } = Steps;
const { Header, Footer, Sider, Content } = Layout;

let steps = []
const columns = [
    {
        title: 'Device',
        dataIndex: 'device',
        key: 'device'
    },
    {
        title: 'Data Type',
        dataIndex: 'type',
        key: 'type'
    },
    {
        title: 'SN & MAC Address',
        dataIndex: 'sn',
        key: 'sn'
    }
]

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
            error: false,
            errorMessage: '',
            loading: false
        }

        steps= [
            {
                title: 'AnyHub',
                content: <div>
                    <h1>Please scan the AnyHub's SN</h1>
                    <Input key='1' id="AnyHub SN" placeholder="AnyHub SN" defaultValue={this.state.HubSn} onChange={(e)=>this.handleValueChange(e, 'HubSn')}></Input>
                </div>,
            },
            {
                title: 'Sphygmomanometer',
                content: <div>
                    <h1>Please scan the Sphygmomanometer's MAC</h1>
                    <Input key='2' placeholder="Sphygmomanometer MAC" defaultValue={this.state.mac1} onChange={(e)=>this.handleValueChange(e, 'mac1')}></Input>
                </div>,
            },
            {
                title: 'Scale',
                content: <div>
                    <h1>Please scan the Scale's MAC</h1>
                    <Input key='3' placeholder="Scale Mac" defaultValue={this.state.mac2} onChange={(e)=>this.handleValueChange(e, 'mac2')}></Input>
                </div>,
            },
            {
                title: 'Thermometer',
                content: <div>
                    <h1>Please scan the Thermometer's MAC</h1>
                    <Input key='4' placeholder="Thermometer MAC" defaultValue={this.state.mac3} onChange={(e)=>this.handleValueChange(e, 'mac3')} ></Input>
                </div>,
            },
            {
                title: 'Oximeter',
                content: <div>
                    <h1>Please scan the Oximeter's MAC</h1>
                    <Input key='5' placeholder="Oximeter MAC" defaultValue={this.state.mac4} onChange={(e)=>this.handleValueChange(e, 'mac4')}></Input>
                </div>,
            },
            {
                title: 'Bracelet',
                content: <div>
                    <h1>Please scan the Bracelet's MAC</h1>
                    <Input kwy='6' placeholder="Bracelet MAC" defaultValue={this.state.mac5} onChange={(e)=>this.handleValueChange(e, 'mac5')}></Input>
                </div>,
            },
            {
                title: 'Bind'
            },
            {
                title: 'Finish'
            }
        ]
    }

    handleValueChange = (e, value) => {
        this.setState({
            [value]: e.target.value
        })
    }

    restart = () => {
        this.setState({
            error: false,
            current: 0,
            HubSn:'',
            mac1:'',
            mac2:'',
            mac3:'',
            mac4:'',
            mac5:'',
            status: 'process',
            data: []
        })
    }

    countItemInArr = (arr, item) => {
        let count = 0
        console.log(arr)
        for(let i of arr){
            if(i === item) count++
        }
        return count
    }

    next = () => {
        let sn_mac = [this.state.HubSn, this.state.mac1, this.state.mac2, this.state.mac3, this.state.mac4, this.state.mac5]
        let mac = sn_mac[this.state.current]

        const data = [
            {key:'1',device:'AnyHub',type:'Sreial Nmber',sn:this.state.HubSn},
            {key:'2',device:'Sphygmomanometer',type:'MAC Address',sn:this.state.mac1},
            {key:'3',device:'Scale',type:'MAC Address',sn:this.state.mac2},
            {key:'4',device:'Thermometer',type:'MAC Address',sn:this.state.mac3},
            {key:'5',device:'Oximeter',type:'MAC Address',sn:this.state.mac4},
            {key:'6',device:'Bracelet',type:'MAC Address',sn:this.state.mac5},
        ]
        
        if(this.state.current === 0){
            console.log("success")
            this.setState({
                status:'process',
                current: this.state.current + 1,
                error:false
            })
        }
        else if(0 < this.state.current < 6 && mac.match('[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}') && this.countItemInArr(sn_mac, mac) === 1){
            console.log("success")
            this.setState({
                status:'process',
                current: this.state.current + 1,
                error:false,
                data: data
            })
        }
        else{
            console.log("error")
            notification['error']({
                message: 'error',
                description: 'sn or mac mismatch or duplicate, please check your input',
                className: 'custom-class',
                style: {
                    width: 600,
                },
                duration:null
            })
            this.setState({
                status: 'error',
                error: true
            })
        }
        console.log(this.state.current)
    }

    doBind = async() => {
        let sn_mac = [this.state.HubSn, this.state.mac1, this.state.mac2, this.state.mac3, this.state.mac4, this.state.mac5]
        console.log(sn_mac)
        this.setState({
            loading: true
        })
        //TODO: post request
        try{
            let apiKey = await Auth.getApiKey()
            console.log(`bind apikey:${apiKey}`)
            const options = {
                url: `https://stg.api.connect.mio-labs.com/v1/gateways/${sn_mac[0]}/peripherals`,
                method: 'POST',
                data: {
                    "TMB2084A":[sn_mac[1]],
                    "GBS2012B":[sn_mac[2]],
                    "AOJ20A":[sn_mac[3]],
                    "AOJ70B":[sn_mac[4]],
                    "IF105B4":[sn_mac[5]],
                },
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'x-api-key': apiKey
                },
            };
            const resp = await axios(options)
            console.log(resp)
            this.setState({
                current: this.state.current + 1,
                loading: false,
                error:false,
                status:'process'
            })
        }catch(err){
            notification['error']({
                message: 'error',
                description: 'Network error, please try again',
                className: 'custom-class',
                style: {
                    width: 600,
                },
                duration:null
            })
            this.setState({
                status: 'error',
                loading: false,
                error: true
            })
        }
    }

    finish = () => {
        window.location.reload()
    }

    render(){
        const{current, status, loading, error, data} = this.state
        return(
            <Row style={{"marginTop":'10vh'}}>
                <Col span={18} offset={3}>
                    <div>
                        <Steps current={current} status={status}>
                            {(steps).map((item) => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <br/>
                        <div className="steps-content">{steps[current].content}</div>
                        <div className="steps-action">
                            {}
                            {current < 6 && (
                                <>
                                    <Button type="primary" onClick={this.next}>
                                        Next
                                    </Button>
                                    {error && (
                                        <Button onClick={this.restart} style={{"marginLeft":"20px"}}>
                                            Restart
                                        </Button>
                                    )}
                                </>
                            )}
                            <br/>
                            {current === 6 && (
                                <>
                                    <h2>Please check the data in the table and click Restart in case of any error.<p/>
                                    MioConnect will bind AnyHub with Bluetooth device and generate QR code after you click the Bind button</h2>
                                    <Table columns={columns} dataSource={data} pagination={false} />
                                    <Button type="primary" loading={loading} onClick={this.doBind} style={{"marginTop":"20px"}}>
                                        Bind
                                    </Button>

                                    <Button onClick={this.restart} style={{"marginLeft":"20px"}}>
                                        Restart
                                    </Button>
  
                                </>
                            )}
                            {current === 7 && (
                                <div style={{"textAlign": "center"}}>
                                    <Row style={{"display": "block"}}>
                                        <h2>QR code has been generated, please print and paste it on the box</h2>
                                    </Row>
                                    <Row style={{"display": "block"}}>
                                        <QRCode
                                            value={this.state.HubSn}  //value参数为生成二维码的链接
                                            size={200} //二维码的宽高尺寸
                                            fgColor="#000000"  //二维码的颜色
                                        />
                                    </Row>
                                    <Row style={{"display": "block", "marginTop": "20px"}}>
                                        <Button type="primary" onClick={this.finish}>
                                            Finish
                                        </Button>
                                    </Row>
                                </div>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default Bind