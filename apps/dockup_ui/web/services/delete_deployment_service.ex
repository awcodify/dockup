defmodule DockupUi.DeleteDeploymentService do
  require Logger

  alias DockupUi.{
    Deployment,
    Repo,
    Callback.Null
  }

  def run(deployment_id, callback_data, deps \\ []) do
    Logger.info "Deleting deployment with ID: #{deployment_id}"

    backend = Application.fetch_env!(:dockup_ui, :backend_module)
    delete_deployment_job = deps[:delete_deployment_job] || backend
    callback = deps[:callback] || DockupUi.Callback

    with \
      deployment <- Repo.get!(Deployment, deployment_id),
      changeset <- Deployment.delete_changeset(deployment),
      {:ok, deployment} <- Repo.update(changeset),
      :ok <- delete_deployment(delete_deployment_job, deployment, callback_data, callback)
    do
      {:ok, deployment}
    end
  end

  def run_all(deployment_ids) when is_list deployment_ids do
    Enum.all? deployment_ids, fn deployment_id ->
      {result, _} = run(deployment_id, %Null{})
      result == :ok
    end
  end

  defp delete_deployment(delete_deployment_job, deployment, callback_data, callback) do
    delete_deployment_job.destroy(deployment.id, callback.lambda(deployment, callback_data))
    :ok
  end
end
