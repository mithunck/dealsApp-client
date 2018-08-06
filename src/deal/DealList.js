import React, { Component } from 'react';
import { getAllDeals } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon,Card,notification } from 'antd';
import { DEAL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './DealList.css';
import Deal from './Deal'

class DealList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deals: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadDealList = this.loadDealList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadDealList(page = 0, size = DEAL_LIST_SIZE) {
        let promise;
    
        promise = getAllDeals(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const deals = this.state.deals.slice();

            this.setState({
                deals: deals.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentWillMount() {
        this.loadDealList();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                deals: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
            this.loadDealList();
        }
    }

    handleLoadMore() {
        this.loadDealList(this.state.page + 1);
    }

    render() {
        const dealViews = [];
        this.state.deals.forEach((deal, dealIndex) => {
            dealViews.push(<Deal key={deal.id} 
                deal={deal}/>)            
        });

        return (
            <div className="deals-container">
                {dealViews}
                {
                    !this.state.isLoading && this.state.deals.length === 0 ? (
                        <div className="no-deals-found">
                            <span>No deals Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-deals"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(DealList);