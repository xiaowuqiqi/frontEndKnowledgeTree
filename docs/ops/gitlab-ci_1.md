---
title: gitlab-ci 变量参考
order: 1
group:
  title: Gitlab 安装与使用
  order: 5
---
# gitlab-ci 变量参考

![image-20240321105306187](./gitlab-ci_1.assets/image-20240321105306187.png)

文档参考：https://docs.gitlab.com/ee/ci/variables/

每个 GitLab CI/CD 管道中都提供预定义的[CI/CD 变量。](https://docs.gitlab.com/ee/ci/variables/index.html)

预定义变量在管道执行的两个不同阶段可用。一些变量在 GitLab 创建管道时可用，可用于配置管道或在作业脚本中。其他变量在运行程序运行作业时变得可用，并且只能在作业脚本中使用。

[运行程序提供的预定义变量不能与触发器作业](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-downstream-pipeline-from-a-job-in-the-gitlab-ciyml-file) 或以下关键字一起使用：

- [`workflow`](https://docs.gitlab.com/ee/ci/yaml/index.html#workflow)
- [`include`](https://docs.gitlab.com/ee/ci/yaml/index.html#include)
- [`rules`](https://docs.gitlab.com/ee/ci/yaml/index.html#rules)

| 多变的                                          | GitLab | 跑步者 | 描述                                                         |
| :---------------------------------------------- | :----- | :----- | :----------------------------------------------------------- |
| `CHAT_CHANNEL`                                  | 10.6   | 全部   | [触发ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令的源聊天频道。 |
| `CHAT_INPUT`                                    | 10.6   | 全部   | [使用ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令传递的附加参数。 |
| `CHAT_USER_ID`                                  | 14.4   | 全部   | [触发ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令的用户的聊天服务的用户 ID 。 |
| `CI`                                            | 全部   | 0.4    | 适用于 CI/CD 中执行的所有作业。`true`有空的时候。            |
| `CI_API_V4_URL`                                 | 11.7   | 全部   | GitLab API v4 根 URL。                                       |
| `CI_API_GRAPHQL_URL`                            | 15.11  | 全部   | GitLab API GraphQL 根 URL。                                  |
| `CI_BUILDS_DIR`                                 | 全部   | 11.10  | 执行构建的顶级目录。                                         |
| `CI_COMMIT_AUTHOR`                              | 13.11  | 全部   | 提交格式的作者`Name <email>`。                               |
| `CI_COMMIT_BEFORE_SHA`                          | 11.2   | 全部   | 分支或标签上存在的上一个最新提交。始终位于`0000000000000000000000000000000000000000`合并请求管道中以及分支或标签管道中的首次提交。 |
| `CI_COMMIT_BRANCH`                              | 12.6   | 0.5    | 提交分支名称。在分支管道中可用，包括默认分支的管道。在合并请求管道或标记管道中不可用。 |
| `CI_COMMIT_DESCRIPTION`                         | 10.8   | 全部   | 提交的描述。如果标题少于 100 个字符，则消息没有第一行。      |
| `CI_COMMIT_MESSAGE`                             | 10.8   | 全部   | 完整的提交消息。                                             |
| `CI_COMMIT_REF_NAME`                            | 9.0    | 全部   | 为其构建项目的分支或标签名称。                               |
| `CI_COMMIT_REF_PROTECTED`                       | 11.11  | 全部   | `true`如果作业正在为受保护的引用运行，`false`否则。          |
| `CI_COMMIT_REF_SLUG`                            | 9.0    | 全部   | `CI_COMMIT_REF_NAME`小写，缩短为 63 字节，并将除`0-9`和之外的所有内容`a-z`替换为`-`. 无前导/尾随`-`。用于 URL、主机名和域名。 |
| `CI_COMMIT_SHA`                                 | 9.0    | 全部   | 构建项目所针对的提交修订版。                                 |
| `CI_COMMIT_SHORT_SHA`                           | 11.7   | 全部   | 的前八个字符`CI_COMMIT_SHA`。                                |
| `CI_COMMIT_TAG`                                 | 9.0    | 0.5    | 提交标签名称。仅在标签管道中可用。                           |
| `CI_COMMIT_TAG_MESSAGE`                         | 15.5   | 全部   | 提交标签消息。仅在标签管道中可用。                           |
| `CI_COMMIT_TIMESTAMP`                           | 13.4   | 全部   | [ISO 8601](https://www.rfc-editor.org/rfc/rfc3339#appendix-A)格式的提交时间戳。 |
| `CI_COMMIT_TITLE`                               | 10.8   | 全部   | 提交的标题。消息的完整第一行。                               |
| `CI_CONCURRENT_ID`                              | 全部   | 11.10  | 单个执行器中构建执行的唯一 ID。                              |
| `CI_CONCURRENT_PROJECT_ID`                      | 全部   | 11.10  | 单个执行器和项目中构建执行的唯一 ID。                        |
| `CI_CONFIG_PATH`                                | 9.4    | 0.5    | CI/CD 配置文件的路径。默认为`.gitlab-ci.yml`. 在正在运行的管道内只读。 |
| `CI_DEBUG_TRACE`                                | 全部   | 1.7    | `true`是否启用了[调试日志记录（跟踪） 。](https://docs.gitlab.com/ee/ci/variables/index.html#enable-debug-logging) |
| `CI_DEBUG_SERVICES`                             | 15.7   | 15.7   | `true`是否启用了[服务容器日志记录。](https://docs.gitlab.com/ee/ci/services/index.html#capturing-service-container-logs) |
| `CI_DEFAULT_BRANCH`                             | 12.4   | 全部   | 项目默认分支的名称。                                         |
| `CI_DEPENDENCY_PROXY_GROUP_IMAGE_PREFIX`        | 13.7   | 全部   | 用于通过依赖代理拉取映像的顶级组映像前缀。                   |
| `CI_DEPENDENCY_PROXY_DIRECT_GROUP_IMAGE_PREFIX` | 14.3   | 全部   | 用于通过依赖代理拉取镜像的直接组镜像前缀。                   |
| `CI_DEPENDENCY_PROXY_PASSWORD`                  | 13.7   | 全部   | 通过依赖代理拉取镜像的密码。                                 |
| `CI_DEPENDENCY_PROXY_SERVER`                    | 13.7   | 全部   | 用于登录依赖代理的服务器。这相当于`$CI_SERVER_HOST:$CI_SERVER_PORT`. |
| `CI_DEPENDENCY_PROXY_USER`                      | 13.7   | 全部   | 通过依赖代理拉取图像的用户名。                               |
| `CI_DEPLOY_FREEZE`                              | 13.2   | 全部   | 仅当管道在[部署冻结窗口](https://docs.gitlab.com/ee/user/project/releases/index.html#prevent-unintentional-releases-by-setting-a-deploy-freeze)期间运行时才可用。`true`有空的时候。 |
| `CI_DEPLOY_PASSWORD`                            | 10.8   | 全部   | [GitLab Deploy Token](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html#gitlab-deploy-token)的身份验证密码（如果项目有）。 |
| `CI_DEPLOY_USER`                                | 10.8   | 全部   | [GitLab 部署令牌](https://docs.gitlab.com/ee/user/project/deploy_tokens/index.html#gitlab-deploy-token)的身份验证用户名（如果项目有）。 |
| `CI_DISPOSABLE_ENVIRONMENT`                     | 全部   | 10.1   | 仅当作业在一次性环境中执行时才可用（仅为此作业创建并在执行后处置/销毁的东西 - 除 和 之外的所有执行器`shell`）`ssh`。`true`有空的时候。 |
| `CI_ENVIRONMENT_NAME`                           | 8.15   | 全部   | 此作业的环境名称。[`environment:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentname)如果设置则可用。 |
| `CI_ENVIRONMENT_SLUG`                           | 8.15   | 全部   | 环境名称的简化版本，适合包含在 DNS、URL、Kubernetes 标签等中。[`environment:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentname)如果设置则可用。slug 被[截断为 24 个字符](https://gitlab.com/gitlab-org/gitlab/-/issues/20941)。 |
| `CI_ENVIRONMENT_URL`                            | 9.3    | 全部   | 此作业的环境的 URL。[`environment:url`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmenturl)如果设置则可用。 |
| `CI_ENVIRONMENT_ACTION`                         | 13.11  | 全部   | 为此作业环境指定的操作注释。[`environment:action`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentaction)如果设置则可用。可以是`start`、`prepare`、 或`stop`。 |
| `CI_ENVIRONMENT_TIER`                           | 14.0   | 全部   | 此作业的[环境的部署层](https://docs.gitlab.com/ee/ci/environments/index.html#deployment-tier-of-environments)。 |
| `CI_RELEASE_DESCRIPTION`                        | 15.5   | 全部   | 发布的描述。仅适用于标签管道。描述长度限制为前 1024 个字符。 |
| `CI_GITLAB_FIPS_MODE`                           | 14.10  | 全部   | GitLab 实例中是否启用 FIPS 模式的配置设置。                  |
| `CI_HAS_OPEN_REQUIREMENTS`                      | 13.1   | 全部   | 仅当管道的项目有开放[需求](https://docs.gitlab.com/ee/user/project/requirements/index.html)时才可用。`true`有空的时候。 |
| `CI_JOB_ID`                                     | 9.0    | 全部   | 作业的内部 ID，在 GitLab 实例中的所有作业中是唯一的。        |
| `CI_JOB_IMAGE`                                  | 12.9   | 12.9   | 运行作业的 Docker 映像的名称。                               |
| `CI_JOB_JWT`（已弃用）                          | 12.10  | 全部   | RS256 JSON Web 令牌，用于通过支持 JWT 身份验证的第三方系统进行身份验证，例如[HashiCorp 的 Vault](https://docs.gitlab.com/ee/ci/secrets/index.html)。[在 GitLab 15.9 中已弃用](https://docs.gitlab.com/ee/update/deprecations.html#old-versions-of-json-web-tokens-are-deprecated)，并计划在 GitLab 16.5 中删除。请改用[ID 令牌](https://docs.gitlab.com/ee/ci/yaml/index.html#id_tokens)。 |
| `CI_JOB_JWT_V1`（已弃用）                       | 14.6   | 全部   | 与 相同的值`CI_JOB_JWT`。[在 GitLab 15.9 中已弃用](https://docs.gitlab.com/ee/update/deprecations.html#old-versions-of-json-web-tokens-are-deprecated)，并计划在 GitLab 16.5 中删除。请改用[ID 令牌](https://docs.gitlab.com/ee/ci/yaml/index.html#id_tokens)。 |
| `CI_JOB_JWT_V2`（已弃用）                       | 14.6   | 全部   | 新格式化的 RS256 JSON Web 令牌可提高兼容性。与 类似`CI_JOB_JWT`，只不过颁发者 ( `iss`) 声明从 更改为`gitlab.com`，`https://gitlab.com`从`sub`更改为`job_id`包含项目路径的字符串，并且`aud`添加了一个声明。该`aud`字段是一个常量值。信任多个依赖方中的 JWT 可能会导致[一个 RP 向另一个 RP 发送 JWT 并将其作为一项恶意作业](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/72555#note_769112331)。[在 GitLab 15.9 中已弃用](https://docs.gitlab.com/ee/update/deprecations.html#old-versions-of-json-web-tokens-are-deprecated)，并计划在 GitLab 16.5 中删除。请改用[ID 令牌](https://docs.gitlab.com/ee/ci/yaml/index.html#id_tokens)。 |
| `CI_JOB_MANUAL`                                 | 8.12   | 全部   | 仅当作业手动启动时才可用。`true`有空的时候。                 |
| `CI_JOB_NAME`                                   | 9.0    | 0.5    | 职位名称。                                                   |
| `CI_JOB_NAME_SLUG`                              | 15.4   | 全部   | `CI_JOB_NAME_SLUG`小写，缩短为 63 字节，并将除`0-9`和之外的所有内容`a-z`替换为`-`. 无前导/尾随`-`。在路径中使用。 |
| `CI_JOB_STAGE`                                  | 9.0    | 0.5    | 作业阶段的名称。                                             |
| `CI_JOB_STATUS`                                 | 全部   | 13.5   | 每个运行程序阶段执行时作业的状态。与 一起使用[`after_script`](https://docs.gitlab.com/ee/ci/yaml/index.html#after_script)。可以是`success`、`failed`、 或`canceled`。 |
| `CI_JOB_TIMEOUT`                                | 15.7   | 15.7   | 作业超时值。                                                 |
| `CI_JOB_TOKEN`                                  | 9.0    | 1.2    | [用于对某些 API 端点](https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html)进行身份验证的令牌。只要作业正在运行，令牌就有效。 |
| `CI_JOB_URL`                                    | 11.1   | 0.5    | 职位详细信息 URL。                                           |
| `CI_JOB_STARTED_AT`                             | 13.10  | 全部   | 作业开始时的 UTC 日期时间，采用[ISO 8601](https://www.rfc-editor.org/rfc/rfc3339#appendix-A)格式。 |
| `CI_KUBERNETES_ACTIVE`                          | 13.0   | 全部   | 仅当管道具有可用于部署的 Kubernetes 集群时才可用。`true`有空的时候。 |
| `CI_NODE_INDEX`                                 | 11.5   | 全部   | 作业集中作业的索引。仅当作业使用 时才可用[`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel)。 |
| `CI_NODE_TOTAL`                                 | 11.5   | 全部   | 该作业并行运行的实例总数。`1`如果作业不使用 则设置为[`parallel`](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel). |
| `CI_OPEN_MERGE_REQUESTS`                        | 13.8   | 全部   | 以逗号分隔的列表，最多包含四个合并请求，这些请求使用当前分支和项目作为合并请求源。仅当分支具有关联的合并请求时，才可在分支和合并请求管道中使用。例如，`gitlab-org/gitlab!333,gitlab-org/gitlab-foss!11`. |
| `CI_PAGES_DOMAIN`                               | 11.8   | 全部   | 托管 GitLab Pages 的已配置域。                               |
| `CI_PAGES_URL`                                  | 11.8   | 全部   | GitLab Pages 站点的 URL。始终是`CI_PAGES_DOMAIN`.            |
| `CI_PIPELINE_ID`                                | 8.10   | 全部   | 当前管道的实例级 ID。此 ID 在 GitLab 实例上的所有项目中都是唯一的。 |
| `CI_PIPELINE_IID`                               | 11.0   | 全部   | 当前管道的项目级 IID（内部 ID）。该ID仅在当前项目内是唯一的。 |
| `CI_PIPELINE_SOURCE`                            | 10.0   | 全部   | 管道是如何触发的。可以是`push`、、、、、、、、、、、、、、或。`web`_ `schedule`_ _ _ _ _ [_](https://docs.gitlab.com/ee/ci/triggers/index.html#configure-cicd-jobs-to-run-in-triggered-pipelines) _ 有关每个值的说明，请参阅[的通用](https://docs.gitlab.com/ee/ci/jobs/job_control.html#common-if-clauses-for-rules)[子句](https://docs.gitlab.com/ee/ci/jobs/job_control.html#common-if-clauses-for-rules)，它使用此变量来控制作业的运行时间。`api``external``chat``webide``merge_request_event``external_pull_request_event``parent_pipeline`[`trigger``pipeline`](https://docs.gitlab.com/ee/ci/triggers/index.html#configure-cicd-jobs-to-run-in-triggered-pipelines)[`if``rules`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#common-if-clauses-for-rules) |
| `CI_PIPELINE_TRIGGERED`                         | 全部   | 全部   | `true`如果作业被[触发](https://docs.gitlab.com/ee/ci/triggers/index.html)。 |
| `CI_PIPELINE_URL`                               | 11.1   | 0.5    | 管道详细信息的 URL。                                         |
| `CI_PIPELINE_CREATED_AT`                        | 13.10  | 全部   | 创建管道时的 UTC 日期时间，采用[ISO 8601](https://www.rfc-editor.org/rfc/rfc3339#appendix-A)格式。 |
| `CI_PIPELINE_NAME`                              | 16.3   | 全部   | 管道名称定义在[`workflow:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#workflowname) |
| `CI_PROJECT_DIR`                                | 全部   | 全部   | 存储库克隆到的完整路径以及作业运行的位置。如果设置了 GitLab Runner`builds_dir`参数，则该变量是相对于 的值设置的`builds_dir`。有关更多信息，请参阅[高级 GitLab Runner 配置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)。 |
| `CI_PROJECT_ID`                                 | 全部   | 全部   | 当前项目的 ID。此 ID 在 GitLab 实例上的所有项目中都是唯一的。 |
| `CI_PROJECT_NAME`                               | 8.10   | 0.5    | 项目的目录名称。例如，如果项目 URL 是`gitlab.example.com/group-name/project-1`，`CI_PROJECT_NAME`则为`project-1`。 |
| `CI_PROJECT_NAMESPACE`                          | 8.10   | 0.5    | 作业的项目命名空间（用户名或组名）。                         |
| `CI_PROJECT_NAMESPACE_ID`                       | 15.7   | 0.5    | 作业的项目命名空间 ID。                                      |
| `CI_PROJECT_PATH_SLUG`                          | 9.3    | 全部   | `$CI_PROJECT_PATH``a-z`为小写，带有未替换或`0-9`替换为的字符`-`，并缩短为 63 个字节。用于 URL 和域名。 |
| `CI_PROJECT_PATH`                               | 8.10   | 0.5    | 包含项目名称的项目命名空间。                                 |
| `CI_PROJECT_REPOSITORY_LANGUAGES`               | 12.3   | 全部   | 存储库中使用的语言的以逗号分隔的小写列表。例如`ruby,javascript,html,css`。最大语言数量限制为 5 种。有一个问题[建议增加限制](https://gitlab.com/gitlab-org/gitlab/-/issues/368925)。 |
| `CI_PROJECT_ROOT_NAMESPACE`                     | 13.2   | 0.5    | 作业的根项目命名空间（用户名或组名）。例如，如果`CI_PROJECT_NAMESPACE`是`root-group/child-group/grandchild-group`，`CI_PROJECT_ROOT_NAMESPACE`则 是`root-group`。 |
| `CI_PROJECT_TITLE`                              | 12.4   | 全部   | GitLab Web 界面中显示的人类可读的项目名称。                  |
| `CI_PROJECT_DESCRIPTION`                        | 15.1   | 全部   | GitLab Web 界面中显示的项目描述。                            |
| `CI_PROJECT_URL`                                | 8.10   | 0.5    | 项目的 HTTP(S) 地址。                                        |
| `CI_PROJECT_VISIBILITY`                         | 10.3   | 全部   | 项目的可见性。可以是`internal`、`private`、 或`public`。     |
| `CI_PROJECT_CLASSIFICATION_LABEL`               | 14.2   | 全部   | 项目[外部授权分类标签](https://docs.gitlab.com/ee/administration/settings/external_authorization.html)。 |
| `CI_REGISTRY_IMAGE`                             | 8.10   | 0.5    | 项目容器注册表的地址。仅当为项目启用了容器注册表时才可用。   |
| `CI_REGISTRY_PASSWORD`                          | 9.0    | 全部   | 将容器推送到项目的 GitLab 容器注册表的密码。仅当为项目启用了容器注册表时才可用。该密码值与 相同，`CI_JOB_TOKEN`并且仅在作业运行期间有效。使用`CI_DEPLOY_PASSWORD`来长期访问注册表 |
| `CI_REGISTRY_USER`                              | 9.0    | 全部   | 将容器推送到项目的 GitLab 容器注册表的用户名。仅当为项目启用了容器注册表时才可用。 |
| `CI_REGISTRY`                                   | 8.10   | 0.5    | GitLab 容器注册表的地址。仅当为项目启用了容器注册表时才可用。`:port`如果在注册表配置中指定了该变量，则该变量包含一个值。 |
| `CI_REPOSITORY_URL`                             | 9.0    | 全部   | [使用CI/CD 作业令牌](https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html)Git 克隆 (HTTP) 存储库的完整路径，格式为`https://gitlab-ci-token:$CI_JOB_TOKEN@gitlab.example.com/my-group/my-project.git`。 |
| `CI_RUNNER_DESCRIPTION`                         | 8.10   | 0.5    | 跑步者的描述。                                               |
| `CI_RUNNER_EXECUTABLE_ARCH`                     | 全部   | 10.6   | GitLab Runner 可执行文件的操作系统/架构。可能与执行者的环境不一样。 |
| `CI_RUNNER_ID`                                  | 8.10   | 0.5    | 正在使用的跑步者的唯一 ID。                                  |
| `CI_RUNNER_REVISION`                            | 全部   | 10.6   | 运行作业的运行程序的修订版。                                 |
| `CI_RUNNER_SHORT_TOKEN`                         | 全部   | 12.3   | 运行者的唯一 ID，用于验证新作业请求。在[GitLab 14.9](https://gitlab.com/gitlab-org/security/gitlab/-/merge_requests/2251)及更高版本中，令牌包含前缀，并使用前 17 个字符。14.9 之前，使用前八个字符。 |
| `CI_RUNNER_TAGS`                                | 8.10   | 0.5    | 以逗号分隔的跑步者标签列表。                                 |
| `CI_RUNNER_VERSION`                             | 全部   | 10.6   | 运行作业的 GitLab Runner 的版本。                            |
| `CI_SERVER_HOST`                                | 12.1   | 全部   | GitLab 实例 URL 的主机，不带协议或端口。例如`gitlab.example.com`。 |
| `CI_SERVER_NAME`                                | 全部   | 全部   | 协调作业的 CI/CD 服务器的名称。                              |
| `CI_SERVER_PORT`                                | 12.8   | 全部   | GitLab 实例 URL 的端口，不带主机或协议。例如`8080`。         |
| `CI_SERVER_PROTOCOL`                            | 12.8   | 全部   | GitLab 实例 URL 的协议，不带主机或端口。例如`https`。        |
| `CI_SERVER_SHELL_SSH_HOST`                      | 15.11  | 全部   | GitLab实例的SSH主机，用于通过SSH访问Git存储库。例如`gitlab.com`。 |
| `CI_SERVER_SHELL_SSH_PORT`                      | 15.11  | 全部   | GitLab 实例的 SSH 端口，用于通过 SSH 访问 Git 存储库。例如`22`。 |
| `CI_SERVER_REVISION`                            | 全部   | 全部   | 安排作业的 GitLab 修订版。                                   |
| `CI_SERVER_TLS_CA_FILE`                         | 全部   | 全部   | [包含 TLS CA 证书的文件，用于在运行程序设置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)`tls-ca-file`中设置时验证 GitLab 服务器。 |
| `CI_SERVER_TLS_CERT_FILE`                       | 全部   | 全部   | [包含 TLS 证书的文件，用于在运行程序设置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)`tls-cert-file`中设置时验证 GitLab 服务器。 |
| `CI_SERVER_TLS_KEY_FILE`                        | 全部   | 全部   | [包含 TLS 密钥的文件，用于在运行程序设置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)`tls-key-file`中设置时验证 GitLab 服务器。 |
| `CI_SERVER_URL`                                 | 12.7   | 全部   | GitLab 实例的基本 URL，包括协议和端口。例如`https://gitlab.example.com:8080`。 |
| `CI_SERVER_VERSION_MAJOR`                       | 11.4   | 全部   | GitLab 实例的主要版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_MAJOR`则为`13`。 |
| `CI_SERVER_VERSION_MINOR`                       | 11.4   | 全部   | GitLab 实例的次要版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_MINOR`则为`6`。 |
| `CI_SERVER_VERSION_PATCH`                       | 11.4   | 全部   | GitLab 实例的补丁版本。例如，如果 GitLab 版本为`13.6.1`，`CI_SERVER_VERSION_PATCH`则为`1`。 |
| `CI_SERVER_VERSION`                             | 全部   | 全部   | GitLab 实例的完整版本。                                      |
| `CI_SERVER`                                     | 全部   | 全部   | 适用于 CI/CD 中执行的所有作业。`yes`有空的时候。             |
| `CI_SHARED_ENVIRONMENT`                         | 全部   | 10.1   | 仅当作业在共享环境中执行时才可用（在 CI/CD 调用中持久存在的东西，例如`shell`或`ssh`执行器）。`true`有空的时候。 |
| `CI_TEMPLATE_REGISTRY_HOST`                     | 15.3   | 全部   | CI/CD 模板使用的注册表的主机。默认为`registry.gitlab.com`.   |
| `GITLAB_CI`                                     | 全部   | 全部   | 适用于 CI/CD 中执行的所有作业。`true`有空的时候。            |
| `GITLAB_FEATURES`                               | 10.6   | 全部   | 可用于 GitLab 实例和许可证的许可功能的逗号分隔列表。         |
| `GITLAB_USER_EMAIL`                             | 8.12   | 全部   | 启动管道的用户的电子邮件，除非该作业是手动作业。在手动作业中，该值是启动作业的用户的电子邮件。 |
| `GITLAB_USER_ID`                                | 8.12   | 全部   | 启动管道的用户的 ID，除非作业是手动作业。在手动作业中，该值为启动作业的用户的 ID。 |
| `GITLAB_USER_LOGIN`                             | 10.0   | 全部   | 启动管道的用户的用户名，除非作业是手动作业。在手动作业中，该值是启动作业的用户的用户名。 |
| `GITLAB_USER_NAME`                              | 10.0   | 全部   | 启动管道的用户的名称，除非作业是手动作业。在手动作业中，该值是启动作业的用户的名称。 |
| `KUBECONFIG`                                    | 14.2   | 全部   | `kubeconfig`包含每个共享代理连接上下文的文件路径。[仅当GitLab 代理被授权访问该项目](https://docs.gitlab.com/ee/user/clusters/agent/ci_cd_workflow.html#authorize-the-agent)时才可用。 |
| `TRIGGER_PAYLOAD`                               | 13.9   | 全部   | Webhook 负载。[仅当使用 webhook 触发](https://docs.gitlab.com/ee/ci/triggers/index.html#use-a-webhook-payload)管道时才可用。 |

## 合并请求管道的预定义变量

这些变量在以下情况下可用：

- 这些管道[是合并请求管道](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html)。
- 合并请求已开放。

| 多变的                                     | GitLab | 跑步者 | 描述                                                         |
| :----------------------------------------- | :----- | :----- | :----------------------------------------------------------- |
| `CI_MERGE_REQUEST_APPROVED`                | 14.1   | 全部   | 合并请求的批准状态。`true`当[合并请求批准](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/index.html)可用且合并请求已获得批准时。 |
| `CI_MERGE_REQUEST_ASSIGNEES`               | 11.9   | 全部   | 合并请求的受让人的用户名的逗号分隔列表。                     |
| `CI_MERGE_REQUEST_ID`                      | 11.6   | 全部   | 合并请求的实例级 ID。这是 GitLab 上所有项目的唯一 ID。       |
| `CI_MERGE_REQUEST_IID`                     | 11.6   | 全部   | 合并请求的项目级 IID（内部 ID）。该 ID 对于当前项目是唯一的。 |
| `CI_MERGE_REQUEST_LABELS`                  | 11.9   | 全部   | 合并请求的逗号分隔标签名称。                                 |
| `CI_MERGE_REQUEST_MILESTONE`               | 11.9   | 全部   | 合并请求的里程碑标题。                                       |
| `CI_MERGE_REQUEST_PROJECT_ID`              | 11.6   | 全部   | 合并请求的项目 ID。                                          |
| `CI_MERGE_REQUEST_PROJECT_PATH`            | 11.6   | 全部   | 合并请求的项目的路径。例如`namespace/awesome-project`。      |
| `CI_MERGE_REQUEST_PROJECT_URL`             | 11.6   | 全部   | 合并请求的项目的 URL。例如，`http://192.168.10.15:3000/namespace/awesome-project`. |
| `CI_MERGE_REQUEST_REF_PATH`                | 11.6   | 全部   | 合并请求的引用路径。例如，`refs/merge-requests/1/head`.      |
| `CI_MERGE_REQUEST_SOURCE_BRANCH_NAME`      | 11.6   | 全部   | 合并请求的源分支名称。                                       |
| `CI_MERGE_REQUEST_SOURCE_BRANCH_SHA`       | 11.9   | 全部   | 合并请求的源分支的 HEAD SHA。该变量在合并请求管道中为空。SHA 仅存在于[合并结果管道](https://docs.gitlab.com/ee/ci/pipelines/merged_results_pipelines.html)中。 |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_ID`       | 11.6   | 全部   | 合并请求的源项目的 ID。                                      |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_PATH`     | 11.6   | 全部   | 合并请求的源项目的路径。                                     |
| `CI_MERGE_REQUEST_SOURCE_PROJECT_URL`      | 11.6   | 全部   | 合并请求的源项目的 URL。                                     |
| `CI_MERGE_REQUEST_TARGET_BRANCH_NAME`      | 11.6   | 全部   | 合并请求的目标分支名称。                                     |
| `CI_MERGE_REQUEST_TARGET_BRANCH_PROTECTED` | 15.2   | 全部   | 合并请求的目标分支的保护状态。                               |
| `CI_MERGE_REQUEST_TARGET_BRANCH_SHA`       | 11.9   | 全部   | 合并请求的目标分支的 HEAD SHA。该变量在合并请求管道中为空。SHA 仅存在于[合并结果管道](https://docs.gitlab.com/ee/ci/pipelines/merged_results_pipelines.html)中。 |
| `CI_MERGE_REQUEST_TITLE`                   | 11.9   | 全部   | 合并请求的标题。                                             |
| `CI_MERGE_REQUEST_EVENT_TYPE`              | 12.3   | 全部   | 合并请求的事件类型。可以是`detached`，`merged_result`或者`merge_train`。 |
| `CI_MERGE_REQUEST_DIFF_ID`                 | 13.7   | 全部   | 合并请求差异的版本。                                         |
| `CI_MERGE_REQUEST_DIFF_BASE_SHA`           | 13.7   | 全部   | 合并请求差异的基本 SHA。                                     |

## 外部拉取请求管道的预定义变量

这些变量仅在以下情况下可用：

- 管道是[外部拉取请求管道](https://docs.gitlab.com/ee/ci/ci_cd_for_external_repos/index.html#pipelines-for-external-pull-requests)
- 拉取请求已打开。

| 多变的                                        | GitLab | 跑步者 | 描述                            |
| :-------------------------------------------- | :----- | :----- | :------------------------------ |
| `CI_EXTERNAL_PULL_REQUEST_IID`                | 12.3   | 全部   | 从 GitHub 提取请求 ID。         |
| `CI_EXTERNAL_PULL_REQUEST_SOURCE_REPOSITORY`  | 13.3   | 全部   | 拉取请求的源存储库名称。        |
| `CI_EXTERNAL_PULL_REQUEST_TARGET_REPOSITORY`  | 13.3   | 全部   | 拉取请求的目标存储库名称。      |
| `CI_EXTERNAL_PULL_REQUEST_SOURCE_BRANCH_NAME` | 12.3   | 全部   | 拉取请求的源分支名称。          |
| `CI_EXTERNAL_PULL_REQUEST_SOURCE_BRANCH_SHA`  | 12.3   | 全部   | 拉取请求的源分支的 HEAD SHA。   |
| `CI_EXTERNAL_PULL_REQUEST_TARGET_BRANCH_NAME` | 12.3   | 全部   | 拉取请求的目标分支名称。        |
| `CI_EXTERNAL_PULL_REQUEST_TARGET_BRANCH_SHA`  | 12.3   | 全部   | 拉取请求的目标分支的 HEAD SHA。 |

## 部署变量

负责部署配置的集成可以定义在构建环境中设置的自己的预定义变量。这些变量仅为[部署作业](https://docs.gitlab.com/ee/ci/environments/index.html)定义。

例如，[Kubernetes 集成](https://docs.gitlab.com/ee/user/project/clusters/deploy_to_cluster.html#deployment-variables) 定义了可在集成中使用的部署变量。

[每个集成的文档](https://docs.gitlab.com/ee/user/project/integrations/index.html)都会 说明该集成是否具有任何可用的部署变量。

**全局变量文档**：https://docs.gitlab.com/ee/ci/variables/predefined_variables.html

# .gitlab-ci.yml 更多案例

案例：https://docs.gitlab.com/ee/ci/examples/

文档：https://docs.gitlab.com/ee/ci/yaml/

# 可以使用变量的地方

**级别：**免费、高级、终极
**产品：** GitLab.com、自我管理、GitLab 专用

正如[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html)文档中所述，您可以定义许多不同的变量。其中一些可用于所有 GitLab CI/CD 功能，但其中一些或多或少受到限制。

本文档描述了在何处以及如何使用不同类型的变量。

## 变量的使用

有两个地方可以使用定义的变量。关于：

1. GitLab 端，在[`.gitlab-ci.yml`文件](https://docs.gitlab.com/ee/ci/index.html#the-gitlab-ciyml-file).
2. GitLab Runner 端，在`config.toml`.

### `.gitlab-ci.yml`文件

**历史** 

| 定义                                                         | 可以扩展吗？ | 扩展场所                 | 描述                                                         |
| :----------------------------------------------------------- | :----------- | :----------------------- | :----------------------------------------------------------- |
| [`after_script`](https://docs.gitlab.com/ee/ci/yaml/index.html#after_script) | 是的         | 脚本执行外壳             | 变量扩展是由[执行 shell 环境](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#execution-shell-environment)进行的。 |
| [`artifacts:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#artifactsname) | 是的         | 跑步者                   | 变量扩展是由 GitLab Runner 的 shell 环境完成的。             |
| [`artifacts:paths`](https://docs.gitlab.com/ee/ci/yaml/index.html#artifactspaths) | 是的         | 跑步者                   | 变量扩展是由 GitLab Runner 的 shell 环境完成的。             |
| [`before_script`](https://docs.gitlab.com/ee/ci/yaml/index.html#before_script) | 是的         | 脚本执行外壳             | 变量扩展是由[执行shell环境进行的](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#execution-shell-environment) |
| [`cache:key`](https://docs.gitlab.com/ee/ci/yaml/index.html#cachekey) | 是的         | 跑步者                   | 变量扩展是由GitLab Runner[内部的变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)完成的。 |
| [`cache:policy`](https://docs.gitlab.com/ee/ci/yaml/index.html#cachepolicy) | 是的         | 跑步者                   | 变量扩展是由GitLab Runner[内部的变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)完成的。 |
| [`environment:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentname) | 是的         | GitLab                   | 与 类似`environment:url`，但变量扩展不支持以下内容：  -`CI_ENVIRONMENT_*`变量。 -[持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |
| [`environment:url`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmenturl) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)  支持为作业定义的所有变量（项目/组变量、来自 的变量`.gitlab-ci.yml`、来自触发器的变量、来自管道计划的变量）。  不支持在 GitLab Runner 中定义的变量`config.toml`以及在作业的`script`. |
| [`environment:auto_stop_in`](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentauto_stop_in) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)  被替换的变量的值应该是人类可读的自然语言形式的一段时间。请参阅[可能的输入](https://docs.gitlab.com/ee/ci/yaml/index.html#environmentauto_stop_in)以获取更多信息。 |
| [`except:variables`](https://docs.gitlab.com/ee/ci/yaml/index.html#onlyvariables--exceptvariables) | 不           | 不适用                   | 该变量必须采用 的形式`$variable`。不支持以下内容：  -`CI_ENVIRONMENT_SLUG`变量。 -[持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |
| [`id_tokens:aud`](https://docs.gitlab.com/ee/ci/yaml/index.html#id_tokens) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)GitLab 16.1 中[引入了](https://gitlab.com/gitlab-org/gitlab/-/issues/414293)变量扩展。 |
| [`image`](https://docs.gitlab.com/ee/ci/yaml/index.html#image) | 是的         | 跑步者                   | 变量扩展是由GitLab Runner[内部的变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)完成的。 |
| [`include`](https://docs.gitlab.com/ee/ci/yaml/index.html#include) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)有关支持的变量的更多信息，  请参阅[将变量与 include 一起使用。](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include) |
| [`only:variables`](https://docs.gitlab.com/ee/ci/yaml/index.html#onlyvariables--exceptvariables) | 不           | 不适用                   | 该变量必须采用 的形式`$variable`。不支持以下内容：  -`CI_ENVIRONMENT_SLUG`变量。 -[持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |
| [`resource_group`](https://docs.gitlab.com/ee/ci/yaml/index.html#resource_group) | 是的         | GitLab                   | 与 类似`environment:url`，但变量扩展不支持以下内容： - `CI_ENVIRONMENT_URL` -[持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |
| [`rules:changes`](https://docs.gitlab.com/ee/ci/yaml/index.html#ruleschanges) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism) |
| [`rules:exists`](https://docs.gitlab.com/ee/ci/yaml/index.html#rulesexists) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism) |
| [`rules:if`](https://docs.gitlab.com/ee/ci/yaml/index.html#rulesif) | 不           | 不适用                   | 该变量必须采用 的形式`$variable`。不支持以下内容：  -`CI_ENVIRONMENT_SLUG`变量。 -[持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |
| [`script`](https://docs.gitlab.com/ee/ci/yaml/index.html#script) | 是的         | 脚本执行外壳             | 变量扩展是由[执行 shell 环境](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#execution-shell-environment)进行的。 |
| [`services:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#services) | 是的         | 跑步者                   | 变量扩展是由GitLab Runner[内部的变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)完成的。 |
| [`services`](https://docs.gitlab.com/ee/ci/yaml/index.html#services) | 是的         | 跑步者                   | 变量扩展是由GitLab Runner[内部的变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)完成的。 |
| [`tags`](https://docs.gitlab.com/ee/ci/yaml/index.html#tags) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)在 GitLab 14.1 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/35742) |
| [`trigger`和`trigger:project`](https://docs.gitlab.com/ee/ci/yaml/index.html#trigger) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)GitLab 15.3 中`trigger:project` [引入了](https://gitlab.com/gitlab-org/gitlab/-/issues/367660)变量扩展。 |
| [`variables`](https://docs.gitlab.com/ee/ci/yaml/index.html#variables) | 是的         | 亚搏体育appGitLab/跑步者 | 变量扩展首先由GitLab 中的[内部变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)进行，然后任何无法识别或不可用的变量都会由 GitLab Runner 的[内部变量扩展机制](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)进行扩展。 |
| [`workflow:name`](https://docs.gitlab.com/ee/ci/yaml/index.html#workflowname) | 是的         | GitLab                   | 变量扩展是由GitLab[内部的变量扩展机制完成的。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-internal-variable-expansion-mechanism)  支持以下中可用的所有变量`workflow`： - 项目/组变量。 - 全局`variables`和`workflow:rules:variables`（匹配规则时）。 - 从父管道继承的变量。 - 来自触发器的变量。 - 管道计划中的变量。  不支持在 GitLab Runner 中定义的变量`config.toml`、在 jobs 中定义的变量或[Persisted Variables](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。 |

### `config.toml`文件

| 定义                                 | 可以扩展吗？ | 描述                                                         |
| :----------------------------------- | :----------- | :----------------------------------------------------------- |
| `runners.environment`                | 是的         | 变量扩展是由GitLab Runner[内部的变量扩展机制完成的](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism) |
| `runners.kubernetes.pod_labels`      | 是的         | 变量扩展是由GitLab Runner[内部变量扩展机制完成的](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism) |
| `runners.kubernetes.pod_annotations` | 是的         | 变量扩展是由GitLab Runner[内部变量扩展机制完成的](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism) |

`config.toml`您可以在[GitLab Runner 文档](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)中阅读更多相关信息。

## 扩张机制

共有三种扩展机制：

- GitLab
- 亚搏体育app亚搏体育app亚搏体育app运行
- 执行shell环境

### GitLab 内部变量扩展机制

扩展部分需要采用`$variable`, 或`${variable}`或 的形式`%variable%`。无论哪个操作系统/shell 处理作业，每个表单都以相同的方式处理，因为扩展是在任何运行程序获得作业之前在 GitLab 中完成的。

#### 嵌套变量扩展

- 在 GitLab 13.10 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/48627)[部署在`variable_inside_variable`功能标志](https://docs.gitlab.com/ee/user/feature_flags.html)后面，默认禁用。
- [在 GitLab 14.3 中在 GitLab.com 上启用](https://gitlab.com/gitlab-org/gitlab/-/issues/297382)。
- [在 GitLab 14.4 中启用自我管理](https://gitlab.com/gitlab-org/gitlab/-/issues/297382)。
- `variable_inside_variable`GitLab 14.5 中删除了功能标志。

GitLab 在将作业变量值发送到运行器之前会递归地扩展它们。例如，在以下场景中：

```
- BUILD_ROOT_DIR: '${CI_BUILDS_DIR}'
- OUT_PATH: '${BUILD_ROOT_DIR}/out'
- PACKAGE_PATH: '${OUT_PATH}/pkg'
```

跑步者收到一条有效的、完整的路径。例如，如果`${CI_BUILDS_DIR}`是`/output`，则将`PACKAGE_PATH`是`/output/out/pkg`。

对不可用变量的引用保持不变。在这种情况下，运行程序 [会尝试在运行时扩展变量值](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-runner-internal-variable-expansion-mechanism)。例如，像这样的变量`CI_BUILDS_DIR`仅在运行时才被跑步者所知。

### GitLab Runner内部变量扩展机制

- 支持：项目/组变量、`.gitlab-ci.yml`触发器变量、`config.toml`变量以及来自触发器、管道计划和手动管道的变量。
- 不支持：在脚本内部定义的变量（例如，`export MY_VARIABLE="test"`）。

运行器使用 Go 的`os.Expand()`方法进行变量扩展。这意味着它仅处理定义为`$variable`和 的变量`${variable}`。同样重要的是，扩展仅进行一次，因此嵌套变量可能会也可能不会起作用，具体取决于变量定义的顺序以及 GitLab 中是否启用了[嵌套变量扩展。](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#nested-variable-expansion)

### 执行shell环境

这是执行期间发生的扩展阶段`script`。其行为取决于所使用的 shell（`bash`、`sh`、`cmd`、 PowerShell）。例如，如果作业 `script`包含 line `echo $MY_VARIABLE-${MY_VARIABLE_2}`，则应由 bash/sh 正确处理（保留空字符串或一些值，具体取决于变量是否已定义），但不能与 Windows`cmd`或 PowerShell 一起使用，因为这些 shell使用不同的变量语法。

支持的：

- 可以`script`使用 shell 默认的所有可用变量（例如，`$PATH`应该存在于所有 bash/sh shell 中）以及 GitLab CI/CD 定义的所有变量（项目/组变量、触发器 `.gitlab-ci.yml`变量、`config.toml`变量和变量）和管道计划）。

- 还

  ```
  script
  ```

  可以使用之前行中定义的所有变量。因此，例如，如果您定义一个变量

  ```
  export MY_VARIABLE="test"
  ```

  ：

  - 中`before_script`，它适用于后续行`before_script`以及相关的所有行`script`。
  - 在 中`script`，它在 的后续行中起作用`script`。
  - 在 中`after_script`，它在 的后续行中起作用`after_script`。

对于`after_script`脚本，他们可以：

- 仅使用同一部分中脚本之前定义的变量`after_script` 。
- 不使用`before_script`和中定义的变量`script`。

存在这些限制是因为`after_script`脚本是在 [单独的 shell 上下文](https://docs.gitlab.com/ee/ci/yaml/index.html#after_script)中执行的。

## 持久变量

一些预定义变量称为“持久变量”。持久变量有：

- 支持

  “扩展位置”

  为的定义：

  - 跑步者。
  - 脚本执行外壳。

- 不支持：

  - 对于[“扩展位置”](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)是 GitLab 的定义。
  - `rules`在、`only`和`except` [变量表达式](https://docs.gitlab.com/ee/ci/jobs/job_control.html#cicd-variable-expressions)中。

[管道触发器作业](https://docs.gitlab.com/ee/ci/yaml/index.html#trigger)不能使用作业级持久变量，但可以使用管道级持久变量。

某些持久变量包含令牌，由于安全原因，某些定义无法使用它们。

管道级持久变量：

- `CI_PIPELINE_ID`
- `CI_PIPELINE_URL`

作业级持久变量：

- `CI_DEPLOY_PASSWORD`
- `CI_DEPLOY_USER`
- `CI_JOB_ID`
- `CI_JOB_STARTED_AT`
- `CI_JOB_TOKEN`
- `CI_JOB_URL`
- `CI_REGISTRY_PASSWORD`
- `CI_REGISTRY_USER`
- `CI_REPOSITORY_URL`

特定集成的持久变量：

- 港口

  ：

  - `HARBOR_URL`
  - `HARBOR_HOST`
  - `HARBOR_OCI`
  - `HARBOR_PROJECT`
  - `HARBOR_USERNAME`
  - `HARBOR_PASSWORD`

- 苹果应用商店连接

  ：

  - `APP_STORE_CONNECT_API_KEY_ISSUER_ID`
  - `APP_STORE_CONNECT_API_KEY_KEY_ID`
  - `APP_STORE_CONNECT_API_KEY_KEY`
  - `APP_STORE_CONNECT_API_KEY_IS_KEY_CONTENT_BASE64`

- 谷歌播放

  ：

  - `SUPPLY_PACKAGE_NAME`
  - `SUPPLY_JSON_KEY_DATA`

- Diffblue 封面

  ：

  - `DIFFBLUE_LICENSE_KEY`
  - `DIFFBLUE_ACCESS_TOKEN_NAME`
  - `DIFFBLUE_ACCESS_TOKEN`

## 具有环境作用域的变量

支持使用环境范围定义的变量。假设`$STAGING_SECRET`在 的范围内定义 了一个变量`review/staging/*`，则根据匹配的变量表达式创建使用动态环境的以下作业：

```
my-job:
  stage: staging
  environment:
    name: review/$CI_JOB_STAGE/deploy
  script:
    - 'deploy staging'
  rules:
    - if: $STAGING_SECRET == 'something'
```
