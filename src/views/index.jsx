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
            prepared: false
        }
    }

    setPrepared = (bool) => {
        this.setState({
            prepared: bool
        })
    }

    handleLogOut = () => {
        Auth.signOut()
            .then(data => {
                this.logger.debug("Logged out")
                this.setState({
                    prepared: false
                })
                window.location.href = '/';
            })
            .catch(err => this.logger.error(err));
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