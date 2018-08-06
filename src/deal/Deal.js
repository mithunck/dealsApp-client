import React, { Component } from 'react';
import{Card} from 'antd'
import './Deal.css';

class Deal extends Component{
    render(){
        return(
            <Card title={this.props.deal.title}>
                  <p>{this.props.deal.link}</p>
                  <p>Card content</p>
            </Card>
          );
    }
}
export default Deal