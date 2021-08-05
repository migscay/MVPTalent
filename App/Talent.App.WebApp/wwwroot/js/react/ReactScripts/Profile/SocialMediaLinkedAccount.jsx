/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        // MOS21072921 added for standard task module 1
        const linkedAccounts =
        {
            linkedIn: "",
            github: ""
        }

        this.state = {
            showEditSection: false,
            newLinkedAccounts: linkedAccounts
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveLinkedAccounts = this.saveLinkedAccounts.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)

    }

    componentDidUpdate() {
        this.linkedAccounts = this.props.linkedAccounts ?
        Object.assign({}, this.props.linkedAccounts)
        : {
            linkedIn: "",
            github: ""
          }        
    }


    openEdit() {
        this.setState({
            showEditSection: true,
            newLinkedAccounts: this.props.linkedAccounts
        })    
    }
    
    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLinkedAccounts)
        data[event.target.name] = event.target.value
        this.setState({
            newLinkedAccounts: data
        })
    }

    saveLinkedAccounts() {
        console.log("saveLinkedAccounts",this.state.newLinkedAccounts)
        const data = Object.assign({}, this.state.newLinkedAccounts)
        this.props.saveProfileData(this.props.componentId,data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    autoFocus="true"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newLinkedAccounts.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter LinkedIn Url"
                    errorMessage="Please enter a valid LinkedIn Url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newLinkedAccounts.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Github Url"
                    errorMessage="Please enter a valid GitHub Url"
                />


                <button type="button" className="ui teal button" onClick={this.saveLinkedAccounts}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        //debugger;
        let linkedIn = this.props.linkedAccounts ? `${this.props.linkedAccounts.linkedIn}` : ""
        let github = this.props.linkedAccounts ? `${this.props.linkedAccounts.github}` : ""

        return (  
            <div className='row'>
                <div className="ui sixteen wide column">
                    <a href={linkedIn} target="_blank" rel="noreferrer"><button type="button" className="ui left floated primary button"><i className="linkedin icon"></i>LinkedIn</button></a>
                    <a href={github} target="_blank" rel="noreferrer"><button type="button" className="ui left floated secondary button"><i className="github icon"></i>GitHub</button></a>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}