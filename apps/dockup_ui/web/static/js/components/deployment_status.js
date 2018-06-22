import React from 'react';

const statusToIcon = {
  "queued": "icon-queued",
  "processing": "icon-sync",
  "cloning_repo": "icon-cloning-repo",
  "starting": "icon-sync",
  "checking_urls": "icon-sync",
  "started": "icon-deployed",
  "hibernating_deployment": "icon-sync",
  "deployment_hibernated": "icon-hibernated",
  "waking_up_deployment": "icon-sync",
  "deleting_deployment": "icon-sync",
  "deployment_deleted": "icon-deleted",
  "deployment_failed": "icon-errored"
}

const DeploymentStatus = ({status}) => {
  let icon = statusToIcon[status] || "icon-sync";

  return(
    <div className="icon" title={status}>
      <img src={"/images/" + icon + ".svg"} />
    </div>);
}

export default DeploymentStatus;
