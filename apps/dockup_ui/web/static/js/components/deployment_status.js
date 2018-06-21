import React from 'react';

const DeploymentStatus = ({status}) => {
  let icon = "icon-sync";
  switch (status) {
    case 'started':
      icon = "icon-deployed";
      break;
    case 'hibernating_deployment':
      icon = "icon-deployed";
      break;
    case 'deployment_hibernated':
      icon = "icon-deployed";
      break;
    case 'deployment_deleted':
      icon = "icon-deleted";
      break;
    }

  return(
    <div className="icon" title={status}>
      <img src={"/images/" + icon + ".svg"} />
    </div>);
}

export default DeploymentStatus;
