import React, {Component} from 'react';
import TimeAgo from 'react-timeago';
import DeploymentStatus from './deployment_status';
import FlashMessage from '../flash_message';

class DeploymentCard extends Component {
  constructor(props) {
    super(props);
    this.handleHibernate = this.handleHibernate.bind(this);
    this.handleWakeUp = this.handleWakeUp.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  getGithubRepo() {
    let match = this.props.deployment.git_url.match(/.*[:\/](.*\/.*).git/)
    if(match) {
      let [_, repo] = match;
      return repo;
    } else {
      return "";
    }
  }

  renderOpenButton() {
    if(!this.props.deployment.urls ||
       this.props.deployment.status == "hibernating_deployment" ||
       this.props.deployment.status == "deployment_hibernated" ||
       this.props.deployment.status == "waking_up_deployment") {
      return null;
    }

    let [url] = this.props.deployment.urls;
    if(url) {
      let absoluteUrl = `http://${url}`;
      return(
        <a href={absoluteUrl} className="btn btn-secondary mr-2" target="_blank">Open</a>
      )
    }
  }

  renderLogLink() {
    let url = this.props.deployment.log_url;
    if(url) {
      let absoluteUrl = (url.indexOf("http") === 0 ? url : `//${url}`);
      return(
        <a href={absoluteUrl} className="text-muted" target="_blank">Logs</a>
      )
    }
  }

  handleHibernate(e) {
    e.preventDefault();
    let xhr = this.hibernateRequest();
    xhr.done((response) => {
      this.setState({deployment: Object.assign({}, response.data)});
    });
    xhr.fail(() => {
      FlashMessage.showMessage("danger", "Deployment cannot be hibernated.");
    });
  }

  hibernateRequest(id) {
    return $.ajax({
      url: `/api/deployments/${this.props.deployment.id}/hibernate`,
      type: 'PUT',
      contentType: 'application/json'
    });
  }

  renderHibernateLink() {
    if (this.props.deployment.status == "started") {
      return(
        <a onClick={this.handleHibernate} href="#" className="text-muted">Hibernate</a>
      );
    }
  }

  handleWakeUp(e) {
    e.preventDefault();
    let xhr = this.wakeUpRequest();
    xhr.done((response) => {
      this.setState({deployment: Object.assign({}, response.data)});
    });
    xhr.fail(() => {
      FlashMessage.showMessage("danger", "Deployment cannot be started.");
    });
  }

  wakeUpRequest(id) {
    return $.ajax({
      url: `/api/deployments/${this.props.deployment.id}/wake_up`,
      type: 'PUT',
      contentType: 'application/json'
    });
  }

  renderWakeUpLink() {
    if (this.props.deployment.status == "deployment_hibernated") {
      return(
        <a onClick={this.handleWakeUp} href="#" className="text-muted">Wake Up</a>
      );
    }
  }

  handleDelete(e) {
    e.preventDefault();
    let xhr = this.deleteRequest();
    xhr.done((response) => {
      this.setState({deployment: Object.assign({}, response.data)});
    });
    xhr.fail(() => {
      FlashMessage.showMessage("danger", "Deployment cannot be deleted.");
    });
  }

  deleteRequest(id) {
    return $.ajax({
      url: `/api/deployments/${this.props.deployment.id}`,
      type: 'DELETE',
      contentType: 'application/json'
    });
  }

  renderDeleteLink() {
    if(this.props.deployment.status != "deployment_deleted" && this.props.deployment.status != "deleting_deployment") {
      return(
        <a onClick={this.handleDelete} href="#" className="text-muted">Delete</a>
      );
    }
  }

  render() {
    return(
      <div className="deployment-info-card">
        <DeploymentStatus status={this.props.deployment.status}/>
        <div className="body">
          <div class="info">
            {this.props.deployment.branch}
            <span className="badge badge-pill badge-gray">
              <small>
                <TimeAgo title={new Date(this.props.deployment.inserted_at)}
                         date={this.props.deployment.inserted_at}/>
              </small>
            </span>
            <br />
            <small>
              {this.getGithubRepo()}
            </small>
          </div>
          <span className="actions">
            {this.renderDeleteLink()}
            {this.renderLogLink()}
            {this.renderHibernateLink()}
            {this.renderWakeUpLink()}
            {this.renderOpenButton()}
          </span>
        </div>
      </div>
    );
  }
}

export default DeploymentCard;
