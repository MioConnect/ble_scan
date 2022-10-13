import React, { Component } from "react";
import { Layout, Steps, Row, Col, Button, Menu } from 'antd';
import Auth from "../auth/smart-product";
import Scanner from './scanner';
import Prepare from './prepare';
import Bind from "./bind";

const { Header, Footer, Sider, Content } = Layout;
class Index extends Component {
    constructor(props){
        super(props)

        this.state = {
            prepared: false,
            apiKey:''
        }
    }

    setPrepared = async(bool) => {
        this.setState({
            prepared: bool
        })
    }

    handleLogOut = () => {
        Auth.signOut()
            .then(data => {
                console.log("Logged out")
                this.setState({
                    prepared: false
                })
            })
            .catch(err => console.log(err));
    }

    render(){
        const {prepared} = this.state
        return(
            <div className="App">
                <Layout>
                    <Header className="ble-header">
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item
                                key={1}
                                className="da-text-color-dark-0"
                            >
                                <a onClick={this.handleLogOut}>Log Out</a>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{"height": '100vh'}}>
                        {!prepared && (
                            <Prepare prepared={this.setPrepared}/>
                        )}
                        {prepared && (
                            <Bind />
                        )}
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default Index