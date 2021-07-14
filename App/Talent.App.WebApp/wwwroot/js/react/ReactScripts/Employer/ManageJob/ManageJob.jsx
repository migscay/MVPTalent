﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { JobSortingByDate } from './JobSortingByDate.jsx';
//import JobFilter  from './JobFilter.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handleChange = this.handleChange.bind(this);
        this.updateSortBy = this.updateSortBy.bind(this);
        this.updateFilter = this.updateFilter.bind(this);

    };

    handleChange(event) {
        var data = Object.assign({}, this.props.jobDetails);
        
        //required
        const name = event.target.name;
        const value = event.target.value;
        const id = event.target.id;

        if (event.target.type == "checkbox") {
            var subData = data[id];
            if (event.target.checked == true) {
                subData.push(name);
            }
            else if (subData.includes(name)) {
                const index = subData.indexOf(name);
                if (index !== -1) {
                    subData.splice(index, 1);
                }
            }
            data[id] = subData;
        }
        else {
            data[name] = value;
        }

        var updateData = {
            target: { name: "jobDetails", value: data }
        }

        this.props.updateStateData(updateData);
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       $.ajax({ 
        url: link,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        data: {
            activePage: this.state.activePage, 
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired
        },
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            let employerJobs = null;
            //alert(res.MyJobs);
            console.log("result", res)
            console.log(`totalPages ${Math.ceil(res.totalCount / 6)}`);
            if (res.myJobs) {
                employerJobs = res.myJobs
                console.log("employerJobs", employerJobs)
                this.setState({
                    loadJobs: employerJobs,
                    totalPages: Math.ceil(res.totalCount / 6)
                })
            }
            callback();
            //this.updateWithoutSave(employerData)
        }.bind(this),
        error: function (res) {
            console.log(res.status)
            callback();
        }
        }) 
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    //Task 2 07/12/2021 passed down to JobSortingByDate to update the state.sortBy
    updateSortBy(event) {
        console.log(`ManageJobs.updateSortby ${event.target.name} ${event.target.value}`)
        const data = Object.assign({}, this.state)
        data[event.target.name] = event.target.value
        this.setState({
            sortBy: data 
        })
        this.loadNewData(data); 
    }

    //Task 2 07/13/2021 passed down to JobFilter to update the state.filter
    updateFilter(event) {
        console.log(`ManageJobs.updateSortby ${event.target.name} ${event.target.value}`)
        const data = Object.assign({}, this.state)
        data[event.target.name] = event.target.value
        this.setState({
            filter: data 
        })
    }

    // Change page
    paginate(activePage) {
        const data = Object.assign({}, this.state)
        data['activePage'] = activePage
        console.log(`activepage  ${this.state.activePage}`)
        this.setState({
            activePage: activePage
        })
        console.log(`activepage  ${this.state.activePage}`)
        this.loadNewData(data); 
    }
    
    onChechboxChange(event, data){
        const {filter} = this.state;
        filter[data.label] = !this.state.filter[data.label];
        this.setState({filter})
        this.init()
    }

    render() {

        const sortOptions = Object.entries(this.state.filter).map((e) => ( { key: e[0], value: e[1] } ));
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">List of Jobs</div>
               <div className ="ui container">
                   <i className="filter icon"></i>
                   Filter:
                   {/* <JobFilter
                        filter={this.state.filter}
                        handleChange={this.updateFilter}
                    /> */}
                    <Dropdown
                        multiple
                        simple
                        item
                        inline
                        text='Choose Filter'
                        options={sortOptions.map((opt)=><Dropdown.Item key={opt.key}><Checkbox  onChange={(event, data)=>this.onChechboxChange(event,data)}label={opt.key} defaultChecked={opt.value}/></Dropdown.Item>)}
                    />
                   <i className="calendar alternate outline icon"></i>
                   Sort by date: 
                   <JobSortingByDate
                        sortBy={this.state.sortBy}
                        handleChange={this.updateSortBy}
                    />
                    <br/><br/>
                    <div className="ui two cards">
                        { this.state.loadJobs.length === 0 ? "No Jobs Found" :
                          this.state.loadJobs.map((employerJob) => (                     
                        <JobSummaryCard employerJob={employerJob}/>
                        ))}
                    </div>
                    <br/>
                </div>
                <div className ="ui container">
                    { this.state.loadJobs.length > 0 ? 
                    <Pagination className="d-flex justify-content-center"
                        activePage={this.state.activePage}
                        totalPages={this.state.totalPages}
                        onPageChange={(event, data) => this.paginate(data.activePage)}
                    /> : "" }                  
                </div>                  
                {/* <div className="sixteen wide center aligned padded column">
                    { this.state.loadJobs.length > 0 ? 
                        <Pagination className="d-flex justify-content-center"
                        activePage={this.state.activePage}
                        totalPages={this.state.totalPages}
                        onPageChange={(event, data) => this.paginate(data.activePage)}
                        /> : "" }                                    
                </div> */}
            </BodyWrapper>
        )
    }
}