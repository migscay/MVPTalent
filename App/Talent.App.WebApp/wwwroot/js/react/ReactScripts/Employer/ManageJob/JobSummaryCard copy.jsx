import React from 'react';
import Cookies from 'js-cookie';
import { Popup,Grid,Label,Icon,Button,Header } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        this.state = {
            expired: false,
            employerJob: null
        }
    }

    componentDidMount() {
        let expired = moment().isAfter(this.props.employerJob.expiryDate);
        const data = Object.assign({}, this.state)
        data['expired'] = expired
        data['employerJob'] = this.props.employerJob
        this.setState({
            expired: expired,
            employerJob: this.props.employerJob
        })
    };

    selectJob(id) {
        // if (this.state.closeMode) {
            alert(`about to close job ${this.state.employerJob.id}`)
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({ 
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.employerJob.id),
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    TalentUtil.notification.show("Job closed successfully", "success", null, null);
                    this.setState({
                        employerJob: {
                            status: 1
                        }
                    })            
                }
                else {
                    TalentUtil.notification.show("Error while closing Job", "error", null, null);
                }
            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show("Error while closing Job", "error", null, null);
                // callback();
            }
            })     
        // } else {
        //     this.setState({
        //         closeMode: true
        //     })
        // }
    }

    render() {
        {console.log(`this.state.employerJob ${this.state.employerJob}`)}
        return (
            <div className="ui wide card">
                <div className="content">      
                    <div className="header">      
                        {this.state.employerJob.title}
                    </div>
                    <Label as='a' color='black' ribbon='right'>
                        <Icon name='user'/>{this.state.employerJob.noOfSuggestions}
                    </Label>
                    <br/><br/>
                    <div className="description">
                        {this.state.employerJob.location.city ? this.state.employerJob.location.city + ", " : ""}{this.state.employerJob.location.country}
                    </div>
                    <div className="description">
                        {this.state.employerJob.summary}
                    </div>
                    <div className="extra content">
                        <div className="four buttons">
                            {this.state.employerJob.status === 1 ?  
                                <button type="button" className="right floated ui red button"><i className="dont icon"></i>Closed</button>
                                :
                                <button className="right floated ui basic button" onClick={this.selectJob}><i className="dont icon"></i>Close</button>    
                            }   
                            <Popup trigger={<div className="right floated ui basic button"><i className="edit icon"></i>Edit</div>} flowing hoverable>
                                <Grid centered divided columns={2}>
                                    <Grid.Column textAlign='center'>
                                        <Header as='h4'>Closing Job</Header>
                                        <Button onClick={this.selectJob}>Confirm Close Job</Button>
                                    </Grid.Column>
                                    {/* <Grid.Column textAlign='center'>
                                    <Header as='h4'>Business Plan</Header>
                                        <Button>Choose</Button>
                                    </Grid.Column> */}
                                </Grid>
                            </Popup>
                            
                            <div className="right floated ui basic button"><i className="copy outline icon"></i>Copy</div>
                            {this.state.expired ? <button type="button" className="ui red button">Expired</button>                                
                                : '' } 
                        </div>
                    </div>
                    {/* <div className="extra content">
                        <div className="two buttons">
                        {if (this.state.closeMode) ? (
                            <button type="button" className="ui red button" onClick={this.saveContact}>Save</button>
                            <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button> 
                        ) :
                        </div>
                    </div> */}
                </div>
            </div>

        )
    }
}