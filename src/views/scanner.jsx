import React, { Component } from "react";
import jsQR from "jsqr";
import { Button, Tooltip, Layout, Progress, Col, Row } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

let scanner = null;

let video = null;
let canvasElement = null;
let canvas = null;
let loadingMessage = null;
let outputContainer = null;
let outputData = null;
let mediaStreamTrack = null;

class Scanner extends Component {

    constructor(props){
        super(props)

        this.state = {
            readyForScan: true,
            progress: 0
        }
    }

    componentDidMount() {
      video = document.createElement('video');
      canvasElement = document.getElementById('canvas');
      canvas = canvasElement.getContext('2d');
      loadingMessage = document.getElementById('loadingMessage');
      outputContainer = document.getElementById('output');
      outputData = document.getElementById('outputData');
  
      console.log(navigator.mediaDevices )

    }

    start_scan = () => {
        const that = this;
        that.setState({
            readyForScan:false
        })
        // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
  
        // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
        // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先，如果有getUserMedia的话，就获得它
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
    
            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
            };
        }
        navigator.mediaDevices
        .getUserMedia({ audio: false, video: { facingMode: "environment" } })
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          video.srcObject = stream;
          mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          video.setAttribute('playsinline', true); // required to tell iOS safari we don’t want fullscreen
          video.play();
          window.requestAnimationFrame(that.tick);
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }

    handleStartCode = () => {
      scanner.start();
    };
  
    componentWillUnmount() {}
  
    drawLine = (begin, end, color) => {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    };
  
    tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
  
        canvasElement.height = video.videoHeight * 0.7;
        canvasElement.width = video.videoWidth * 0.7;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {});
        if (code && code.data) {
          console.log(code);
          this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
          
          outputContainer.hidden = false;
          outputData.innerText = code.data;
          mediaStreamTrack && mediaStreamTrack.stop() // 可通过mediaStreamTrack停止摄像头的调用
          canvasElement.hidden = true
        } else {
          
        }
      }
      window.requestAnimationFrame(this.tick);
    };
  
    render() {
      const{ progress, readyForScan } = this.state
      return (
        <Layout>
            {/* <Header/> */}
            <Content style={{"height": "100vh"}}>
                <Row>
                    <Col span={18} offset={3}>
                    <div style={{"height":"20vh"}}>
                        <h1>1.AnyHub</h1>
                    </div>
                    <div style={{"height":"50vh"}}>
                        {readyForScan && 
                            <Button className="scan" type="primary" shape="circle" size="large" onClick={this.start_scan}>scan</Button>
                        }
                        <canvas id="canvas" hidden></canvas>
                        <div id="output" hidden >
                            <div>
                                <b>Data:</b> <span id="outputData"></span>
                            </div>
                        </div>
                    </div>
                    <Progress percent={progress}/>
                    </Col>
                </Row>
            </Content>
            {/* <Footer/> */}
        </Layout>
      );
    }
  }

export default Scanner