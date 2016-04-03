defmodule Dockup.Project do
  require Logger

  def clone_repository(repository, branch, command \\ Dockup.Command) do
    workdir = project_id(repository, branch) |> workdir
    Logger.info "Cloning #{repository} : #{branch} into #{workdir}"
    File.mkdir_p!(workdir)
    case command.run("git", ["clone", "--branch=#{branch}", "--depth=1", repository, workdir]) do
      {_out, 0} -> :ok
      {out, _} -> raise out
    end
  rescue
    error ->
      raise DockupException, "Cannot clone #{branch} of #{repository}. Error: #{error.message}"
  end

  def project_id(repository, branch) do
    {org, repo} = parse_repo_from_git_url(repository)
    "#{org}/#{repo}/#{branch}"
  end

  def workdir(project_id) do
    "#{Dockup.Configs.workdir}/#{project_id}"
  end

  def auto_detect_project_type(project_id) do
    {:ok, cwd} = File.cwd
    File.cd workdir(project_id)
    project_type = cond do
      static_site? -> :static_site
      # Rails etc can be auto detected in the future
      true -> :unknown
    end
    File.cd cwd
    project_type
  end

  defp parse_repo_from_git_url(git_url) do
    %{"org" => org, "repo" => repo} = Regex.named_captures(~r/.*[:\/](?<org>.+)\/(?<repo>.+).git/, git_url)
    {org, repo}
  end

  defp static_site? do
    File.exists? "index.html"
  end
end