import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button, Checkbox, Divider } from 'antd';
import Auth from "../auth/smart-product";

const CheckboxGroup = Checkbox.Group;

const plainOptions = [
    'Find an AnyHub with order number xxx',
    'Find a Sphygmomanometer with order number xxx',
    'Find a Scale with order number xxx',
    'Find a Thermometer with order number xxx',
    'Find an Oximeter with order number xxx',
    'Find a Bracelet with order number xxx'
];

class Prepare extends Component {
    constructor(props){
        super(props)

        this.state = {
            current: 0,
            AnyHub:false,
            Sphygmomanometer: false,
            Scale: false,
            Thermometer: false,
            Oximeter: false,
            Bracelet: false,
            indeterminate: true,
            checkAll: false,
            checkedList: []
        }
    }

    prepared = () => {
        this.props.prepared(true)
    }

    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked
        })
    }

    onChange = (list) => {
        this.setState({
            checkedList:list,
            indeterminate: !!list.length && list.length < plainOptions.length,
            checkAll: list.length === plainOptions.length
        })
    }

    render(){
        const {indeterminate, checkAll, checkedList} = this.state
        return(
            <Row>
                <Col span={18} offset={3} style={{"marginTop":'5vh'}}>
                    <h1>Welcome Please check below</h1>
                    <Row style={{"textAlign": "left"}}>
                        <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
                            Check all
                        </Checkbox>
                    </Row>
                    <Divider />
                    <Row style={{"textAlign": "left"}}>
                        <CheckboxGroup options={plainOptions} value={checkedList} onChange={this.onChange} />
                    </Row>
                    {checkAll && (
                        <Button type="primary" style={{"marginTop": "25px"}} onClick={this.prepared}>
                            I'm Sure, Go Bind Device
                        </Button>
                    )}
                </Col>
            </Row>
        )
    }
}

export default Prepare