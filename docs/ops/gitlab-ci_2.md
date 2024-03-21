---
title: gitlab-ci API 参考
order: 2
group:
  title: Gitlab 安装与使用
  order: 5
---
# gitlab-ci API 参考

![image-20240321105306187](./gitlab-ci_2.assets/image-20240321105306187.png)

文档参考：https://docs.gitlab.com/ee/ci/yaml/

本文档列出了 GitLab 文件的配置选项`.gitlab-ci.yml`。

- 有关 GitLab CI/CD 的快速介绍，请遵循[快速入门指南](https://docs.gitlab.com/ee/ci/quick_start/index.html)。
- 有关示例集合，请参阅[GitLab CI/CD 示例](https://docs.gitlab.com/ee/ci/examples/index.html)。
- `.gitlab-ci.yml`要查看企业中使用的大文件，请[`.gitlab-ci.yml`参阅`gitlab`](https://gitlab.com/gitlab-org/gitlab/-/blob/master/.gitlab-ci.yml).

当您编辑`.gitlab-ci.yml`文件时，可以使用 [CI Lint](https://docs.gitlab.com/ee/ci/lint.html)工具对其进行验证。

如果您要编辑此页面上的内容，请按照[记录关键字的说明](https://docs.gitlab.com/ee/development/cicd/cicd_reference_documentation_guide.html)进行操作。

## 关键词目录

GitLab CI/CD 管道配置包括：

- 配置管道行为的[全局关键字：](https://docs.gitlab.com/ee/ci/yaml/#global-keywords)

  | 关键词                                                       | 描述                                |
  | :----------------------------------------------------------- | :---------------------------------- |
  | [`default`](https://docs.gitlab.com/ee/ci/yaml/#default)     | 职位关键字的自定义默认值。          |
  | [`include`](https://docs.gitlab.com/ee/ci/yaml/#include)     | 从其他 YAML 文件导入配置。          |
  | [`stages`](https://docs.gitlab.com/ee/ci/yaml/#stages)       | 管道阶段的名称和顺序。              |
  | [`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables) | 为管道中的所有作业定义 CI/CD 变量。 |
  | [`workflow`](https://docs.gitlab.com/ee/ci/yaml/#workflow)   | 控制运行哪些类型的管道。            |

- 使用[job关键字配置的](https://docs.gitlab.com/ee/ci/yaml/#job-keywords)[职位](https://docs.gitlab.com/ee/ci/jobs/index.html)：

  | 关键词                                                       | 描述                                                         |
  | :----------------------------------------------------------- | :----------------------------------------------------------- |
  | [`after_script`](https://docs.gitlab.com/ee/ci/yaml/#after_script) | 覆盖作业后执行的一组命令。                                   |
  | [`allow_failure`](https://docs.gitlab.com/ee/ci/yaml/#allow_failure) | 允许作业失败。失败的作业不会导致管道失败。                   |
  | [`artifacts`](https://docs.gitlab.com/ee/ci/yaml/#artifacts) | 成功时附加到作业的文件和目录列表。                           |
  | [`before_script`](https://docs.gitlab.com/ee/ci/yaml/#before_script) | 覆盖在作业之前执行的一组命令。                               |
  | [`cache`](https://docs.gitlab.com/ee/ci/yaml/#cache)         | 应在后续运行之间缓存的文件列表。                             |
  | [`coverage`](https://docs.gitlab.com/ee/ci/yaml/#coverage)   | 给定作业的代码覆盖率设置。                                   |
  | [`dast_configuration`](https://docs.gitlab.com/ee/ci/yaml/#dast_configuration) | 在作业级别使用 DAST 配置文件中的配置。                       |
  | [`dependencies`](https://docs.gitlab.com/ee/ci/yaml/#dependencies) | 通过提供从中获取工件的作业列表来限制将哪些工件传递到特定作业。 |
  | [`environment`](https://docs.gitlab.com/ee/ci/yaml/#environment) | 作业部署到的环境的名称。                                     |
  | [`except`](https://docs.gitlab.com/ee/ci/yaml/#only--except) | 控制何时不创造就业机会。                                     |
  | [`extends`](https://docs.gitlab.com/ee/ci/yaml/#extends)     | 该作业继承的配置条目。                                       |
  | [`image`](https://docs.gitlab.com/ee/ci/yaml/#image)         | 使用 Docker 镜像。                                           |
  | [`inherit`](https://docs.gitlab.com/ee/ci/yaml/#inherit)     | 选择所有作业继承的全局默认值。                               |
  | [`interruptible`](https://docs.gitlab.com/ee/ci/yaml/#interruptible) | 定义当作业因较新的运行而变得冗余时是否可以取消。             |
  | [`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)         | 早于阶段排序执行作业。                                       |
  | [`only`](https://docs.gitlab.com/ee/ci/yaml/#only--except)   | 控制何时创造就业机会。                                       |
  | [`pages`](https://docs.gitlab.com/ee/ci/yaml/#pages)         | 上传作业结果以与 GitLab Pages 一起使用。                     |
  | [`parallel`](https://docs.gitlab.com/ee/ci/yaml/#parallel)   | 一个作业应该并行运行多少个实例。                             |
  | [`release`](https://docs.gitlab.com/ee/ci/yaml/#release)     | 指示运行器生成[释放](https://docs.gitlab.com/ee/user/project/releases/index.html)对象。 |
  | [`resource_group`](https://docs.gitlab.com/ee/ci/yaml/#resource_group) | 限制作业并发。                                               |
  | [`retry`](https://docs.gitlab.com/ee/ci/yaml/#retry)         | 发生故障时作业可以自动重试的时间和次数。                     |
  | [`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)         | 用于评估和确定作业的选定属性以及是否创建作业的条件列表。     |
  | [`script`](https://docs.gitlab.com/ee/ci/yaml/#script)       | 由运行器执行的 Shell 脚本。                                  |
  | [`secrets`](https://docs.gitlab.com/ee/ci/yaml/#secrets)     | CI/CD 隐藏了工作需求。                                       |
  | [`services`](https://docs.gitlab.com/ee/ci/yaml/#services)   | 使用 Docker 服务镜像。                                       |
  | [`stage`](https://docs.gitlab.com/ee/ci/yaml/#stage)         | 定义工作阶段。                                               |
  | [`tags`](https://docs.gitlab.com/ee/ci/yaml/#tags)           | 用于选择跑步者的标签列表。                                   |
  | [`timeout`](https://docs.gitlab.com/ee/ci/yaml/#timeout)     | 定义优先于项目范围设置的自定义作业级别超时。                 |
  | [`trigger`](https://docs.gitlab.com/ee/ci/yaml/#trigger)     | 定义下游管道触发器。                                         |
  | [`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables) | 在工作级别定义工作变量。                                     |
  | [`when`](https://docs.gitlab.com/ee/ci/yaml/#when)           | 何时运行作业。                                               |

## global 关键词

某些关键字未在作业中定义。这些关键字控制管道行为或导入其他管道配置。

### `default`

您可以为某些关键字设置全局默认值。未定义一个或多个列出的关键字的作业将使用该`default`部分中定义的值。

**关键字类型**：全局关键字。

**可能的输入**：这些关键字可以有自定义默认值：

- [`after_script`](https://docs.gitlab.com/ee/ci/yaml/#after_script)
- [`artifacts`](https://docs.gitlab.com/ee/ci/yaml/#artifacts)
- [`before_script`](https://docs.gitlab.com/ee/ci/yaml/#before_script)
- [`cache`](https://docs.gitlab.com/ee/ci/yaml/#cache)
- [`hooks`](https://docs.gitlab.com/ee/ci/yaml/#hooks)
- [`image`](https://docs.gitlab.com/ee/ci/yaml/#image)
- [`interruptible`](https://docs.gitlab.com/ee/ci/yaml/#interruptible)
- [`retry`](https://docs.gitlab.com/ee/ci/yaml/#retry)
- [`services`](https://docs.gitlab.com/ee/ci/yaml/#services)
- [`tags`](https://docs.gitlab.com/ee/ci/yaml/#tags)
- [`timeout`](https://docs.gitlab.com/ee/ci/yaml/#timeout)

**示例`default`**：

```
default:
  image: ruby:3.0

rspec:
  script: bundle exec rspec

rspec 2.7:
  image: ruby:2.7
  script: bundle exec rspec
```

在此示例中，是管道中所有作业的`ruby:3.0`默认值。`image`该`rspec 2.7`作业不使用默认值，因为它使用特定于作业的`image`部分覆盖默认值：

**其他详细信息**：

- 创建管道时，每个默认值都会复制到未定义该关键字的所有作业。
- 如果作业已配置了其中一个关键字，则作业中的配置优先，并且不会被默认替换。
- 使用 . 控制作业中默认关键字的继承[`inherit:default`](https://docs.gitlab.com/ee/ci/yaml/#inheritdefault)。

### `include`

[在 11.4 中迁移](https://gitlab.com/gitlab-org/gitlab-foss/-/issues/42861)到 GitLab 免费版。

用于`include`在 CI/CD 配置中包含外部 YAML 文件。您可以将一个长`.gitlab-ci.yml`文件拆分为多个文件以提高可读性，或减少同一配置在多个位置的重复。

您还可以将模板文件存储在中央存储库中并将其包含在项目中。

这些`include`文件是：

- 与文件中的内容合并`.gitlab-ci.yml`。
- `.gitlab-ci.yml`无论关键字的位置如何，始终先评估，然后与文件内容合并`include`。

解析所有文件的时间限制为 30 秒。

**关键字类型**：全局关键字。

**可能的输入**：`include`子项：

- [`include:local`](https://docs.gitlab.com/ee/ci/yaml/#includelocal)
- [`include:project`](https://docs.gitlab.com/ee/ci/yaml/#includeproject)
- [`include:remote`](https://docs.gitlab.com/ee/ci/yaml/#includeremote)
- [`include:template`](https://docs.gitlab.com/ee/ci/yaml/#includetemplate)

**其他详细信息**：

- 只有[某些 CI/CD 变量](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)可以与关键字一起使用`include`。

- 使用合并来自定义和覆盖本地包含的 CI/CD 配置

- 您可以通过在文件中使用相同的作业名称或全局关键字来覆盖包含的配置`.gitlab-ci.yml`。两个配置合并在一起，`.gitlab-ci.yml`文件中的配置优先于包含的配置。

- 如果您重新运行：

  - 作业，`include`不会再次获取文件。管道中的所有作业都使用创建管道时获取的配置。对源`include`文件的任何更改都不会影响作业重新运行。
  - 管道，`include`再次获取文件。如果它们在上次管道运行后发生更改，则新管道将使用更改后的配置。

- 默认情况下，每个管道最多可以有 150 个包含，包括

  嵌套的

  . 此外：

  - 在[GitLab 16.0 及更高版本](https://gitlab.com/gitlab-org/gitlab/-/issues/207270)中，自我管理用户可以更改[最大包含](https://docs.gitlab.com/ee/administration/settings/continuous_integration.html#maximum-includes)值。
  - 在[GitLab 15.10 及更高版本](https://gitlab.com/gitlab-org/gitlab/-/issues/367150)中，您最多可以有 150 个包含。在嵌套包含中，可以多次包含同一文件，但重复的包含将计入限制。
  - 从[GitLab 14.9 到 GitLab 15.9](https://gitlab.com/gitlab-org/gitlab/-/issues/28987)，您最多可以有 100 个包含。同一文件可以在嵌套包含中多次包含，但重复的文件将被忽略。
  - 在 GitLab 14.9 及更早版本中，您最多可以包含 100 个包含，但同一文件不能包含多次。

**相关主题**：

- [将变量与 一起使用`include`](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。
- [`rules`与 一起使用`include`](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-rules-with-include)。

#### `include:local`

用于`include:local`包含与包含关键字的配置文件位于同一存储库和分支中的文件`include`。使用`include:local`而不是符号链接。

**关键字类型**：全局关键字。

**可能的输入**：

相对于根目录的完整路径 ( `/`)：

- YAML 文件必须具有扩展名`.yml`或`.yaml`.
- 您可以[在文件路径中](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-includelocal-with-wildcard-file-paths)[使用`*`和`**`](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-includelocal-with-wildcard-file-paths)通配符。
- 您可以使用[某些 CI/CD 变量](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。

**示例`include:local`**：

```
include:
  - local: '/templates/.gitlab-ci-template.yml'
```

您还可以使用更短的语法来定义路径：

```
include: '.gitlab-ci-production.yml'
```

**其他详细信息**：

- 该`.gitlab-ci.yml`文件和本地文件必须位于同一分支上。
- 您无法通过 Git 子模块路径包含本地文件。
- 所有[嵌套包含都](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-nested-includes)在包含带有关键字的配置文件的项目范围内执行`include`，而不是在运行管道的项目范围内执行。您可以使用本地、项目、远程或模板包含。

#### `include:project`

[包括 GitLab 13.6 中引入的](https://gitlab.com/gitlab-org/gitlab/-/issues/26793)同一项目中的多个文件。GitLab 13.8 中[删除了功能标志。](https://gitlab.com/gitlab-org/gitlab/-/issues/271560)

要包含同一 GitLab 实例上另一个私有项目的文件，请使用`include:project`和`include:file`。

**关键字类型**：全局关键字。

**可能的输入**：

- `include:project`：完整的 GitLab 项目路径。
- `include:file`相对于根目录 ( ) 的完整文件路径或文件路径数组`/`。YAML 文件必须具有`.yml`或`.yaml`扩展名。
- `include:ref`： 选修的。从中检索文件的引用。未指定时默认为`HEAD`项目的。
- 您可以使用[某些 CI/CD 变量](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。

**示例`include:project`**：

```
include:
  - project: 'my-group/my-project'
    file: '/templates/.gitlab-ci-template.yml'
  - project: 'my-group/my-subgroup/my-project-2'
    file:
      - '/templates/.builds.yml'
      - '/templates/.tests.yml'
```

您还可以指定`ref`：

```
include:
  - project: 'my-group/my-project'
    ref: main                                      # Git branch
    file: '/templates/.gitlab-ci-template.yml'
  - project: 'my-group/my-project'
    ref: v1.0.0                                    # Git Tag
    file: '/templates/.gitlab-ci-template.yml'
  - project: 'my-group/my-project'
    ref: 787123b47f14b552955ca2786bc9542ae66fee5b  # Git SHA
    file: '/templates/.gitlab-ci-template.yml'
```

**其他详细信息**：

- 所有[嵌套包含都](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-nested-includes)在包含带有nested关键字的配置文件的项目范围内执行`include`。您可以使用`local`（相对于包含带有关键字的配置文件的项目`include`）、`project`、`remote`或`template`include。
- 当管道启动时，`.gitlab-ci.yml`将评估所有方法包含的文件配置。配置是时间快照并保留在数据库中。`.gitlab-ci.yml`在下一个管道启动之前，GitLab 不会反映对引用的文件配置的任何更改。
- 当您包含来自另一个私有项目的 YAML 文件时，运行管道的用户必须是两个项目的成员，并且具有运行管道的适当权限。`not found or access denied`如果用户无权访问任何包含的文件，则可能会显示错误。

#### `include:remote`

与完整 URL 一起使用`include:remote`以包含来自不同位置的文件。

**关键字类型**：全局关键字。

**可能的输入**：

可通过 HTTP/HTTPS 请求访问的公共 URL `GET`：

- 不支持使用远程 URL 进行身份验证。
- YAML 文件必须具有扩展名`.yml`或`.yaml`.
- 您可以使用[某些 CI/CD 变量](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。

**示例`include:remote`**：

```
include:
  - remote: 'https://gitlab.com/example-project/-/raw/main/.gitlab-ci.yml'
```

**其他详细信息**：

- 所有[嵌套包含都](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-nested-includes)以公共用户身份在没有上下文的情况下执行，因此您只能包含公共项目或模板。
- 包含远程 CI/CD 配置文件时要小心。当外部 CI/CD 配置文件更改时，不会触发任何管道或通知。从安全角度来看，这类似于拉取第三方依赖项。

#### `include:template`

用于`include:template`包含[`.gitlab-ci.yml`模板](https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates)。

**关键字类型**：全局关键字。

**可能的输入**：

CI [/CD 模板](https://docs.gitlab.com/ee/ci/examples/index.html#cicd-templates)：

- 模板存储在[`lib/gitlab/ci/templates`](https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates). 并非所有模板都设计为与 一起使用`include:template`，因此在使用模板之前请检查模板注释。
- 您可以使用[某些 CI/CD 变量](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。

**示例`include:template`**：

```
# File sourced from the GitLab template collection
include:
  - template: Auto-DevOps.gitlab-ci.yml
```

多个`include:template`文件：

```
include:
  - template: Android-Fastlane.gitlab-ci.yml
  - template: Auto-DevOps.gitlab-ci.yml
```

**其他详细信息**：

- 所有[嵌套包含](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-nested-includes)仅在用户许可的情况下执行，因此可以使用`project`、`remote`或`template`include。

### `stages`

用于`stages`定义包含作业组的阶段。在作业中使用[`stage`](https://docs.gitlab.com/ee/ci/yaml/#stage) 将作业配置为在特定阶段运行。

如果文件`stages`中未定义`.gitlab-ci.yml`，则默认管道阶段为：

- [`.pre`](https://docs.gitlab.com/ee/ci/yaml/#stage-pre)
- `build`
- `test`
- `deploy`
- [`.post`](https://docs.gitlab.com/ee/ci/yaml/#stage-post)

中项目的顺序`stages`定义了作业的执行顺序：

- 同一阶段的作业并行运行。
- 下一个阶段的作业在上一个阶段的作业成功完成后运行。

如果管道仅包含`.pre`或`.post`阶段中的作业，则它不会运行。不同阶段必须至少有一项其他工作。`.pre`和阶段可以在[所需的管道配置](https://docs.gitlab.com/ee/administration/settings/continuous_integration.html#required-pipeline-configuration)`.post`中使用 ，以定义必须在项目管道作业之前或之后运行的合规性作业。

**关键字类型**：全局关键字。

**示例`stages`**：

```
stages:
  - build
  - test
  - deploy
```

在这个例子中：

1. 所有作业`build`并行执行。
2. 如果所有作业均`build`成功，则`test`作业将并行执行。
3. 如果所有作业均`test`成功，则`deploy`作业将并行执行。
4. 如果所有作业均`deploy`成功，则管道将标记为`passed`。

如果任何作业失败，管道将被标记为`failed`，并且后续阶段的作业不会启动。当前阶段的作业不会停止并继续运行。

**其他详细信息**：

- 如果作业未指定 a [`stage`](https://docs.gitlab.com/ee/ci/yaml/#stage)，则为该作业分配`test`阶段。

- 如果定义了阶段但没有作业使用它，则该阶段在管道中不可见，这可以帮助

  合规性管道配置

  ：

  - 可以在合规性配置中定义阶段，但如果不使用则保持隐藏。
  - 当开发人员在作业定义中使用定义的阶段时，它们就会变得可见。

**相关主题**：

- 要使作业更早开始并忽略阶段顺序，请使用关键字[`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)。

### `workflow`

GitLab 12.5 中[引入](https://gitlab.com/gitlab-org/gitlab/-/issues/29654)

用于[`workflow`](https://docs.gitlab.com/ee/ci/yaml/workflow.html)控制管道行为。

**相关主题**：

- [`workflow: rules`例子](https://docs.gitlab.com/ee/ci/yaml/workflow.html#workflow-rules-examples)
- [在分支管道和合并请求管道之间切换](https://docs.gitlab.com/ee/ci/yaml/workflow.html#switch-between-branch-pipelines-and-merge-request-pipelines)

#### `workflow:name`

版本历史 

您可以使用`name`in`workflow:`定义管道的名称。

所有管道都分配有定义的名称。名称中的任何前导或尾随空格都将被删除。

**可能的输入**：

- 一根绳子。
- [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。
- 两者的结合。

**示例`workflow:name`**：

带有预定义变量的简单管道名称：

```
workflow:
  name: 'Pipeline for branch: $CI_COMMIT_BRANCH'
```

根据管道条件具有不同管道名称的配置：

```
variables:
  PROJECT1_PIPELINE_NAME: 'Default pipeline name'  # A default is not required.

workflow:
  name: '$PROJECT1_PIPELINE_NAME'
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      variables:
        PROJECT1_PIPELINE_NAME: 'MR pipeline: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME'
    - if: '$CI_MERGE_REQUEST_LABELS =~ /pipeline:run-in-ruby3/'
      variables:
        PROJECT1_PIPELINE_NAME: 'Ruby 3 pipeline'
```

**其他详细信息**：

- 如果名称为空字符串，则不会为管道分配名称。如果所有变量也为空，则仅由 CI/CD 变量组成的名称的计算结果可能为空字符串。

- ```
  workflow:rules:variables
  ```

  成为所有作业中可用的

  全局变量

  ，包括

  `trigger`

  默认将变量转发到下游管道的作业。如果下游管道使用相同的变量，则该变量将 被上游变量值

  覆盖。

  请务必：

  - 在每个项目的管道配置中使用唯一的变量名称，例如`PROJECT1_PIPELINE_NAME`.
  - 在触发器作业中使用[`inherit:variables`](https://docs.gitlab.com/ee/ci/yaml/#inheritvariables)并列出要转发到下游管道的确切变量。

#### `workflow:rules`

关键字`rules`in 与[jobs 中定义](https://docs.gitlab.com/ee/ci/yaml/#rules)`workflow`的类似，但控制是否创建整个管道。[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)

当没有规则评估为 true 时，管道不会运行。

**可能的输入**：您可以使用一些与职位级别相同的关键字[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)：

- [`rules: if`](https://docs.gitlab.com/ee/ci/yaml/#rulesif)。
- [`rules: changes`](https://docs.gitlab.com/ee/ci/yaml/#ruleschanges)。
- [`rules: exists`](https://docs.gitlab.com/ee/ci/yaml/#rulesexists)。
- [`when`](https://docs.gitlab.com/ee/ci/yaml/#when), 只能与`always`或`never`一起使用`workflow`。
- [`variables`](https://docs.gitlab.com/ee/ci/yaml/#workflowrulesvariables)。

**示例`workflow:rules`**：

```
workflow:
  rules:
    - if: $CI_COMMIT_TITLE =~ /-draft$/
      when: never
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

在此示例中，如果提交标题（提交消息的第一行）不以以下内容结尾，`-draft` 并且管道适用于以下任一情况，则管道将运行：

- 合并请求
- 默认分支。

**其他详细信息**：

- 如果您的规则与分支管道（默认分支除外）和合并请求管道都匹配，则 可能会出现[重复管道](https://docs.gitlab.com/ee/ci/jobs/job_control.html#avoid-duplicate-pipelines)。

**相关主题**：

- 您可以使用[`workflow:rules`模板](https://docs.gitlab.com/ee/ci/yaml/workflow.html#workflowrules-templates)导入预配置的`workflow: rules`条目。
- [的通用`if`条款`workflow:rules`](https://docs.gitlab.com/ee/ci/yaml/workflow.html#common-if-clauses-for-workflowrules)。
- [用于`rules`运行合并请求管道](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html#use-rules-to-add-jobs)。

#### `workflow:rules:variables`

版本历史 

您可以使用[`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables)in`workflow:rules`来定义特定管道条件的变量。

当条件匹配时，将创建变量并可供管道中的所有作业使用。如果该变量已在全局级别定义，则该`workflow` 变量优先并覆盖全局变量。

**关键字类型**：全局关键字。

**可能的输入**：变量名称和值对：

- 该名称只能使用数字、字母和下划线 ( `_`)。
- 该值必须是字符串。

**示例`workflow:rules:variables`**：

```
variables:
  DEPLOY_VARIABLE: "default-deploy"

workflow:
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      variables:
        DEPLOY_VARIABLE: "deploy-production"  # Override globally-defined DEPLOY_VARIABLE
    - if: $CI_COMMIT_REF_NAME =~ /feature/
      variables:
        IS_A_FEATURE: "true"                  # Define a new variable.
    - when: always                            # Run the pipeline in other cases

job1:
  variables:
    DEPLOY_VARIABLE: "job1-default-deploy"
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      variables:                                   # Override DEPLOY_VARIABLE defined
        DEPLOY_VARIABLE: "job1-deploy-production"  # at the job level.
    - when: on_success                             # Run the job in other cases
  script:
    - echo "Run script with $DEPLOY_VARIABLE as an argument"
    - echo "Run another script if $IS_A_FEATURE exists"

job2:
  script:
    - echo "Run script with $DEPLOY_VARIABLE as an argument"
    - echo "Run another script if $IS_A_FEATURE exists"
```

当分支为默认分支时：

- job1`DEPLOY_VARIABLE`是`job1-deploy-production`.
- job2`DEPLOY_VARIABLE`是`deploy-production`.

当分支是`feature`：

- job1`DEPLOY_VARIABLE`是`job1-default-deploy`，并且`IS_A_FEATURE`是`true`。
- job2`DEPLOY_VARIABLE`是`default-deploy`，并且`IS_A_FEATURE`是`true`。

当分支是其他东西时：

- job1`DEPLOY_VARIABLE`是`job1-default-deploy`.
- job2`DEPLOY_VARIABLE`是`default-deploy`.

**其他详细信息**：

- ```
  workflow:rules:variables
  ```

  成为所有作业中可用的

  全局变量

  ，包括

  `trigger`

  默认将变量转发到下游管道的作业。如果下游管道使用相同的变量，则该变量将 被上游变量值

  覆盖。

  请务必：

  - 在每个项目的管道配置中使用唯一的变量名称，例如`PROJECT1_VARIABLE_NAME`.
  - 在触发器作业中使用[`inherit:variables`](https://docs.gitlab.com/ee/ci/yaml/#inheritvariables)并列出要转发到下游管道的确切变量。

## job 关键词

以下主题介绍如何使用关键字配置 CI/CD 管道。

### `after_script`

用于`after_script`定义在每个作业（包括失败的作业）之后运行的命令数组。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：一个数组，包括：

- 单行命令。
- 长命令[分成多行](https://docs.gitlab.com/ee/ci/yaml/script.html#split-long-commands)。
- [YAML 锚点](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#yaml-anchors-for-scripts)。

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`after_script`**：

```
job:
  script:
    - echo "An example script section."
  after_script:
    - echo "Execute this command after the `script` section completes."
```

**其他详细信息**：

您指定的脚本`after_script`在新 shell 中执行，与任何 `before_script`命令分开`script`。结果，他们：

- 将当前工作目录设置回默认值（根据[定义运行程序如何处理 Git 请求的变量](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#configure-runner-behavior-with-variables)）。

- 无权访问 或 中定义的命令所做的更改

  ```
  before_script
  ```

  ```
  script
  ```
  
  包括：

  - 脚本中导出的命令别名和变量`script`。
  - 工作树外部的更改（取决于运行程序执行器），例如由`before_script`或`script`脚本安装的软件。
  
- 有一个单独的超时，[硬编码为 5 分钟](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/2716)。

- 不影响作业的退出代码。如果该`script`部分成功但 `after_script`超时或失败，作业将退出并显示代码`0`( `Job Succeeded`)。

如果作业超时或被取消，则`after_script`不会执行命令。 添加对超时或取消作业执行命令的支持[存在问题。](https://gitlab.com/gitlab-org/gitlab/-/issues/15603)`after_script`

**相关主题**：

- [使用`after_script`with`default`](https://docs.gitlab.com/ee/ci/yaml/script.html#set-a-default-before_script-or-after_script-for-all-jobs) 定义应在所有作业之后运行的默认命令数组。
- 您可以[忽略非零退出代码](https://docs.gitlab.com/ee/ci/yaml/script.html#ignore-non-zero-exit-codes)。
- [使用颜色代码可以`after_script`](https://docs.gitlab.com/ee/ci/yaml/script.html#add-color-codes-to-script-output) 使作业日志更易于查看。
- [创建自定义可折叠部分](https://docs.gitlab.com/ee/ci/jobs/index.html#custom-collapsible-sections) 以简化作业日志输出。

### `allow_failure`

用于`allow_failure`确定作业失败时管道是否应继续运行。

- 要让管道继续运行后续作业，请使用`allow_failure: true`.
- 要停止管道运行后续作业，请使用`allow_failure: false`.

当允许作业失败 ( `allow_failure: true`) 时，橙色警告 ( ) 表示作业失败。但是，管道成功，并且关联的提交被标记为已通过且没有警告。

在以下情况下会显示相同的警告：

- 该阶段的所有其他工作均成功。
- 管道中的所有其他作业均成功。

默认值为`allow_failure`：

- `true`对于[体力工作](https://docs.gitlab.com/ee/ci/jobs/job_control.html#create-a-job-that-must-be-run-manually)。
- `false`对于使用`when: manual`inside 的作业[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)。
- `false`在所有其他情况下。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `true`或`false`。

**示例`allow_failure`**：

```
job1:
  stage: test
  script:
    - execute_script_1

job2:
  stage: test
  script:
    - execute_script_2
  allow_failure: true

job3:
  stage: deploy
  script:
    - deploy_to_staging
  environment: staging
```

在本例中，`job1`并行`job2`运行：

- 如果`job1`失败，该`deploy`阶段的作业不会启动。
- 如果`job2`失败，该`deploy`阶段的作业仍然可以启动。

**其他详细信息**：

- 您可以用作`allow_failure`的子项[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rulesallow_failure)。
- 如果`allow_failure: true`设置了该作业，则该作业始终被认为是成功的，[`when: on_failure`](https://docs.gitlab.com/ee/ci/yaml/#when)如果该作业失败，则后面的作业将不会启动。
- 您可以`allow_failure: false`与手动作业一起使用来创建[阻塞手动作业](https://docs.gitlab.com/ee/ci/jobs/job_control.html#types-of-manual-jobs)。在手动作业启动并成功完成之前，阻塞的管道不会在后续阶段运行任何作业。

#### `allow_failure:exit_codes`

版本历史 

用于`allow_failure:exit_codes`控制何时允许作业失败。该作业适用`allow_failure: true`于任何列出的退出代码，而`allow_failure`对于任何其他退出代码则为 false。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 单个退出代码。
- 退出代码数组。

**示例`allow_failure`**：

```
test_job_1:
  script:
    - echo "Run a script that results in exit code 1. This job fails."
    - exit 1
  allow_failure:
    exit_codes: 137

test_job_2:
  script:
    - echo "Run a script that results in exit code 137. This job is allowed to fail."
    - exit 137
  allow_failure:
    exit_codes:
      - 137
      - 255
```

### `artifacts`

用于`artifacts`指定将哪些文件另存为[作业工件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html)。作业工件是作业[成功、失败或始终](https://docs.gitlab.com/ee/ci/yaml/#artifactswhen)时附加到作业的文件和目录的列表。

作业完成后，工件将发送到 GitLab。如果大小小于 [最大工件大小](https://docs.gitlab.com/ee/user/gitlab_com/index.html#gitlab-cicd)，则可以在 GitLab UI 中下载它们。

默认情况下，后期阶段的作业会自动下载早期阶段作业创建的所有工件。您可以使用 来控制作业中的工件下载行为 [`dependencies`](https://docs.gitlab.com/ee/ci/yaml/#dependencies)。

使用[`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)关键字时，作业只能从`needs`配置中定义的作业下载工件。

[默认情况下，仅收集成功作业的作业工件，并在缓存](https://docs.gitlab.com/ee/ci/yaml/#cache)后恢复工件。

[阅读有关文物的更多信息](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html)。

#### `artifacts:paths`

路径是相对于项目目录 ( `$CI_PROJECT_DIR`) 的，不能直接链接到其外部。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 相对于项目目录的文件路径数组。

- 

  您可以使用使用全局

  模式的通配符 ，并且：

  - 在[GitLab Runner 13.0 及更高版本](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/2620)中， [`doublestar.Glob`](https://pkg.go.dev/github.com/bmatcuk/doublestar@v1.2.2?tab=doc#Match).
  - 在 GitLab Runner 12.10 及更早版本中，[`filepath.Match`](https://pkg.go.dev/path/filepath#Match).

**示例`artifacts:paths`**：

```
job:
  artifacts:
    paths:
      - binaries/
      - .config
```

`.config`此示例使用目录中的所有文件创建一个工件`binaries`。

**其他详细信息**：

- 如果不与 一起使用[`artifacts:name`](https://docs.gitlab.com/ee/ci/yaml/#artifactsname)，则工件文件将被命名为`artifacts`，下载时会变成`artifacts.zip`。

**相关主题**：

- 要限制特定作业从哪些作业获取工件，请参阅[`dependencies`](https://docs.gitlab.com/ee/ci/yaml/#dependencies)。
- [创建工作工件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#create-job-artifacts)。

#### `artifacts:exclude`

版本历史 

用于`artifacts:exclude`防止将文件添加到工件存档中。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 相对于项目目录的文件路径数组。
- 您可以使用使用[全局](https://en.wikipedia.org/wiki/Glob_(programming))或 [`doublestar.PathMatch`](https://pkg.go.dev/github.com/bmatcuk/doublestar@v1.2.2?tab=doc#PathMatch)模式的通配符。

**示例`artifacts:exclude`**：

```
artifacts:
  paths:
    - binaries/
  exclude:
    - binaries/**/*.o
```

此示例将所有文件存储在 中`binaries/`，但不`*.o`存储位于 的子目录中的文件`binaries/`。

**其他详细信息**：

- `artifacts:exclude`路径不是递归搜索的。
- [`artifacts:untracked`](https://docs.gitlab.com/ee/ci/yaml/#artifactsuntracked)也可以使用 排除 匹配的文件`artifacts:exclude`。

**相关主题**：

- [从作业工件中排除文件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#without-excluded-files)。

#### `artifacts:expire_in`

版本历史 

用于`expire_in`指定[作业工件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html)在过期和删除之前存储的时间。该`expire_in`设置不会影响：

- [来自最新作业的工件，除非在项目级别](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#keep-artifacts-from-most-recent-successful-jobs)禁用保留最新作业工件 。或[实例范围](https://docs.gitlab.com/ee/administration/settings/continuous_integration.html#keep-the-latest-artifacts-for-all-jobs-in-the-latest-successful-pipelines)。

过期后，工件默认每小时删除一次（使用 cron 作业），并且不再可访问。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：到期时间。如果没有提供单位，则时间以秒为单位。有效值包括：

- `'42'`
- `42 seconds`
- `3 mins 4 sec`
- `2 hrs 20 min`
- `2h20min`
- `6 mos 1 day`
- `47 yrs 6 mos and 4d`
- `3 weeks and 2 days`
- `never`

**示例`artifacts:expire_in`**：

```
job:
  artifacts:
    expire_in: 1 week
```

**其他详细信息**：

- 过期时间段从工件上传并存储到 GitLab 时开始。如果未定义到期时间，则默认为[实例范围的设置](https://docs.gitlab.com/ee/administration/settings/continuous_integration.html#default-artifacts-expiration)。
- 要覆盖过期日期并保护工件不被自动删除：
  - 在作业页面上选择**保留。**
  - [在 GitLab 13.3 及更高版本中](https://gitlab.com/gitlab-org/gitlab/-/issues/22761)，将 的值设置 `expire_in`为`never`。

#### `artifacts:expose_as`

在 GitLab 12.5 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/15018)

使用`artifacts:expose_as`关键字 [在合并请求 UI 中公开作业工件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#link-to-job-artifacts-in-the-merge-request-ui)。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 在合并请求 UI 中显示工件下载链接的名称。必须结合[`artifacts:paths`](https://docs.gitlab.com/ee/ci/yaml/#artifactspaths).

**示例`artifacts:expose_as`**：

```
test:
  script: ["echo 'test' > file.txt"]
  artifacts:
    expose_as: 'artifact 1'
    paths: ['file.txt']
```

**其他详细信息**：

- 如果`artifacts:paths`使用[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html)，工件不会显示在 UI 中。

- 每个合并请求最多可以公开 10 个作业工件。

- 不支持全局模式。

- 如果指定了一个目录并且该目录中有多个文件，则该链接将指向作业[工件浏览器](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#download-job-artifacts)。

- 如果启用了

  GitLab Pages

  ，当工件是具有以下扩展名之一的单个文件时，GitLab 会自动渲染工件：

  - `.html`或者`.htm`
  - `.txt`
  - `.json`
  - `.xml`
  - `.log`

**相关主题**：

- [在合并请求 UI 中公开作业工件](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#link-to-job-artifacts-in-the-merge-request-ui)。

#### `artifacts:name`

使用`artifacts:name`关键字定义创建的工件存档的名称。您可以为每个存档指定唯一的名称。

如果未定义，则默认名称为`artifacts`，下载后即为`artifacts.zip`。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 工件档案的名称。[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。必须结合[`artifacts:paths`](https://docs.gitlab.com/ee/ci/yaml/#artifactspaths).

**示例`artifacts:name`**：

要使用当前作业的名称创建存档：

```
job:
  artifacts:
    name: "job1-artifacts-file"
    paths:
      - binaries/
```

**相关主题**：

- [使用 CI/CD 变量来定义工件名称](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#with-a-dynamically-defined-name)。

#### `artifacts:public`

版本历史 



在自我管理的 GitLab 上，默认情况下此功能不可用。为了使其可用，管理员可以启用名为 的[功能标志](https://docs.gitlab.com/ee/administration/feature_flags.html)`non_public_artifacts`。在 GitLab.com 上，此功能不可用。由于[问题 413822](https://gitlab.com/gitlab-org/gitlab/-/issues/413822)，当功能标志被禁用时可以使用关键字，但该功能不起作用。当功能标志被禁用时，请勿尝试使用此功能，并且始终首先使用非生产数据进行测试。

用于`artifacts:public`确定作业工件是否应公开可用。

当`artifacts:public`为`true`（默认）时，公共管道中的工件可供匿名和来宾用户下载。

要拒绝匿名和来宾用户对公共管道中的工件的读取访问，请设置`artifacts:public`为`false`：

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `true`（如果未定义则默认）或`false`.

**示例`artifacts:public`**：

```
job:
  artifacts:
    public: false
```

#### `artifacts:reports`

用于[`artifacts:reports`](https://docs.gitlab.com/ee/ci/yaml/artifacts_reports.html)收集作业中包含的模板生成的工件。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- [请参阅可用工件报告类型](https://docs.gitlab.com/ee/ci/yaml/artifacts_reports.html)的列表。

**示例`artifacts:reports`**：

```
rspec:
  stage: test
  script:
    - bundle install
    - rspec --format RspecJunitFormatter --out rspec.xml
  artifacts:
    reports:
      junit: rspec.xml
```

**其他详细信息**：

- 不支持使用子[管道中的工件来](https://docs.gitlab.com/ee/ci/yaml/#needspipelinejob)组合父管道中的报告。[跟踪本期](https://gitlab.com/gitlab-org/gitlab/-/issues/215725)添加支持的进度。
- 为了能够浏览报告输出文件，请包含关键字[`artifacts:paths`](https://docs.gitlab.com/ee/ci/yaml/#artifactspaths)。这会上传并存储工件两次。
- `artifacts: reports`无论作业结果如何（成功或失败），为其创建的工件始终会上传。您可以用来[`artifacts:expire_in`](https://docs.gitlab.com/ee/ci/yaml/#artifactsexpire_in)设置工件的到期日期。

#### `artifacts:untracked`

用于`artifacts:untracked`将所有 Git 未跟踪文件添加为工件（以及 中定义的路径`artifacts:paths`）。`artifacts:untracked`忽略存储库中的配置`.gitignore`，因此`.gitignore`包含匹配的工件。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `true`或`false`（如果未定义则默认）。

**示例`artifacts:untracked`**：

保存所有 Git 未跟踪的文件：

```
job:
  artifacts:
    untracked: true
```

**相关主题**：

- [将未跟踪的文件添加到工件中](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#with-untracked-files)。

#### `artifacts:when`

用于`artifacts:when`在作业失败或失败后上传工件。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `on_success`（默认）：仅在作业成功时上传工件。
- `on_failure`：仅在作业失败时上传工件。
- `always`：始终上传工件（作业超时时除外）。例如， 上传 解决失败测试所需的[工件时。](https://docs.gitlab.com/ee/ci/testing/unit_test_reports.html#view-junit-screenshots-on-gitlab)

**示例`artifacts:when`**：

```
job:
  artifacts:
    when: on_failure
```

**其他详细信息**：

- [`artifacts:reports`](https://docs.gitlab.com/ee/ci/yaml/#artifactsreports)无论作业结果如何（成功或失败），为其创建的工件始终会上传。`artifacts:when`不会改变这种行为。

### `before_script`

用于定义应在每个作业命令之前、[工件](https://docs.gitlab.com/ee/ci/yaml/#artifacts)恢复之后`before_script`运行的命令数组 。`script`

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：一个数组，包括：

- 单行命令。
- 长命令[分成多行](https://docs.gitlab.com/ee/ci/yaml/script.html#split-long-commands)。
- [YAML 锚点](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#yaml-anchors-for-scripts)。

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`before_script`**：

```
job:
  before_script:
    - echo "Execute this command before any 'script:' commands."
  script:
    - echo "This command executes after the job's 'before_script' commands."
```

**其他详细信息**：

- 您在中指定的脚本`before_script`将与您在 main 中指定的任何脚本连接起来[`script`](https://docs.gitlab.com/ee/ci/yaml/#script)。组合的脚本在单个 shell 中一起执行。
- [不推荐](https://docs.gitlab.com/ee/ci/yaml/#globally-defined-image-services-cache-before_script-after_script)`before_script`在顶层使用，但不在该`default`部分中使用。

**相关主题**：

- [使用`before_script`with`default`](https://docs.gitlab.com/ee/ci/yaml/script.html#set-a-default-before_script-or-after_script-for-all-jobs) 定义默认命令数组，这些命令应`script`在所有作业中的命令之前运行。
- 您可以[忽略非零退出代码](https://docs.gitlab.com/ee/ci/yaml/script.html#ignore-non-zero-exit-codes)。
- [使用颜色代码可以`before_script`](https://docs.gitlab.com/ee/ci/yaml/script.html#add-color-codes-to-script-output) 使作业日志更易于查看。
- [创建自定义可折叠部分](https://docs.gitlab.com/ee/ci/jobs/index.html#custom-collapsible-sections) 以简化作业日志输出。

### `cache`

[在 GitLab 15.0 中引入](https://gitlab.com/gitlab-org/gitlab/-/issues/330047)，缓存不在受保护和不受保护的分支之间共享。

用于`cache`指定要在作业之间缓存的文件和目录的列表。您只能使用本地工作副本中的路径。

缓存是：

- 在管道和作业之间共享。
- [默认情况下，不在受保护](https://docs.gitlab.com/ee/user/project/protected_branches.html)和不受保护的分支之间共享。
- 恢复了之前的[神器](https://docs.gitlab.com/ee/ci/yaml/#artifacts)。
- 限制为最多四个[不同的缓存](https://docs.gitlab.com/ee/ci/caching/index.html#use-multiple-caches)。

您可以[禁用特定作业的缓存](https://docs.gitlab.com/ee/ci/caching/index.html#disable-cache-for-specific-jobs)，例如覆盖：

- 用 定义的默认缓存[`default`](https://docs.gitlab.com/ee/ci/yaml/#default)。
- 添加了 的作业的配置[`include`](https://docs.gitlab.com/ee/ci/yaml/#include)。

有关缓存的更多信息，请参阅[GitLab CI/CD 中的缓存](https://docs.gitlab.com/ee/ci/caching/index.html)。

#### `cache:paths`

使用`cache:paths`关键字选择要缓存的文件或目录。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 相对于项目目录 ( ) 的路径数组

  ```
  $CI_PROJECT_DIR
  ```

  。您可以使用使用

  glob

   模式的通配符：

  - 在[GitLab Runner 13.0 及更高版本](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/2620)中， [`doublestar.Glob`](https://pkg.go.dev/github.com/bmatcuk/doublestar@v1.2.2?tab=doc#Match).
  - 在 GitLab Runner 12.10 及更早版本中， [`filepath.Match`](https://pkg.go.dev/path/filepath#Match).

**示例`cache:paths`**：

`binaries`缓存该端的所有文件`.apk`和`.config`文件：

```
rspec:
  script:
    - echo "This job uses a cache."
  cache:
    key: binaries-cache
    paths:
      - binaries/*.apk
      - .config
```

**其他详细信息**：

- 该`cache:paths`关键字包含文件，即使它们未跟踪或位于您的`.gitignore`文件中。

**相关主题**：

- 有关更多 示例，请参阅[常见`cache`用例](https://docs.gitlab.com/ee/ci/caching/index.html#common-use-cases-for-caches)`cache:paths`。

#### `cache:key`

使用`cache:key`关键字为每个缓存提供唯一的标识键。使用相同缓存键的所有作业都使用相同的缓存，包括在不同的管道中。

如果未设置，则默认键为`default`。所有带有`cache`关键字但不`cache:key`共享`default`缓存的作业。

必须与 一起使用`cache: paths`，否则不会缓存任何内容。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 一根绳子。
- 预定义的[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。
- 两者的结合。

**示例`cache:key`**：

```
cache-job:
  script:
    - echo "This job uses a cache."
  cache:
    key: binaries-cache-$CI_COMMIT_REF_SLUG
    paths:
      - binaries/
```

**其他详细信息**：

- 如果您使用**Windows Batch**运行 shell 脚本，则必须替换 `$`为`%`. 例如：`key: %CI_COMMIT_REF_SLUG%`
- 该`cache:key`值不能包含：
  - 字符`/`或等效的 URI 编码的`%2F`。
  - 仅`.`字符（任何数字）或等效的 URI 编码`%2E`。
- 缓存在作业之间共享，因此如果您对不同的作业使用不同的路径，则还应该设置不同的`cache:key`. 否则缓存内容可能会被覆盖。

**相关主题**：

- 如果未找到指定的缓存键，您可以指定 要使用的[后备缓存键。](https://docs.gitlab.com/ee/ci/caching/index.html#use-a-fallback-cache-key)`cache:key`
- 您可以在单个作业中[使用多个缓存键。](https://docs.gitlab.com/ee/ci/caching/index.html#use-multiple-caches)
- 有关更多 示例，请参阅[常见`cache`用例](https://docs.gitlab.com/ee/ci/caching/index.html#common-use-cases-for-caches)`cache:key`。

##### `cache:key:files`

在 GitLab 12.5 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/18986)

`cache:key:files`当一两个特定文件发生更改时，使用关键字生成新密钥。`cache:key:files`让您可以重用一些缓存，并减少重建它们的频率，从而加快后续管道的运行速度。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 由一个或两个文件路径组成的数组。

**示例`cache:key:files`**：

```
cache-job:
  script:
    - echo "This job uses a cache."
  cache:
    key:
      files:
        - Gemfile.lock
        - package.json
    paths:
      - vendor/ruby
      - node_modules
```

此示例为 Ruby 和 Node.js 依赖项创建缓存。缓存与`Gemfile.lock`和`package.json`文件的当前版本相关联。当这些文件之一发生更改时，将计算新的缓存键并创建新的缓存。任何未来运行的作业都使用相同的缓存`Gemfile.lock`并`package.json`使用`cache:key:files` 新的缓存，而不是重建依赖项。

**其他详细信息**：

- 缓存`key`是根据更改每个列出文件的最近提交计算得出的 SHA。如果在任何提交中两个文件都没有更改，则后备键为`default`。

##### `cache:key:prefix`

在 GitLab 12.5 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/18986)

用于`cache:key:prefix`将前缀与为 计算的 SHA 组合起来[`cache:key:files`](https://docs.gitlab.com/ee/ci/yaml/#cachekeyfiles)。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 一个字符串
- [预定义](https://docs.gitlab.com/ee/ci/variables/index.html)变量
- 两者的结合。

**示例`cache:key:prefix`**：

```
rspec:
  script:
    - echo "This rspec job uses a cache."
  cache:
    key:
      files:
        - Gemfile.lock
      prefix: $CI_JOB_NAME
    paths:
      - vendor/ruby
```

例如，添加`prefix`of`$CI_JOB_NAME`会使键看起来像`rspec-feef9576d21ee9b6a32e30c5c79d0a0ceb68d1e5`。如果分支发生更改`Gemfile.lock`，该分支将具有新的 SHA 校验和`cache:key:files`。生成一个新的缓存键，并为该键创建一个新的缓存。如果`Gemfile.lock` 未找到，则将前缀添加到`default`，因此示例中的键将为`rspec-default`。

**其他详细信息**：

- 如果`cache:key:files`在任何提交中都没有更改文件，则前缀将添加到键中`default`。

#### `cache:untracked`

用于`untracked: true`缓存 Git 存储库中未跟踪的所有文件。未跟踪的文件包括以下文件：

- 由于[`.gitignore`配置](https://git-scm.com/docs/gitignore)而被忽略。
- 已创建，但未添加到结帐中[`git add`](https://git-scm.com/docs/git-add)。

如果作业下载，缓存未跟踪的文件可能会创建意外的大缓存：

- 依赖项，例如 gem 或节点模块，通常不会被跟踪。
- 来自不同工作的[工件。](https://docs.gitlab.com/ee/ci/yaml/#artifacts)默认情况下，不会跟踪从工件中提取的文件。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `true`或`false`（默认）。

**示例`cache:untracked`**：

```
rspec:
  script: test
  cache:
    untracked: true
```

**其他详细信息**：

- 您可以结合`cache:untracked`使用`cache:paths`来缓存所有未跟踪的文件以及配置路径中的文件。用于`cache:paths`缓存任何特定文件，包括跟踪的文件或工作目录之外的文件，还用于`cache: untracked`缓存所有未跟踪的文件。例如：

  ```
  rspec:
    script: test
    cache:
      untracked: true
      paths:
        - binaries/
  ```

  在此示例中，作业缓存存储库中所有未跟踪的文件以及`binaries/`. 如果 中存在未跟踪的文件`binaries/`，则它们会被两个关键字覆盖。

#### `cache:unprotect`

在 GitLab 15.8 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/362114)

用于设置要在[受保护](https://docs.gitlab.com/ee/user/project/protected_branches.html)`cache:unprotect`和不受保护的分支之间共享的缓存 。



设置为 时`true`，无法访问受保护分支的用户可以读取和写入受保护分支使用的缓存键。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `true`或`false`（默认）。

**示例`cache:unprotect`**：

```
rspec:
  script: test
  cache:
    unprotect: true
```

#### `cache:when`

在 GitLab 13.5 和 GitLab Runner v13.5.0 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/18969)

用于`cache:when`根据作业的状态定义何时保存缓存。

必须与 一起使用`cache: paths`，否则不会缓存任何内容。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `on_success`（默认）：仅在作业成功时保存缓存。
- `on_failure`：仅在作业失败时才保存缓存。
- `always`：始终保存缓存。

**示例`cache:when`**：

```
rspec:
  script: rspec
  cache:
    paths:
      - rspec/
    when: 'always'
```

无论作业失败还是成功，此示例都会存储缓存。

#### `cache:policy`

要更改缓存的上传和下载行为，请使用`cache:policy`关键字。默认情况下，作业启动时下载缓存，并在作业结束时将更改上传到缓存。此缓存样式是`pull-push`策略（默认）。

要将作业设置为仅在作业启动时下载缓存，但在作业完成时从不上传更改，请使用`cache:policy:pull`。

要将作业设置为仅在作业完成时上传缓存，但在作业启动时从不下载缓存，请使用`cache:policy:push`。

`pull`当您有许多并行执行且使用相同缓存的作业时，请使用该策略。此策略可加快作业执行速度并减少缓存服务器上的负载。您可以使用带有策略的作业`push`来构建缓存。

必须与 一起使用`cache: paths`，否则不会缓存任何内容。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `pull`
- `push`
- `pull-push`（默认）
- [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。

**示例`cache:policy`**：

```
prepare-dependencies-job:
  stage: build
  cache:
    key: gems
    paths:
      - vendor/bundle
    policy: push
  script:
    - echo "This job only downloads dependencies and builds the cache."
    - echo "Downloading dependencies..."

faster-test-job:
  stage: test
  cache:
    key: gems
    paths:
      - vendor/bundle
    policy: pull
  script:
    - echo "This job script uses the cache, but does not update it."
    - echo "Running tests..."
```

**相关主题**：

- 您可以[使用变量来控制作业的缓存策略](https://docs.gitlab.com/ee/ci/caching/index.html#use-a-variable-to-control-a-jobs-cache-policy)。

#### `cache:fallback_keys`

用于`cache:fallback_keys`指定一个键列表，以便在没有找到 的缓存时尝试恢复缓存`cache:key`。缓存按本节中指定的顺序检索`fallback_keys`。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 缓存键数组

**示例`cache:fallback_keys`**：

```
rspec:
  script: rspec
  cache:
    key: gems-$CI_COMMIT_REF_SLUG
    paths:
      - rspec/
    fallback_keys:
      - gems
    when: 'always'
```

### `coverage`

与自定义正则表达式一起使用`coverage`来配置如何从作业输出中提取代码覆盖率。如果作业输出中至少有一行与正则表达式匹配，则覆盖率会显示在 UI 中。

为了从匹配中提取代码覆盖率值，GitLab 使用这个较小的正则表达式：`\d+(\.\d+)?`。

**可能的输入**：

- 一个正则表达式。必须以 开始和结束`/`。必须与承保号码匹配。也可以匹配周围的文本，因此您不需要使用正则表达式字符组来捕获确切的数字。

**示例`coverage`**：

```
job1:
  script: rspec
  coverage: '/Code coverage: \d+\.\d+/'
```

在这个例子中：

1. GitLab 检查作业日志是否与正则表达式匹配。像这样的线`Code coverage: 67.89% of lines covered`会匹配。
2. 然后，GitLab 检查匹配的片段以找到与`\d+(\.\d+)?`. 上面的示例匹配行给出的代码覆盖率为`67.89`.

**其他详细信息**：

- [您可以在代码覆盖率](https://docs.gitlab.com/ee/ci/testing/code_coverage.html#test-coverage-examples)中找到解析示例。
- 如果作业输出中有多个匹配行，则使用最后一行（反向搜索的第一个结果）。
- 如果一行中有多个匹配项，则在最后一个匹配项中搜索覆盖范围编号。
- 如果在匹配的片段中找到多个覆盖范围编号，则使用第一个编号。
- 前导零被删除。
- 不会记录或显示[子管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines)的覆盖输出。检查[相关问题](https://gitlab.com/gitlab-org/gitlab/-/issues/280818) 以获取更多详细信息。

### `dast_configuration` [最终的](https://about.gitlab.com/pricing/?glm_source=docs.gitlab.com&glm_content=badges-docs)

在 GitLab 14.1 中[引入。](https://gitlab.com/groups/gitlab-org/-/epics/5981)

使用`dast_configuration`关键字指定要在 CI/CD 配置中使用的站点配置文件和扫描仪配置文件。两个配置文件必须首先在项目中创建。作业的阶段必须是`dast`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**`site_profile`：和各一个`scanner_profile`。

- 用于`site_profile`指定要在作业中使用的站点配置文件。
- 用于`scanner_profile`指定要在作业中使用的扫描仪配置文件。

**示例`dast_configuration`**：

```
stages:
  - build
  - dast

include:
  - template: DAST.gitlab-ci.yml

dast:
  dast_configuration:
    site_profile: "Example Co"
    scanner_profile: "Quick Passive Test"
```

在此示例中，`dast`作业扩展了`dast`使用`include`关键字添加的配置，以选择特定的站点配置文件和扫描仪配置文件。

**其他详细信息**：

- 站点配置文件或扫描仪配置文件中包含的设置优先于 DAST 模板中包含的设置。

**相关主题**：

- [网站简介](https://docs.gitlab.com/ee/user/application_security/dast/proxy-based.html#site-profile)。
- [扫描仪配置文件](https://docs.gitlab.com/ee/user/application_security/dast/proxy-based.html#scanner-profile)。

### `dependencies`

使用关键字定义要从中获取[工件](https://docs.gitlab.com/ee/ci/yaml/#artifacts)`dependencies`的作业列表。您还可以将作业设置为根本不下载任何工件。

如果您不使用`dependencies`，则先前阶段的所有工件都会传递到每个作业。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 要从中获取工件的作业的名称。
- 一个空数组 ( `[]`)，用于将作业配置为不下载任何工件。

**示例`dependencies`**：

```
build osx:
  stage: build
  script: make build:osx
  artifacts:
    paths:
      - binaries/

build linux:
  stage: build
  script: make build:linux
  artifacts:
    paths:
      - binaries/

test osx:
  stage: test
  script: make test:osx
  dependencies:
    - build osx

test linux:
  stage: test
  script: make test:linux
  dependencies:
    - build linux

deploy:
  stage: deploy
  script: make deploy
  environment: production
```

在此示例中，两个作业具有工件：`build osx`和`build linux`。执行时，将在构建上下文中下载并提取`test osx`工件。`build osx`同样的事情也会发生在`test linux`和 的工件上`build linux`。

`deploy`由于[阶段](https://docs.gitlab.com/ee/ci/yaml/#stages)优先级，该作业会从所有先前作业中下载工件。

**其他详细信息**：

- 工作状态并不重要。如果作业失败或者是未触发的手动作业，则不会发生错误。
- 如果依赖作业的工件已[过期](https://docs.gitlab.com/ee/ci/yaml/#artifactsexpire_in)或被 [删除](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html#delete-job-log-and-artifacts)，则作业将失败。

### `environment`

用于`environment`定义作业部署到的[环境。](https://docs.gitlab.com/ee/ci/environments/index.html)

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：作业部署到的环境的名称，采用以下格式之一：

- 纯文本，包括字母、数字、空格以及以下字符：`-`、`_`、`/`、`$`、`{`、`}`。
- CI/CD 变量，包括预定义的、项目、组、实例或文件中定义的变量 `.gitlab-ci.yml`。您不能使用`script`节中定义的变量。

**示例`environment`**：

```
deploy to production:
  stage: deploy
  script: git push production HEAD:main
  environment: production
```

**其他详细信息**：

- 如果指定一个`environment`但不存在具有该名称的环境，则会创建一个环境。

#### `environment:name`

[为环境](https://docs.gitlab.com/ee/ci/environments/index.html)设置名称。

常见的环境名称有`qa`、`staging`和`production`，但您可以使用任何名称。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：作业部署到的环境的名称，采用以下格式之一：

- 纯文本，包括字母、数字、空格以及以下字符：`-`、`_`、`/`、`$`、`{`、`}`。
- [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)，包括预定义的、项目、组、实例或 `.gitlab-ci.yml`文件中定义的变量。您不能使用`script`节中定义的变量。

**示例`environment:name`**：

```
deploy to production:
  stage: deploy
  script: git push production HEAD:main
  environment:
    name: production
```

#### `environment:url`

[设置环境](https://docs.gitlab.com/ee/ci/environments/index.html)的 URL 。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：单个 URL，采用以下格式之一：

- 纯文本，例如`https://prod.example.com`.
- [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)，包括预定义的、项目、组、实例或 `.gitlab-ci.yml`文件中定义的变量。您不能使用`script`节中定义的变量。

**示例`environment:url`**：

```
deploy to production:
  stage: deploy
  script: git push production HEAD:main
  environment:
    name: production
    url: https://prod.example.com
```

**其他详细信息**：

- 作业完成后，您可以通过选择合并请求、环境或部署页面中的按钮来访问 URL。

#### `environment:on_stop`

可以使用`on_stop`下定义的关键字来实现关闭（停止）环境`environment`。它声明了一个不同的作业来运行以关闭环境。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**其他详细信息**：

- 请参阅[`environment:action`](https://docs.gitlab.com/ee/ci/yaml/#environmentaction)参考资料 获取更多详细信息和示例。

#### `environment:action`

使用`action`关键字指定作业如何与环境交互。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：以下关键字之一：

| **价值**  | **描述**                                                     |
| :-------- | :----------------------------------------------------------- |
| `start`   | 默认值。表示作业启动环境。部署是在作业开始后创建的。         |
| `prepare` | 表示该作业只是准备环境。它不会触发部署。[阅读有关准备环境的更多信息](https://docs.gitlab.com/ee/ci/environments/index.html#access-an-environment-for-preparation-or-verification-purposes)。 |
| `stop`    | 指示作业停止环境。[阅读有关停止环境的更多信息](https://docs.gitlab.com/ee/ci/environments/index.html#stopping-an-environment)。 |
| `verify`  | 表示该作业仅验证环境。它不会触发部署。[了解有关验证环境的更多信息](https://docs.gitlab.com/ee/ci/environments/index.html#access-an-environment-for-preparation-or-verification-purposes)。 |
| `access`  | 指示作业仅访问环境。它不会触发部署。[阅读有关访问环境的更多信息](https://docs.gitlab.com/ee/ci/environments/index.html#access-an-environment-for-preparation-or-verification-purposes)。 |

**示例`environment:action`**：

```
stop_review_app:
  stage: deploy
  variables:
    GIT_STRATEGY: none
  script: make delete-app
  when: manual
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
```

#### `environment:auto_stop_in`

在 GitLab 12.8 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/20956)

该`auto_stop_in`关键字指定环境的生命周期。当环境过期时，GitLab 会自动停止它。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：用自然语言编写的一段时间。例如，这些都是等效的：

- `168 hours`
- `7 days`
- `one week`
- `never`

**示例`environment:auto_stop_in`**：

```
review_app:
  script: deploy-review-app
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    auto_stop_in: 1 day
```

当创建 的环境时`review_app`，环境的生命周期设置为`1 day`。每次部署审核应用程序时，该生命周期也会重置为`1 day`。

**相关主题**：

- [环境自动停止文档](https://docs.gitlab.com/ee/ci/environments/index.html#stop-an-environment-after-a-certain-time-period)。

#### `environment:kubernetes`

在 GitLab 12.6 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/27630)

使用`kubernetes`关键字配置与 您的项目关联的[Kubernetes 集群的部署。](https://docs.gitlab.com/ee/user/infrastructure/clusters/index.html)

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**示例`environment:kubernetes`**：

```
deploy:
  stage: deploy
  script: make deploy-app
  environment:
    name: production
    kubernetes:
      namespace: production
```

此配置使用[Kubernetes 命名空间](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)设置`deploy`要部署到环境的作业。`production``production` 

**其他详细信息**：

- [GitLab 管理的](https://docs.gitlab.com/ee/user/project/clusters/gitlab_managed_clusters.html)Kubernetes 集群不支持 Kubernetes 配置 。

**相关主题**：

- [的可用设置`kubernetes`](https://docs.gitlab.com/ee/ci/environments/configure_kubernetes_deployments.html)。

#### `environment:deployment_tier`

在 GitLab 13.10 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/300741)

使用`deployment_tier`关键字指定部署环境的层级。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：以下之一：

- `production`
- `staging`
- `testing`
- `development`
- `other`

**示例`environment:deployment_tier`**：

```
deploy:
  script: echo
  environment:
    name: customer-portal
    deployment_tier: production
```

**其他详细信息**：

- 根据此值为从此作业定义创建的环境分配一个[层。](https://docs.gitlab.com/ee/ci/environments/index.html#deployment-tier-of-environments)
- 如果稍后添加此值，现有环境不会更新其层。现有环境必须通过[环境 API](https://docs.gitlab.com/ee/api/environments.html#update-an-existing-environment)更新其层。

**相关主题**：

- [环境的部署层](https://docs.gitlab.com/ee/ci/environments/index.html#deployment-tier-of-environments)。

#### 动态环境

使用 CI/CD[变量](https://docs.gitlab.com/ee/ci/variables/index.html)动态命名环境。

例如：

```
deploy as review app:
  stage: deploy
  script: make deploy
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_ENVIRONMENT_SLUG.example.com/
```

该`deploy as review app`作业被标记为部署以动态创建`review/$CI_COMMIT_REF_SLUG`环境。`$CI_COMMIT_REF_SLUG` 是运行者设置的[CI/CD 变量。](https://docs.gitlab.com/ee/ci/variables/index.html)该 `$CI_ENVIRONMENT_SLUG`变量基于环境名称，但适合包含在 URL 中。如果`deploy as review app`作业在名为 的分支中运行 `pow`，则可以使用类似 的 URL 访问该环境`https://review-pow.example.com/`。

常见的用例是为分支创建动态环境并将其用作审核应用程序。[您可以在https://gitlab.com/gitlab-examples/review-apps-nginx/](https://gitlab.com/gitlab-examples/review-apps-nginx/)上查看使用审核应用程序的示例 。

### `extends`

用于`extends`重用配置部分。[它是YAML 锚点](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#anchors)的替代方案 ，并且更加灵活和可读。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 管道中另一个作业的名称。
- 管道中其他作业的名称列表（数组）。

**示例`extends`**：

```
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC
```

在此示例中，`rspec`作业使用模板作业中的配置`.tests`。创建管道时，GitLab：

- 根据键执行反向深度合并。
- 将`.tests`内容与`rspec`工作合并。
- 不合并键的值。

结果是这个`rspec`工作：

```
rspec:
  script: rake rspec
  stage: test
  only:
    refs:
      - branches
    variables:
      - $RSPEC
```

**其他详细信息**：

- 在 GitLab 12.0 及更高版本中，您可以对`extends`.
- 该`extends`关键字最多支持十一级继承，但应避免使用超过三级。
- 在上面的示例中，`.tests`是一个[隐藏作业](https://docs.gitlab.com/ee/ci/jobs/index.html#hide-jobs)，但您也可以从常规作业扩展配置。

**相关主题**：

- [通过使用 重用配置节`extends`](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#use-extends-to-reuse-configuration-sections)。
- 用于`extends`重用[包含的配置文件](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#use-extends-and-include-together)中的配置。

### `hooks`

版本历史 

用于`hooks`指定在作业执行的某些阶段（例如检索 Git 存储库之前）在运行器上执行的命令列表。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 钩子及其命令的哈希值。可用的挂钩：`pre_get_sources_script`.

#### `hooks:pre_get_sources_script`

版本历史 

用于`hooks:pre_get_sources_script`指定在检索 Git 存储库和任何子模块之前要在运行器上执行的命令列表。例如，您可以先使用它来调整 Git 客户端配置。

**相关主题**：

- [GitLab 运行器配置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runners-section)

**示例`hooks:pre_get_sources_script`**：

```
job1:
  hooks:
    pre_get_sources_script:
      - echo 'hello job1 pre_get_sources_script'
  script: echo 'hello job1 script'
```

### `id_tokens`

在 GitLab 15.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/356986)

用于`id_tokens`创建[JSON Web 令牌 (JWT)](https://www.rfc-editor.org/rfc/rfc7519)以通过第三方服务进行身份验证。以这种方式创建的所有 JWT 都支持 OIDC 身份验证。所需的`aud`子关键字用于配置`aud`JWT 的声明。

**可能的输入**：

- 令牌名称及其

  ```
  aud
  ```

  声明。

  ```
  aud
  ```

  支持：

  - 单个字符串。
  - 字符串数组。
  - [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。

**示例`id_tokens`**：

```
job_with_id_tokens:
  id_tokens:
    ID_TOKEN_1:
      aud: https://gitlab.com
    ID_TOKEN_2:
      aud:
        - https://gcp.com
        - https://aws.com
    SIGSTORE_ID_TOKEN:
      aud: sigstore
  script:
    - command_to_authenticate_with_gitlab $ID_TOKEN_1
    - command_to_authenticate_with_aws $ID_TOKEN_2
```

**相关主题**：

- [使用 Sigstore 进行无密钥签名](https://docs.gitlab.com/ee/ci/yaml/signing_examples.html)。

### `image`

用于`image`指定运行作业的 Docker 映像。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：图像的名称，包括注册表路径（如果需要），采用以下格式之一：

- `<image-name>``<image-name>`（与使用标签相同`latest`）
- `<image-name>:<tag>`
- `<image-name>@<digest>`

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`image`**：

```
default:
  image: ruby:3.0

rspec:
  script: bundle exec rspec

rspec 2.7:
  image: registry.example.com/my-group/my-project/ruby:2.7
  script: bundle exec rspec
```

在此示例中，该`ruby:3.0`图像是管道中所有作业的默认图像。该`rspec 2.7`作业不使用默认值，因为它使用特定于作业的`image`部分覆盖默认值。

**相关主题**：

- [在 Docker 容器中运行 CI/CD 作业](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html)。

#### `image:name`

作业运行的 Docker 镜像的名称。与[`image`](https://docs.gitlab.com/ee/ci/yaml/#image)自身使用的类似。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：图像的名称，包括注册表路径（如果需要），采用以下格式之一：

- `<image-name>``<image-name>`（与使用标签相同`latest`）
- `<image-name>:<tag>`
- `<image-name>@<digest>`

**示例`image:name`**：

```
image:
  name: "registry.example.com/my/image:latest"
```

**相关主题**：

- [在 Docker 容器中运行 CI/CD 作业](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html)。

#### `image:entrypoint`

作为容器入口点执行的命令或脚本。

创建 Docker 容器时，将`entrypoint`被转换为 Docker`--entrypoint`选项。语法类似于[Dockerfile`ENTRYPOINT`指令](https://docs.docker.com/engine/reference/builder/#entrypoint)，其中每个 shell 标记都是数组中的一个单独的字符串。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 一根绳子。

**示例`image:entrypoint`**：

```
image:
  name: super/sql:experimental
  entrypoint: [""]
```

**相关主题**：

- [覆盖图像的入口点](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html#override-the-entrypoint-of-an-image)。

#### `image:pull_policy`

版本历史 

运行程序用于获取 Docker 映像的拉取策略。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的[`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 单个拉取策略或阵列中的多个拉取策略。可以是`always`、`if-not-present`、 或`never`。

**示例`image:pull_policy`**：

```
job1:
  script: echo "A single pull policy."
  image:
    name: ruby:3.0
    pull_policy: if-not-present

job2:
  script: echo "Multiple pull policies."
  image:
    name: ruby:3.0
    pull_policy: [always, if-not-present]
```

**其他详细信息**：

- 如果运行程序不支持定义的拉取策略，则作业将失败并出现类似以下内容的错误： `ERROR: Job failed (system failure): the configured PullPolicies ([always]) are not allowed by AllowedPullPolicies ([never])`。

**相关主题**：

- [在 Docker 容器中运行 CI/CD 作业](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html)。
- [跑步者拉动政策如何运作](https://docs.gitlab.com/runner/executors/docker.html#how-pull-policies-work)。
- [使用多种拉动策略](https://docs.gitlab.com/runner/executors/docker.html#using-multiple-pull-policies)。

### `inherit`

在 GitLab 12.9 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/207484)

用于`inherit`控制[默认关键字和变量的继承](https://docs.gitlab.com/ee/ci/jobs/index.html#control-the-inheritance-of-default-keywords-and-global-variables)。

#### `inherit:default`

用于控制[默认关键字](https://docs.gitlab.com/ee/ci/yaml/#default)`inherit:default`的继承。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `true`（默认）或`false`启用或禁用所有默认关键字的继承。
- 要继承的特定默认关键字的列表。

**示例`inherit:default`**：

```
default:
  retry: 2
  image: ruby:3.0
  interruptible: true

job1:
  script: echo "This job does not inherit any default keywords."
  inherit:
    default: false

job2:
  script: echo "This job inherits only the two listed default keywords. It does not inherit 'interruptible'."
  inherit:
    default:
      - retry
      - image
```

**其他详细信息**：

- 您还可以在一行中列出要继承的默认关键字：`default: [keyword1, keyword2]`

#### `inherit:variables`

用于控制[全局变量](https://docs.gitlab.com/ee/ci/yaml/#variables)`inherit:variables`关键字的继承。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `true`（默认）或`false`启用或禁用所有全局变量的继承。
- 要继承的特定变量的列表。

**示例`inherit:variables`**：

```
variables:
  VARIABLE1: "This is variable 1"
  VARIABLE2: "This is variable 2"
  VARIABLE3: "This is variable 3"

job1:
  script: echo "This job does not inherit any global variables."
  inherit:
    variables: false

job2:
  script: echo "This job inherits only the two listed global variables. It does not inherit 'VARIABLE3'."
  inherit:
    variables:
      - VARIABLE1
      - VARIABLE2
```

**其他详细信息**：

- 您还可以在一行中列出要继承的全局变量：`variables: [VARIABLE1, VARIABLE2]`

### `interruptible`

在 GitLab 12.3 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/32022)

`interruptible`如果在作业完成之前启动较新的管道时应取消作业，则使用此选项。

如果禁用[自动取消冗余管道，则](https://docs.gitlab.com/ee/ci/pipelines/settings.html#auto-cancel-redundant-pipelines)该关键字无效。`interruptible: true`启用后，在同一分支上为新更改启动管道时，正在运行的作业将被取消。

作业开始后，您无法取消后续作业`interruptible: false`。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `true`或`false`（默认）。

**示例`interruptible`**：

```
stages:
  - stage1
  - stage2
  - stage3

step-1:
  stage: stage1
  script:
    - echo "Can be canceled."
  interruptible: true

step-2:
  stage: stage2
  script:
    - echo "Can not be canceled."

step-3:
  stage: stage3
  script:
    - echo "Because step-2 can not be canceled, this step can never be canceled, even though it's set as interruptible."
  interruptible: true
```

在此示例中，新管道导致正在运行的管道：

- 如果仅`step-1`正在运行或待处理，则已取消。
- 启动后没有取消`step-2`。

**其他详细信息**：

- `interruptible: true`仅当作业开始后可以安全取消时才设置，例如构建作业。通常不应取消部署作业，以防止部分部署。
- 要完全取消正在运行的管道，所有作业必须已启动`interruptible: true`，或者`interruptible: false`作业必须尚未启动。

### `needs`

版本历史 

用于`needs`无序执行作业。使用的作业之间的关系`needs`可以可视化为[有向无环图](https://docs.gitlab.com/ee/ci/directed_acyclic_graph/index.html)。

您可以忽略阶段顺序并运行某些作业，而无需等待其他作业完成。多个阶段的作业可以同时运行。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 一系列的工作。
- 一个空数组 ( `[]`)，用于将作业设置为在创建管道后立即启动。

**示例`needs`**：

```
linux:build:
  stage: build
  script: echo "Building linux..."

mac:build:
  stage: build
  script: echo "Building mac..."

lint:
  stage: test
  needs: []
  script: echo "Linting..."

linux:rspec:
  stage: test
  needs: ["linux:build"]
  script: echo "Running rspec on linux..."

mac:rspec:
  stage: test
  needs: ["mac:build"]
  script: echo "Running rspec on mac..."

production:
  stage: deploy
  script: echo "Running production..."
  environment: production
```

此示例创建四个执行路径：

- Linter：`lint`作业立即运行，无需等待阶段`build`完成，因为它没有需求 ( `needs: []`)。
- Linux 路径：作业完成`linux:rspec`后立即运行`linux:build` ，无需等待`mac:build`完成。
- macOS 路径：作业完成`mac:rspec`后立即运行`mac:build` ，无需等待`linux:build`完成。
- `production`一旦所有先前的作业完成， 该作业就会运行： `linux:build`, `linux:rspec`, `mac:build`, `mac:rspec`。

**其他详细信息**：

- 数组中单个作业可以拥有的最大作业数

  ```
  needs
  ```

  是有限的：

  - 对于 GitLab.com，限制为 50。有关更多信息，请参阅我们的 [基础设施问题](https://gitlab.com/gitlab-com/gl-infra/reliability/-/issues/7541)。
  - 对于自我管理实例，默认限制为 50。此限制[可以更改](https://docs.gitlab.com/ee/administration/cicd.html#set-the-needs-job-limit)。

- if

  ```
  needs
  ```

  指的是使用关键字的作业

  `parallel`

  ，它取决于并行创建的所有作业，而不仅仅是一个作业。默认情况下，它还会从所有并行作业下载工件。如果工件具有相同的名称，它们会相互覆盖，并且仅保存最后下载的工件。

  - 要`needs`引用并行作业的子集（而不是所有并行作业），请使用关键字[`needs:parallel:matrix`](https://docs.gitlab.com/ee/ci/yaml/#needsparallelmatrix)。

- 在[GitLab 14.1 及更高版本](https://gitlab.com/gitlab-org/gitlab/-/issues/30632)中，您可以引用与您正在配置的作业处于同一阶段的作业。此功能已在 GitLab.com 上启用并可供生产使用。在自我管理的[GitLab 14.2 及更高版本](https://gitlab.com/gitlab-org/gitlab/-/issues/30632)上 ，此功能默认可用。

- 在 GitLab 14.0 及更早版本中，您只能引用早期阶段的作业。必须为使用关键字的所有作业显式定义阶段`needs`，或者在作业`needs`部分中引用阶段。

- 在 GitLab 13.9 及更早版本中，如果引用可能因、或 而`needs`无法添加到管道的作业，则管道可能无法创建。在 GitLab 13.10 及更高版本中，使用关键字来解决失败的管道创建问题。`only``except``rules`[`needs:optional`](https://docs.gitlab.com/ee/ci/yaml/#needsoptional)

- 如果管道有作业`needs: []`和阶段中的作业[`.pre`](https://docs.gitlab.com/ee/ci/yaml/#stage-pre)，则它们将在管道创建后立即启动。作业`needs: []`立即开始，`.pre`阶段中的作业也立即开始。

#### `needs:artifacts`

在 GitLab 12.6 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/14311)

当作业使用 时`needs`，默认情况下它不再下载先前阶段的所有工件，因为 作业`needs`可以在早期阶段完成之前启动。您只能 `needs`从配置中列出的作业下载工件`needs`。

使用`artifacts: true`（默认） 或`artifacts: false`控制何时在使用 的作业中下载工件`needs`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。必须与 一起使用`needs:job`。

**可能的输入**：

- `true`（默认）或`false`.

**示例`needs:artifacts`**：

```
test-job1:
  stage: test
  needs:
    - job: build_job1
      artifacts: true

test-job2:
  stage: test
  needs:
    - job: build_job2
      artifacts: false

test-job3:
  needs:
    - job: build_job1
      artifacts: true
    - job: build_job2
    - build_job3
```

在这个例子中：

- 该`test-job1`作业下载`build_job1`工件
- 该`test-job2`作业不会下载`build_job2`工件。
- 该`test-job3`作业从所有三个 中下载工件`build_jobs`，因为 对于所有三个所需作业来说`artifacts`都是`true`或默认为`true`。

**其他详细信息**：

- 在 GitLab 12.6 及更高版本中，您无法将[`dependencies`](https://docs.gitlab.com/ee/ci/yaml/#dependencies)关键字与`needs`.

#### `needs:project` [优质的](https://about.gitlab.com/pricing/?glm_source=docs.gitlab.com&glm_content=badges-docs)

在 GitLab 12.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/14311)

用于`needs:project`从其他管道中最多五个作业下载工件。这些工件是从指定引用的最新成功的指定作业中下载的。要指定多个作业，请将每个作业作为单独的数组项添加到`needs`关键字下。

如果有一个正在为 ref 运行的管道，则作业`needs:project` 不会等待管道完成。相反，工件是从指定作业的最新成功运行中下载的。

`needs:project``job`必须与、`ref`、 和 一起使用`artifacts`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `needs:project`：完整的项目路径，包括命名空间和组。
- `job`：从中下载工件的作业。
- `ref`：从中下载工件的参考。
- `artifacts`：一定是`true`要下载工件。

**示例`needs:project`**：

```
build_job:
  stage: build
  script:
    - ls -lhR
  needs:
    - project: namespace/group/project-name
      job: build-1
      ref: main
      artifacts: true
    - project: namespace/group/project-name-2
      job: build-2
      ref: main
      artifacts: true
```

在此示例中，从和项目的分支上最新成功的和作业`build_job`下载工件。`build-1``build-2``main``group/project-name``group/project-name-2`

在 GitLab 13.3 及更高版本中，您可以在 中使用[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)`needs:project`，例如：

```
build_job:
  stage: build
  script:
    - ls -lhR
  needs:
    - project: $CI_PROJECT_PATH
      job: $DEPENDENCY_JOB_NAME
      ref: $ARTIFACTS_DOWNLOAD_REF
      artifacts: true
```

**其他详细信息**：

- 要从当前项目中的不同管道下载工件，请设置`project` 为与当前项目相同，但使用与当前管道不同的引用。在同一引用上运行的并发管道可能会覆盖工件。
- 运行管道的用户必须至少具有组或项目的报告者角色，或者组/项目必须具有公共可见性。
- 您不能`needs:project`在与 相同的作业中使用[`trigger`](https://docs.gitlab.com/ee/ci/yaml/#trigger)。
- 当用于`needs:project`从另一个管道下载工件时，作业不会等待所需作业完成。[有向非循环图](https://docs.gitlab.com/ee/ci/directed_acyclic_graph/index.html) 行为仅限于同一管道中的作业。确保其他管道中所需的作业在需要它的作业尝试下载工件之前完成。
- 您无法从在[`parallel`](https://docs.gitlab.com/ee/ci/yaml/#parallel).
- GitLab 13.3 中引入 [了](https://gitlab.com/gitlab-org/gitlab/-/issues/202093)对、、 和中[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html)的支持。 GitLab 13.4 中[删除了功能标志。](https://gitlab.com/gitlab-org/gitlab/-/issues/235761)`project``job``ref`

**相关主题**：

- 要下载[父子管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines)之间的工件，请使用[`needs:pipeline:job`](https://docs.gitlab.com/ee/ci/yaml/#needspipelinejob).

#### `needs:pipeline:job`

在 GitLab 13.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/255983)

子[管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines)可以从其父管道中的作业或同一父子管道层次结构中的另一个子管道下载工件。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `needs:pipeline`：管道 ID。必须是同一父子管道层次结构中存在的管道。
- `job`：从中下载工件的作业。

**示例`needs:pipeline:job`**：

- 父管道 ( `.gitlab-ci.yml`):

  ```
  create-artifact:
    stage: build
    script: echo "sample artifact" > artifact.txt
    artifacts:
      paths: [artifact.txt]
  
  child-pipeline:
    stage: test
    trigger:
      include: child.yml
      strategy: depend
    variables:
      PARENT_PIPELINE_ID: $CI_PIPELINE_ID
  ```

- 子管道 ( `child.yml`):

  ```
  use-artifact:
    script: cat artifact.txt
    needs:
      - pipeline: $PARENT_PIPELINE_ID
        job: create-artifact
  ```

在此示例中，`create-artifact`父管道中的作业创建了一些工件。该`child-pipeline`作业触发子管道，并将`CI_PIPELINE_ID` 变量作为新变量传递到子管道`PARENT_PIPELINE_ID`。子管道可以使用该变量`needs:pipeline`从父管道下载工件。

**其他详细信息**：

- 该`pipeline`属性不接受当前管道 ID ( `$CI_PIPELINE_ID`)。要从当前管道中的作业下载工件，请使用[`needs`](https://docs.gitlab.com/ee/ci/yaml/#needsartifacts).

#### `needs:optional`

版本历史 

如果需要管道中有时不存在的作业，请添加`optional: true` 到`needs`配置中。如果未定义，`optional: false`则为默认值。

使用[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)、[`only`或`except`](https://docs.gitlab.com/ee/ci/yaml/#only--except)以及添加的作业[`include`](https://docs.gitlab.com/ee/ci/yaml/#include) 可能并不总是添加到管道中。`needs`GitLab在启动管道之前检查关系：

- 如果该`needs`条目已存在`optional: true`且所需作业存在于管道中，则该作业会在开始之前等待其完成。
- 如果所需的作业不存在，则可以在满足所有其他需求要求后开始该作业。
- 如果该部分仅包含可选作业，并且没有任何作业添加到管道中，则作业将立即启动（与空条目`needs`相同：）。`needs``needs: []`
- 如果所需作业具有`optional: false`，但未将其添加到管道中，则管道将无法启动，并出现类似于以下内容的错误：`'job1' job needs 'job2' job, but it was not added to the pipeline`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**示例`needs:optional`**：

```
build-job:
  stage: build

test-job1:
  stage: test

test-job2:
  stage: test
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

deploy-job:
  stage: deploy
  needs:
    - job: test-job2
      optional: true
    - job: test-job1
  environment: production

review-job:
  stage: deploy
  needs:
    - job: test-job2
      optional: true
  environment: review
```

在这个例子中：

- `build-job`、`test-job1`、 并按`test-job2`阶段顺序开始。

- 当该分支是默认分支时，

  ```
  test-job2
  ```

  被添加到管道中，因此：

  - `deploy-job`等待`test-job1`和`test-job2`完成。
  - `review-job`等待`test-job2`完成。

- 当分支不是默认分支时，

  ```
  test-job2
  ```

  不会添加到管道中，因此：

  - `deploy-job`只等待`test-job1`完成，不等待缺失`test-job2`。
  - `review-job`没有其他需要的工作并立即开始（与 同时`build-job`），例如`needs: []`。

#### `needs:pipeline`

您可以使用`needs:pipeline`关键字将管道状态从上游管道镜像到作业。默认分支的最新管道状态将复制到作业中。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 完整的项目路径，包括命名空间和组。如果项目位于同一组或命名空间中，则可以从`project` 关键字中省略它们。例如：`project: group/project-name`或`project: project-name`。

**示例`needs:pipeline`**：

```
upstream_status:
  stage: test
  needs:
    pipeline: other/project
```

**其他详细信息**：

- 如果将`job`关键字添加到`needs:pipeline`，作业将不再镜像管道状态。行为更改为[`needs:pipeline:job`](https://docs.gitlab.com/ee/ci/yaml/#needspipelinejob).

#### `needs:parallel:matrix`

在 GitLab 16.3 中[引入](https://gitlab.com/gitlab-org/gitlab/-/issues/254821)，带有名为 的[标志](https://docs.gitlab.com/ee/administration/feature_flags.html)`ci_needs_parallel_matrix`。默认禁用。

作业可以[`parallel:matrix`](https://docs.gitlab.com/ee/ci/yaml/#parallelmatrix)在单个管道中并行运行作业多次，但每个作业实例具有不同的变量值。

用于`needs:parallel:matrix`根据并行作业无序执行作业。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。必须与 一起使用`needs:job`。

**可能的输入**：变量哈希数组：

- 变量和值必须从作业中定义的变量和值中选择`parallel:matrix`。

**示例`needs:parallel:matrix`**：

```
linux:build:
  stage: build
  script: echo "Building linux..."
  parallel:
    matrix:
      - PROVIDER: aws
        STACK:
          - monitoring
          - app1
          - app2

linux:rspec:
  stage: test
  needs:
    - job: linux:build
      parallel:
        matrix:
          - PROVIDER: aws
          - STACK: app1
  script: echo "Running rspec on linux..."
```

上面的示例生成以下作业：

```
linux:build: [aws, monitoring]
linux:build: [aws, app1]
linux:build: [aws, app2]
linux:rspec
```

作业完成`linux:rspec`后立即运行`linux:build: [aws, app1]`。

**相关主题**：

- [使用具有多个并行作业的需求来指定并行作业](https://docs.gitlab.com/ee/ci/jobs/job_control.html#specify-a-parallelized-job-using-needs-with-multiple-parallelized-jobs)。

### `only`/`except`



`only`并且`except`没有被积极开发。[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)是控制何时将作业添加到管道的首选关键字。

您可以使用`only`和`except`来控制何时将作业添加到管道。

- 用于`only`定义作业何时运行。
- 用于`except`定义作业何时**不**运行。

有关更多详细信息和示例，[请](https://docs.gitlab.com/ee/ci/jobs/job_control.html#specify-when-jobs-run-with-only-and-except)参阅[指定作业何时运行 和。`only``except`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#specify-when-jobs-run-with-only-and-except)

#### `only:refs`/`except:refs`

使用`only:refs`和`except:refs`关键字来控制何时根据分支名称或管道类型将作业添加到管道。

`only:refs`并且`except:refs`没有被积极开发。[`rules:if`](https://docs.gitlab.com/ee/ci/yaml/#rulesif) 是使用引用、正则表达式或变量来控制何时将作业添加到管道时的首选关键字。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：包含任意数量的数组：

- 分支名称，例如`main`或`my-feature-branch`。

- [与分支名称匹配的正则表达式](https://docs.gitlab.com/ee/ci/jobs/job_control.html#only--except-regex-syntax) ，例如`/^feature-.*/`.

- 以下关键词：

  | **价值**                 | **描述**                                                     |
  | :----------------------- | :----------------------------------------------------------- |
  | `api`                    | 对于由[pipelines API](https://docs.gitlab.com/ee/api/pipelines.html#create-a-new-pipeline)触发的管道。 |
  | `branches`               | 当管道的 Git 引用是分支时。                                  |
  | `chat`                   | 适用于使用[GitLab ChatOps](https://docs.gitlab.com/ee/ci/chatops/index.html)命令创建的管道。 |
  | `external`               | 当您使用 GitLab 以外的 CI 服务时。                           |
  | `external_pull_requests` | 当 GitHub 上的外部拉取请求被创建或更新时（请参阅[外部拉取请求的管道](https://docs.gitlab.com/ee/ci/ci_cd_for_external_repos/index.html#pipelines-for-external-pull-requests)）。 |
  | `merge_requests`         | 用于创建或更新合并请求时创建的管道。启用[合并请求管道](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html)、[合并结果管道](https://docs.gitlab.com/ee/ci/pipelines/merged_results_pipelines.html)和[合并序列](https://docs.gitlab.com/ee/ci/pipelines/merge_trains.html)。 |
  | `pipelines`              | 对于通过使用带有, 或关键字的[API](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-multi-project-pipeline-by-using-the-api)创建的[多项目管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#multi-project-pipelines)。[`CI_JOB_TOKEN`](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-multi-project-pipeline-by-using-the-api)[`trigger`](https://docs.gitlab.com/ee/ci/yaml/#trigger) |
  | `pushes`                 | 用于由事件触发的管道`git push`，包括分支和标签。             |
  | `schedules`              | 对于[预定的管道](https://docs.gitlab.com/ee/ci/pipelines/schedules.html)。 |
  | `tags`                   | 当管道的 Git 引用是标签时。                                  |
  | `triggers`               | 对于使用[触发令牌](https://docs.gitlab.com/ee/ci/triggers/index.html#configure-cicd-jobs-to-run-in-triggered-pipelines)创建的管道。 |
  | `web`                    | 对于通过在 GitLab UI 中从项目的**“构建”>“管道”**部分选择**“运行管道”创建的管道。** |

**`only:refs`和的示例`except:refs`**：

```
job1:
  script: echo
  only:
    - main
    - /^issue-.*$/
    - merge_requests

job2:
  script: echo
  except:
    - main
    - /^stable-branch.*$/
    - schedules
```

**其他详细信息**：

- 计划管道在特定分支上运行，因此配置的作业`only: branches` 也可以在计划管道上运行。添加`except: schedules`以防止作业`only: branches` 在计划的管道上运行。

- `only`或`except`不带任何其他关键字使用相当于`only: refs` or `except: refs`。例如，以下两个作业配置具有相同的行为：

  ```
  job1:
    script: echo
    only:
      - branches
  
  job2:
    script: echo
    only:
      refs:
        - branches
  ```

- 如果作业不使用`only`、`except`或[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)，则默认`only`设置为`branches` 和。`tags`

  例如`job1`和`job2`是等价的：

  ```
  job1:
    script: echo "test"
  
  job2:
    script: echo "test"
    only:
      - branches
      - tags
  ```

#### `only:variables`/`except:variables`

使用`only:variables`或`except:variables`关键字根据[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html)的状态控制何时将作业添加到管道。

`only:variables`并且`except:variables`没有被积极开发。[`rules:if`](https://docs.gitlab.com/ee/ci/yaml/#rulesif) 是使用引用、正则表达式或变量来控制何时将作业添加到管道时的首选关键字。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- [CI/CD 变量表达式](https://docs.gitlab.com/ee/ci/jobs/job_control.html#cicd-variable-expressions)数组。

**示例`only:variables`**：

```
deploy:
  script: cap staging deploy
  only:
    variables:
      - $RELEASE == "staging"
      - $STAGING
```

**相关主题**：

- [`only:variables`和`except:variables`例子](https://docs.gitlab.com/ee/ci/jobs/job_control.html#only-variables--except-variables-examples)。

#### `only:changes`/`except:changes`

当 Git 推送事件修改文件时，使用`changes`关键字 with`only`运行作业，或使用 with`except`跳过作业。

`changes`在具有以下参考的管道中使用：

- `branches`
- `external_pull_requests`
- `merge_requests`（请参阅有关[与合并请求管道一起](https://docs.gitlab.com/ee/ci/jobs/job_control.html#use-onlychanges-with-merge-request-pipelines)[使用的`only:changes`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#use-onlychanges-with-merge-request-pipelines)其他详细信息）

`only:changes`并且`except:changes`没有被积极开发。[`rules:changes`](https://docs.gitlab.com/ee/ci/yaml/#ruleschanges) 是使用更改的文件来控制何时将作业添加到管道时的首选关键字。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：包含任意数量的数组：

- 文件的路径。
- 单个目录的通配符路径，例如`path/to/directory/*`，或目录及其所有子目录，例如`path/to/directory/**/*`。
- 具有相同扩展名或多个扩展名的所有文件的通配符[全局](https://en.wikipedia.org/wiki/Glob_(programming))路径，例如`*.md`或`path/to/directory/*.{rb,py,sh}`。请参阅[Ruby`fnmatch`文档](https://docs.ruby-lang.org/en/master/File.html#method-c-fnmatch) 以获取支持的语法列表。
- 根目录或所有目录中文件的通配符路径，用双引号引起来。例如`"*.json"`或`"**/*.json"`.

**示例`only:changes`**：

```
docker build:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  only:
    refs:
      - branches
    changes:
      - Dockerfile
      - docker/scripts/*
      - dockerfiles/**/*
      - more_scripts/*.{rb,py,sh}
      - "**/*.json"
```

**其他详细信息**：

- `changes`解析`true`是否有任何匹配的文件被更改（`OR`操作）。
- `branches`如果您使用、`external_pull_requests`、 或以外的引用`merge_requests`， `changes`则无法确定给定文件是新文件还是旧文件，并且始终返回`true`。
- 如果与其他引用一起使用`only: changes`，作业将忽略更改并始终运行。
- 如果与其他引用一起使用`except: changes`，作业将忽略更改并且永远不会运行。

**相关主题**：

- [`only: changes`和`except: changes`例子](https://docs.gitlab.com/ee/ci/jobs/job_control.html#onlychanges--exceptchanges-examples)。
- 如果您使用`changes`with[仅允许在管道成功时合并合并请求](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html#require-a-successful-pipeline-for-merge)，则[还应该使用`only:merge_requests`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#use-onlychanges-with-merge-request-pipelines).
- [使用 时，作业或管道可能会意外运行`only: changes`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#jobs-or-pipelines-run-unexpectedly-when-using-changes)。

#### `only:kubernetes`/`except:kubernetes`

使用`only:kubernetes`或`except:kubernetes`控制当 Kubernetes 服务在项目中处于活动状态时是否将作业添加到管道中。

`only:refs`并且`except:refs`没有被积极开发。[`rules:if`](https://docs.gitlab.com/ee/ci/yaml/#rulesif) 与预定义的 CI/CD 变量一起使用[`CI_KUBERNETES_ACTIVE`](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)，控制当 Kubernetes 服务在项目中处于活动状态时是否将作业添加到管道中。

**关键字类型**：特定于工作。您只能将其用作工作的一部分。

**可能的输入**：

- 该`kubernetes`策略仅接受`active`关键字。

**示例`only:kubernetes`**：

```
deploy:
  only:
    kubernetes: active
```

在此示例中，`deploy`作业仅当 Kubernetes 服务在项目中处于活动状态时运行。

### `pages`

用于`pages`定义将静态内容上传到 GitLab 的[GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/index.html)作业。然后将内容发布为网站。

你必须：

- 定义[`artifacts`](https://docs.gitlab.com/ee/ci/yaml/#artifacts)内容目录的路径，这是 `public`默认的。
- [`publish`](https://docs.gitlab.com/ee/ci/yaml/#pagespublish)如果想要使用不同的内容目录，请使用。

**关键字类型**：职位名称。

**示例`pages`**：

```
pages:
  stage: deploy
  script:
    - mv my-html-content public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  environment: production
```

此示例将所有文件从一个`my-html-content/`目录移动到该`public/`目录。该目录将作为工件导出并使用 GitLab Pages 发布。

#### `pages:publish`

在 GitLab 16.1 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/415821)

用于配置[作业](https://docs.gitlab.com/ee/ci/yaml/#pages)`publish`的内容目录。[`pages`](https://docs.gitlab.com/ee/ci/yaml/#pages)

**关键字类型**：职位关键字。您只能将其用作工作的一部分`pages`。

**可能的输入**：包含页面内容的目录的路径。

**示例`publish`**：

```
pages:
  stage: deploy
  script:
    - npx @11ty/eleventy --input=path/to/eleventy/root --output=dist
  artifacts:
    paths:
      - dist
  publish: dist
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  environment: production
```

本示例使用[Eleventy](https://www.11ty.dev/)生成静态网站并将生成的 HTML 文件输出到目录中`dist/`。该目录将作为工件导出并使用 GitLab Pages 发布。

### `parallel`

[在 GitLab 15.9 中引入](https://gitlab.com/gitlab-org/gitlab/-/issues/336576)，最大值`parallel`从 50 增加到 200。

用于`parallel`在单个管道中并行运行作业多次。

必须存在多个运行程序，或者必须将单个运行程序配置为同时运行多个作业。

`job_name 1/N`并行作业按从到 的顺序命名`job_name N/N`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `1`从到 的数值`200`。

**示例`parallel`**：

```
test:
  script: rspec
  parallel: 5
```

此示例创建 5 个并行运行的作业，名为`test 1/5`to `test 5/5`。

**其他详细信息**：

- 每个并行作业都有一个预定义`CI_NODE_INDEX`的`CI_NODE_TOTAL` [CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html#predefined-cicd-variables)集。

- 包含作业的管道

  ```
  parallel
  ```

  可能会：

  - 创建比可用运行程序更多的并行运行作业。`pending`在等待可用的运行程序时，多余的作业会排队并标记。
  - 创建太多作业，管道失败并出现`job_activity_limit_exceeded`错误。活动管道中可以存在的最大作业数[在实例级别受到限制](https://docs.gitlab.com/ee/administration/instance_limits.html#number-of-jobs-in-active-pipelines)。

**相关主题**：

- [并行化大型作业](https://docs.gitlab.com/ee/ci/jobs/job_control.html#parallelize-large-jobs)。

#### `parallel:matrix`

版本历史 

用于`parallel:matrix`在单个管道中并行运行作业多次，但每个作业实例使用不同的变量值。

必须存在多个运行程序，或者必须将单个运行程序配置为同时运行多个作业。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：变量哈希数组：

- 变量名只能使用数字、字母和下划线( `_`)。
- 这些值必须是字符串或字符串数组。
- 排列数不能超过200。

**示例`parallel:matrix`**：

```
deploystacks:
  stage: deploy
  script:
    - bin/deploy
  parallel:
    matrix:
      - PROVIDER: aws
        STACK:
          - monitoring
          - app1
          - app2
      - PROVIDER: ovh
        STACK: [monitoring, backup, app]
      - PROVIDER: [gcp, vultr]
        STACK: [data, processing]
  environment: $PROVIDER/$STACK
```

该示例生成 10 个并行`deploystacks`作业，每个作业具有不同的`PROVIDER`和值`STACK`：

```
deploystacks: [aws, monitoring]
deploystacks: [aws, app1]
deploystacks: [aws, app2]
deploystacks: [ovh, monitoring]
deploystacks: [ovh, backup]
deploystacks: [ovh, app]
deploystacks: [gcp, data]
deploystacks: [gcp, processing]
deploystacks: [vultr, data]
deploystacks: [vultr, processing]
```

**其他详细信息**：

- ```
  parallel:matrix
  ```

  jobs 将变量值添加到作业名称中以区分作业，但

  较大的值可能会导致名称超出限制

  ：

  - 作业名称不得[超过 255 个字符](https://docs.gitlab.com/ee/ci/jobs/index.html#job-name-limitations)。
  - 使用 时[`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)，作业名称不得超过 128 个字符。

**相关主题**：

- [运行并行作业的一维矩阵](https://docs.gitlab.com/ee/ci/jobs/job_control.html#run-a-one-dimensional-matrix-of-parallel-jobs)。
- [运行触发的并行作业矩阵](https://docs.gitlab.com/ee/ci/jobs/job_control.html#run-a-matrix-of-parallel-trigger-jobs)。
- [为每个并行矩阵作业选择不同的运行者标签](https://docs.gitlab.com/ee/ci/jobs/job_control.html#select-different-runner-tags-for-each-parallel-matrix-job)。

### `release`

在 GitLab 13.2 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/19298)

用于`release`创建[版本](https://docs.gitlab.com/ee/user/project/releases/index.html)。

发布作业必须有权访问[`release-cli`](https://gitlab.com/gitlab-org/release-cli/-/tree/master/docs)，它必须位于`$PATH`.

如果您使用[Docker 执行器](https://docs.gitlab.com/runner/executors/docker.html)，则可以使用 GitLab 容器注册表中的此映像：`registry.gitlab.com/gitlab-org/release-cli:latest`

如果您使用[Shell 执行程序](https://docs.gitlab.com/runner/executors/shell.html)或类似程序， [请安装`release-cli`](https://docs.gitlab.com/ee/user/project/releases/release_cli.html)在注册运行程序的服务器上。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：`release`子项：

- [`tag_name`](https://docs.gitlab.com/ee/ci/yaml/#releasetag_name)
- [`tag_message`](https://docs.gitlab.com/ee/ci/yaml/#releasetag_message)（选修的）
- [`name`](https://docs.gitlab.com/ee/ci/yaml/#releasename)（选修的）
- [`description`](https://docs.gitlab.com/ee/ci/yaml/#releasedescription)
- [`ref`](https://docs.gitlab.com/ee/ci/yaml/#releaseref)（选修的）
- [`milestones`](https://docs.gitlab.com/ee/ci/yaml/#releasemilestones)（选修的）
- [`released_at`](https://docs.gitlab.com/ee/ci/yaml/#releasereleased_at)（选修的）
- [`assets:links`](https://docs.gitlab.com/ee/ci/yaml/#releaseassetslinks)（选修的）

**`release`关键字示例**：

```
release_job:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  rules:
    - if: $CI_COMMIT_TAG                  # Run this job when a tag is created manually
  script:
    - echo "Running the release job."
  release:
    tag_name: $CI_COMMIT_TAG
    name: 'Release $CI_COMMIT_TAG'
    description: 'Release created using the release-cli.'
```

此示例创建一个版本：

- 当您推送 Git 标签时。
- 当您在 UI 中的**Code > Tags**处添加 Git 标签时。

**其他详细信息**：

- 所有发布作业（[触发器](https://docs.gitlab.com/ee/ci/yaml/#trigger)作业除外）都必须包含该`script`关键字。发布作业可以使用脚本命令的输出。如果不需要脚本，可以使用占位符：

  ```
  script:
    - echo "release job"
  ```

  存在删除此要求的[问题](https://gitlab.com/gitlab-org/gitlab/-/issues/223856)。

- 该部分在关键字之后、 之前`release`执行。`script``after_script`

- 仅当作业的主脚本成功时才会创建版本。

- 如果版本已存在，则不会更新，并且带有该`release`关键字的作业将失败。

**相关主题**：

- [`release`关键字的 CI/CD 示例](https://docs.gitlab.com/ee/user/project/releases/index.html#creating-a-release-by-using-a-cicd-job)。
- [在单个管道中创建多个版本](https://docs.gitlab.com/ee/user/project/releases/index.html#create-multiple-releases-in-a-single-pipeline)。
- [使用自定义 SSL CA 证书颁发机构](https://docs.gitlab.com/ee/user/project/releases/index.html#use-a-custom-ssl-ca-certificate-authority)。

#### `release:tag_name`

必需的。发布的 Git 标签。

如果项目中尚不存在该标签，则会在发布时同时创建该标签。新标签使用与管道关联的 SHA。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 标签名称。

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`release:tag_name`**：

要在将新标签添加到项目时创建版本：

- 使用`$CI_COMMIT_TAG`CI/CD 变量作为`tag_name`.
- 用于[`rules:if`](https://docs.gitlab.com/ee/ci/yaml/#rulesif)将作业配置为仅针对新标签运行。

```
job:
  script: echo "Running the release job for the new tag."
  release:
    tag_name: $CI_COMMIT_TAG
    description: 'Release description'
  rules:
    - if: $CI_COMMIT_TAG
```

要同时创建版本和新标签，您[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules) 不应**将**作业配置为仅针对新标签运行。语义版本控制示例：

```
job:
  script: echo "Running the release job and creating a new tag."
  release:
    tag_name: ${MAJOR}_${MINOR}_${REVISION}
    description: 'Release description'
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
```

#### `release:tag_message`

在 GitLab 15.3 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/363024)v0.12.0 或更高版本支持`release-cli`。

如果该标签不存在，则新创建的标签将使用 指定的消息进行注释`tag_message`。如果省略，则会创建轻量级标签。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 一个文本字符串。

**示例`release:tag_message`**：

```
  release_job:
    stage: release
    release:
      tag_name: $CI_COMMIT_TAG
      description: 'Release description'
      tag_message: 'Annotated tag message'
```

#### `release:name`

发布名称。如果省略，则用 的值填充`release: tag_name`。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 一个文本字符串。

**示例`release:name`**：

```
  release_job:
    stage: release
    release:
      name: 'Release $CI_COMMIT_TAG'
```

#### `release:description`

发布的详细描述。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 带有长描述的字符串。

- 包含描述的文件的路径。

  在GitLab 13.7

  中引入。

  - 文件位置必须相对于项目目录 ( `$CI_PROJECT_DIR`)。
  - 如果文件是符号链接，则它必须位于`$CI_PROJECT_DIR`.
  - 和`./path/to/file`文件名不能包含空格。

**示例`release:description`**：

```
job:
  release:
    tag_name: ${MAJOR}_${MINOR}_${REVISION}
    description: './path/to/CHANGELOG.md'
```

**其他详细信息**：

- `description`由运行的 shell计算`release-cli`。您可以使用 CI/CD 变量来定义描述，但某些 shell [使用不同的语法](https://docs.gitlab.com/ee/ci/variables/index.html#use-cicd-variables-in-job-scripts) 来引用变量。同样，某些 shell 可能需要转义特殊字符。例如，反引号 ( ```) 可能需要用反斜杠 ( `\`) 进行转义。

#### `release:ref`

用于发布版本`ref`（如果`release: tag_name`尚不存在）。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 提交 SHA、另一个标记名称或分支名称。

#### `release:milestones`

与该版本关联的每个里程碑的标题。

#### `release:released_at`

发布准备就绪的日期和时间。

**可能的输入**：

- 用引号括起来并以 ISO 8601 格式表示的日期。

**示例`release:released_at`**：

```
released_at: '2021-03-15T08:00:00Z'
```

**其他详细信息**：

- 如果未定义，则使用当前日期和时间。

#### `release:assets:links`

在 GitLab 13.12 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/271454)

用于在版本中`release:assets:links`包含[资产链接。](https://docs.gitlab.com/ee/user/project/releases/release_fields.html#release-assets)

需要`release-cli`v0.4.0 或更高版本。

**示例`release:assets:links`**：

```
assets:
  links:
    - name: 'asset1'
      url: 'https://example.com/assets/1'
    - name: 'asset2'
      url: 'https://example.com/assets/2'
      filepath: '/pretty/url/1' # optional
      link_type: 'other' # optional
```

### `resource_group`

在 GitLab 12.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/15536)

用于`resource_group`创建[资源组](https://docs.gitlab.com/ee/ci/resource_groups/index.html)，以确保同一项目的不同管道之间的作业是互斥的。

例如，如果属于同一资源组的多个作业同时排队，则只有其中一个作业启动。其他工作要等到`resource_group`空闲时再进行。

资源组的行为类似于其他编程语言中的信号量。

您可以为每个环境定义多个资源组。例如，部署到物理设备时，您可能有多个物理设备。每台设备都可以部署到，但在任何给定时间每台设备只能进行一次部署。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 仅限字母、数字、、`-`、、、、、和空格。它不能以 开始或结束。[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。`_``/``$``{``}``.``/`

**示例`resource_group`**：

```
deploy-to-production:
  script: deploy
  resource_group: production
```

在此示例中，`deploy-to-production`两个单独管道中的两个作业永远不能同时运行。因此，您可以确保生产环境中永远不会发生并发部署。

**相关主题**：

- [具有跨项目/父子管道的管道级并发控制](https://docs.gitlab.com/ee/ci/resource_groups/index.html#pipeline-level-concurrency-control-with-cross-projectparent-child-pipelines)。

### `retry`

用于`retry`配置作业失败时重试的次数。如果未定义，则默认为`0`作业不会重试。

当作业失败时，作业最多会再处理两次，直到成功或达到最大重试次数。

默认情况下，所有失败类型都会导致重试作业。用于[`retry:when`](https://docs.gitlab.com/ee/ci/yaml/#retrywhen) 选择要重试的失败。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- `0`（默认）、`1`、 或`2`。

**示例`retry`**：

```
test:
  script: rspec
  retry: 2
```

#### `retry:when`

使用`retry:when`with`retry:max`仅针对特定的失败情况重试作业。 `retry:max`是最大重试次数，例如[`retry`](https://docs.gitlab.com/ee/ci/yaml/#retry)、 ，可以是 `0`、`1`、 或`2`。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 单一故障类型，或一种或多种故障类型的数组：

- `always`：出现任何失败时重试（默认）。

- `unknown_failure`：未知失败原因时重试。

- ```
  script_failure
  ```

  ：重试时：

  - 脚本失败了。
  - 运行程序无法拉取 Docker 镜像。对于`docker`, `docker+machine`,`kubernetes` [执行者](https://docs.gitlab.com/runner/executors/)。

- `api_failure`：API 失败时重试。

- `stuck_or_timeout_failure`：作业卡住或超时时重试。

- `runner_system_failure`：如果运行程序系统出现故障（例如作业设置失败），请重试。

- `runner_unsupported`：如果运行器不受支持，请重试。

- `stale_schedule`：如果无法执行延迟作业，请重试。

- `job_execution_timeout`：如果脚本超过为作业设置的最长执行时间，请重试。

- `archived_failure`：如果作业已存档且无法运行，请重试。

- `unmet_prerequisites`：如果作业未能完成先决任务，请重试。

- `scheduler_failure`：如果调度程序未能将作业分配给运行程序，请重试。

- `data_integrity_failure`：如果检测到结构完整性问题，请重试。

**示例`retry:when`**（单一故障类型）：

```
test:
  script: rspec
  retry:
    max: 2
    when: runner_system_failure
```

如果存在运行器系统故障以外的故障，则不会重试作业。

**`retry:when`**（故障类型数组）**示例：**

```
test:
  script: rspec
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
```

**相关主题**：

[您可以使用变量指定作业执行的某些阶段](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#job-stages-attempts)的重试尝试次数 。

### `rules`

在 GitLab 12.3 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/27863)

用于`rules`在管道中包含或排除作业。

创建管道时会评估规则，并按*顺序*评估 直到第一个匹配项。找到匹配项后，作业将包含在管道中或从管道中排除，具体取决于配置。

您不能在规则中使用在作业脚本中创建的 dotenv 变量，因为规则是在任何作业运行之前评估的。

`rules`替换[`only/except`](https://docs.gitlab.com/ee/ci/yaml/#only--except)，并且它们不能在同一工作中一起使用。如果您将一项作业配置为使用这两个关键字，GitLab 将返回错误`key may not be used with rules`。

`rules`接受由以下定义的规则数组：

- `if`
- `changes`
- `exists`
- `allow_failure`
- `variables`
- `when`

您可以将多个关键字组合在一起以获得[复杂的规则](https://docs.gitlab.com/ee/ci/jobs/job_control.html#complex-rules)。

该作业已添加到管道中：

- 如果`if`、`changes`、 或`exists`规则匹配并且也有`when: on_success`（默认）、 `when: delayed`、 或`when: always`。
- 如果达到一条规则，则只有`when: on_success`, `when: delayed`, 或`when: always`。

该作业未添加到管道中：

- 如果没有规则匹配。
- 如果规则匹配并且有`when: never`.

您可以使用[`!reference`标签在不同](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#reference-tags)[的](https://docs.gitlab.com/ee/ci/jobs/job_control.html#reuse-rules-in-different-jobs)作业中重用[配置`rules`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#reuse-rules-in-different-jobs) 。

#### `rules:if`

使用`rules:if`子句指定何时将作业添加到管道：

- 如果`if`陈述为真，则将作业添加到管道中。
- 如果某个`if`语句为 true，但它与 组合`when: never`，则不要将该作业添加到管道中。
- 如果没有任何`if`陈述为真，则不要将作业添加到管道中。

`if`子句根据[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html) 或[预定义 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)的值进行评估，但有 [一些例外](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。

**关键字类型**：特定于作业和特定于管道。您可以将其用作作业的一部分来配置作业行为，或用于[`workflow`](https://docs.gitlab.com/ee/ci/yaml/#workflow)配置管道行为。

**可能的输入**：

- CI [/CD 变量表达式](https://docs.gitlab.com/ee/ci/jobs/job_control.html#cicd-variable-expressions)。

**示例`rules:if`**：

```
job:
  script: echo "Hello, Rules!"
  rules:
    - if: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^feature/ && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME != $CI_DEFAULT_BRANCH
      when: never
    - if: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^feature/
      when: manual
      allow_failure: true
    - if: $CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
```

**其他详细信息**：

- 如果规则匹配且未`when`定义，则该规则将使用`when` 为作业定义的规则，`on_success`如果未定义，则默认为该规则。

- 在 GitLab 14.5 及更早版本中，您可以`when`为每个规则定义一次，或者在作业级别定义一次，这适用于所有规则。你不能将`when`工作层面与`when`规则混为一谈。

- 在 GitLab 14.6 及更高版本中，您可以[在作业级别与](https://gitlab.com/gitlab-org/gitlab/-/issues/219437)[规则](https://gitlab.com/gitlab-org/gitlab/-/issues/219437)[混合`when``when`](https://gitlab.com/gitlab-org/gitlab/-/issues/219437)。 `when`配置中的配置`rules`优先于`when`作业级别的配置。

- 与节中的变量不同

  `script`

   ，规则表达式中的变量始终格式为

  ```
  $VARIABLE
  ```

  .

  - 您可以使用`rules:if`with有条件`include`地[包含其他配置文件](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-rules-with-include)。

- `=~`和`!~`表达式右侧的 CI/CD 变量被[计算为正则表达式](https://docs.gitlab.com/ee/ci/jobs/job_control.html#store-the-regex-pattern-in-a-variable)。

**相关主题**：

- [的常用`if`表达方式`rules`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#common-if-clauses-for-rules)。
- [避免重复的管道](https://docs.gitlab.com/ee/ci/jobs/job_control.html#avoid-duplicate-pipelines)。
- [用于`rules`运行合并请求管道](https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html#use-rules-to-add-jobs)。

#### `rules:changes`

用于`rules:changes`通过检查特定文件的更改来指定何时将作业添加到管道。



```
rules: changes`您应该仅与**分支管道**或**合并请求管道**一起使用。您可以`rules: changes`与其他管道类型一起使用，但`rules: changes`在没有 Git`push`事件时始终评估为 true。标记管道、计划管道、手动管道等没有**与其**`push`关联的Git事件。如果没有限制作业分支或合并请求管道，则作业**始终**`rules: changes`会添加到这些管道中。`if
```

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

一个数组，包含任意数量的：

- 文件的路径。在 GitLab 13.6 及更高版本中，[文件路径可以包含变量](https://docs.gitlab.com/ee/ci/jobs/job_control.html#variables-in-ruleschanges)。文件路径数组也可以位于[`rules:changes:paths`](https://docs.gitlab.com/ee/ci/yaml/#ruleschangespaths).
- 通配符路径：
  - 单个目录，例如`path/to/directory/*`.
  - 一个目录及其所有子目录，例如`path/to/directory/**/*`.
- 具有相同扩展名或多个扩展名的所有文件的通配符[全局](https://en.wikipedia.org/wiki/Glob_(programming))路径，例如`*.md`或`path/to/directory/*.{rb,py,sh}`。请参阅[Ruby`fnmatch`文档](https://docs.ruby-lang.org/en/master/File.html#method-c-fnmatch) 以获取支持的语法列表。
- 根目录或所有目录中文件的通配符路径，用双引号引起来。例如`"*.json"`或`"**/*.json"`.

**示例`rules:changes`**：

```
docker build:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        - Dockerfile
      when: manual
      allow_failure: true
```

- 如果管道是合并请求管道，请检查`Dockerfile`更改。
- 如果`Dockerfile`已更改，则将作业作为手动作业添加到管道中，即使作业未触发，管道也会继续运行 ( `allow_failure: true`)。
- 每个部分最多可以定义 50 个模式或文件路径`rules:changes`。
- 如果`Dockerfile`没有改变，则不要将作业添加到任何管道（与 相同`when: never`）。
- [`rules:changes:paths`](https://docs.gitlab.com/ee/ci/yaml/#ruleschangespaths)`rules:changes`与没有任何子项时相同。

**其他详细信息**：

- `rules: changes`[`only: changes`与和 的`except: changes`](https://docs.gitlab.com/ee/ci/yaml/#onlychanges--exceptchanges)工作方式相同。
- 您可以使用`when: never`来实现类似于 的规则[`except:changes`](https://docs.gitlab.com/ee/ci/yaml/#onlychanges--exceptchanges)。
- `changes`解析`true`是否有任何匹配的文件被更改（`OR`操作）。

**相关主题**：

- [使用 时，作业或管道可能会意外运行`rules: changes`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#jobs-or-pipelines-run-unexpectedly-when-using-changes)。

##### `rules:changes:paths`

在 GitLab 15.2 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/90171)

用于`rules:changes`指定仅当特定文件发生更改时才将作业添加到管道，并用于`rules:changes:paths`指定文件。

`rules:changes:paths`[`rules:changes`](https://docs.gitlab.com/ee/ci/yaml/#ruleschanges)与不使用任何子项的情况相同。所有其他详细信息和相关主题都是相同的。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 文件路径数组。[文件路径可以包含变量](https://docs.gitlab.com/ee/ci/jobs/job_control.html#variables-in-ruleschanges)。

**示例`rules:changes:paths`**：

```
docker-build-1:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        - Dockerfile

docker-build-2:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        paths:
          - Dockerfile
```

在此示例中，两个作业具有相同的行为。

##### `rules:changes:compare_to`

版本历史 

用于`rules:changes:compare_to`指定要与 下列出的文件的更改进行比较的引用[`rules:changes:paths`](https://docs.gitlab.com/ee/ci/yaml/#ruleschangespaths)。

**关键字类型**：职位关键字。您只能将它用作作业的一部分，并且它必须与 结合使用`rules:changes:paths`。

**可能的输入**：

- 分支名称，例如`main`、`branch1`、 或`refs/heads/branch1`。
- 标签名称，例如`tag1`或`refs/tags/tag1`。
- 提交 SHA，例如`2fg31ga14b`.

**示例`rules:changes:compare_to`**：

```
docker build:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        paths:
          - Dockerfile
        compare_to: 'refs/heads/branch1'
```

在此示例中，仅当相对于合并请求事件发生更改并且管道源是合并请求事件`docker build`时才包含作业。`Dockerfile``refs/heads/branch1`

#### `rules:exists`

版本历史 

用于`exists`当存储库中存在某些文件时运行作业。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 文件路径数组。路径是相对于项目目录 ( `$CI_PROJECT_DIR`) 的，不能直接链接到其外部。文件路径可以使用 glob 模式和[CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)。

**示例`rules:exists`**：

```
job:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - exists:
        - Dockerfile
```

`job`如果`Dockerfile`存储库中存在 a 则运行。

**其他详细信息**：

- [`File.fnmatch`](https://docs.ruby-lang.org/en/2.7.0/File.html#method-c-fnmatch) Glob 模式通过带有 flags 的Ruby 进行解释`File::FNM_PATHNAME | File::FNM_DOTMATCH | File::FNM_EXTGLOB`。
- 出于性能原因，GitLab 最多对 `exists`模式或文件路径执行 10,000 次检查。第 10,000 次检查后，具有模式化 glob 的规则始终匹配。换句话说，`exists`规则始终假定文件数量超过 10,000 个的项目匹配，或者文件数量少于 10,000 个但规则`exists`检查次数超过 10,000 次。
- 每个部分最多可以定义 50 个模式或文件路径`rules:exists`。
- `exists`解析`true`是否找到任何列出的文件（`OR`操作）。

#### `rules:allow_failure`

在 GitLab 12.8 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/30235)

使用[`allow_failure: true`](https://docs.gitlab.com/ee/ci/yaml/#allow_failure)in`rules`允许作业失败而不停止管道。

`allow_failure: true`您也可以与手动作业一起使用。管道继续运行，无需等待手动作业的结果。`allow_failure: false` 与`when: manual`in 规则结合使用会导致管道等待手动作业运行后再继续。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `true`或`false`。`false`如果未定义则默认为。

**示例`rules:allow_failure`**：

```
job:
  script: echo "Hello, Rules!"
  rules:
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == $CI_DEFAULT_BRANCH
      when: manual
      allow_failure: true
```

如果规则匹配，则该作业是手动作业`allow_failure: true`。

**其他详细信息**：

- 规则级别`rules:allow_failure`覆盖作业级别[`allow_failure`](https://docs.gitlab.com/ee/ci/yaml/#allow_failure)，并且仅在特定规则触发作业时应用。

#### `rules:needs`

版本历史 

在规则中使用`needs`以针对特定条件更新作业[`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)。当条件与规则匹配时，作业的`needs`配置将完全替换为`needs`规则中的配置。

**关键字类型**：特定于工作。您只能将其用作工作的一部分。

**可能的输入**：

- 作为字符串的作业名称数组。
- 带有作业名称的哈希值，可以选择带有其他属性。
- 一个空数组（`[]`），当满足特定条件时将作业设置为 none。

**示例`rules:needs`**：

```
build-dev:
  stage: build
  rules:
    - if: $CI_COMMIT_BRANCH != $CI_DEFAULT_BRANCH
  script: echo "Feature branch, so building dev version..."

build-prod:
  stage: build
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  script: echo "Default branch, so building prod version..."

specs:
  stage: test
  needs: ['build-dev']
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      needs: ['build-prod']
    - when: on_success # Run the job in other cases
  script: echo "Running dev specs by default, or prod specs when default branch..."
```

在这个例子中：

- 如果管道在非默认分支的分支上运行，则`specs`作业需要该`build-dev`作业（默认行为）。
- 如果管道在默认分支上运行，因此规则与条件匹配，则作业`specs`需要该`build-prod`作业。

**其他详细信息**：

- `needs`规则中的内容会覆盖`needs`在作业级别定义的任何内容。当被覆盖时，行为与[job-level`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)相同。
- `needs`在规则中可以接受[`artifacts`](https://docs.gitlab.com/ee/ci/yaml/#needsartifacts)和[`optional`](https://docs.gitlab.com/ee/ci/yaml/#needsoptional)。

#### `rules:variables`

版本历史 

使用[`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables)in`rules`定义特定条件的变量。

**关键字类型**：特定于工作。您只能将其用作工作的一部分。

**可能的输入**：

- 格式为 的变量的哈希值`VARIABLE-NAME: value`。

**示例`rules:variables`**：

```
job:
  variables:
    DEPLOY_VARIABLE: "default-deploy"
  rules:
    - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH
      variables:                              # Override DEPLOY_VARIABLE defined
        DEPLOY_VARIABLE: "deploy-production"  # at the job level.
    - if: $CI_COMMIT_REF_NAME =~ /feature/
      variables:
        IS_A_FEATURE: "true"                  # Define a new variable.
  script:
    - echo "Run script with $DEPLOY_VARIABLE as an argument"
    - echo "Run another script if $IS_A_FEATURE exists"
```

### `script`

用于`script`指定运行程序要执行的命令。

[除触发](https://docs.gitlab.com/ee/ci/yaml/#trigger)作业外的所有作业都需要`script`关键字。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：一个数组，包括：

- 单行命令。
- 长命令[分成多行](https://docs.gitlab.com/ee/ci/yaml/script.html#split-long-commands)。
- [YAML 锚点](https://docs.gitlab.com/ee/ci/yaml/yaml_optimization.html#yaml-anchors-for-scripts)。

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`script`**：

```
job1:
  script: "bundle exec rspec"

job2:
  script:
    - uname -a
    - bundle exec rspec
```

**其他详细信息**：

- 当您在中使用[这些特殊字符`script`](https://docs.gitlab.com/ee/ci/yaml/script.html#use-special-characters-with-script)时，必须使用单引号( `'`) 或双引号( `"`)。

**相关主题**：

- 您可以[忽略非零退出代码](https://docs.gitlab.com/ee/ci/yaml/script.html#ignore-non-zero-exit-codes)。
- [使用颜色代码可以`script`](https://docs.gitlab.com/ee/ci/yaml/script.html#add-color-codes-to-script-output) 使作业日志更易于查看。
- [创建自定义可折叠部分](https://docs.gitlab.com/ee/ci/jobs/index.html#custom-collapsible-sections) 以简化作业日志输出。

### `secrets` [优质的](https://about.gitlab.com/pricing/?glm_source=docs.gitlab.com&glm_content=badges-docs)

在 GitLab 13.4 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/33014)

用于`secrets`指定[CI/CD 机密](https://docs.gitlab.com/ee/ci/secrets/index.html)以：

- 从外部机密提供者检索。
- [在作业中作为CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html)可用 （默认[`file`类型）。](https://docs.gitlab.com/ee/ci/variables/index.html#use-file-type-cicd-variables)

#### `secrets:vault`

在 GitLab 13.4 和 GitLab Runner 13.4 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/28321)

用于指定[HashiCorp Vault](https://www.vaultproject.io/)`secrets:vault`提供的机密。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `engine:name`：秘密引擎的名称。
- `engine:path`：秘密引擎的路径。
- `path`: 通往秘密的道路。
- `field`：存储密码的字段名称。

**示例`secrets:vault`**：

要显式指定所有详细信息并使用[KV-V2](https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2)机密引擎：

```
job:
  secrets:
    DATABASE_PASSWORD:  # Store the path to the secret in this CI/CD variable
      vault:  # Translates to secret: `ops/data/production/db`, field: `password`
        engine:
          name: kv-v2
          path: ops
        path: production/db
        field: password
```

您可以缩短此语法。使用短语法，`engine:name`两者`engine:path` 都默认为`kv-v2`：

```
job:
  secrets:
    DATABASE_PASSWORD:  # Store the path to the secret in this CI/CD variable
      vault: production/db/password  # Translates to secret: `kv-v2/data/production/db`, field: `password`
```

要以短语法指定自定义机密引擎路径，请添加以 开头的后缀`@`：

```
job:
  secrets:
    DATABASE_PASSWORD:  # Store the path to the secret in this CI/CD variable
      vault: production/db/password@ops  # Translates to secret: `ops/data/production/db`, field: `password`
```

#### `secrets:azure_key_vault`

在 GitLab 16.3 和 GitLab Runner 16.3 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/271271)

用于指定[Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/)`secrets:azure_key_vault`提供的机密。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `name`：秘密的名称。
- `version`：秘密版本。

**示例`secrets:azure_key_vault`**：

```
job:
  secrets:
    DATABASE_PASSWORD:
      azure_key_vault:
        name: 'test'
        version: 'test'
```

**相关主题**：

- [在 GitLab CI/CD 中使用 Azure Key Vault 机密](https://docs.gitlab.com/ee/ci/secrets/azure_key_vault.html)。

#### `secrets:file`

在 GitLab 14.1 和 GitLab Runner 14.1 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/250695)

用于`secrets:file`将机密配置为存储为 [`file`或`variable`类型 CI/CD 变量](https://docs.gitlab.com/ee/ci/variables/index.html#use-file-type-cicd-variables)

默认情况下，秘密作为`file`CI/CD 类型变量传递给作业。秘密的值存储在文件中，变量包含文件的路径。

如果您的软件无法使用`file`CI/CD 类型变量，请设置`file: false`为将秘密值直接存储在变量中。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- `true`（默认）或`false`.

**示例`secrets:file`**：

```
job:
  secrets:
    DATABASE_PASSWORD:
      vault: production/db/password@ops
      file: false
```

**其他详细信息**：

- 该`file`关键字是 CI/CD 变量的设置，必须嵌套在 CI/CD 变量名称下，而不是嵌套在该`vault`部分中。

#### `secrets:token`

在 GitLab 15.8 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/356986)

用于`secrets:token`通过引用令牌的 CI/CD 变量来显式选择在使用 Vault 进行身份验证时要使用的令牌。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- ID 令牌的名称

**示例`secrets:token`**：

```
job:
  id_tokens:
    AWS_TOKEN:
      aud: https://aws.example.com
    VAULT_TOKEN:
      aud: https://vault.example.com
  secrets:
    DB_PASSWORD:
      vault: gitlab/production/db
      token: $VAULT_TOKEN
```

**其他详细信息**：

- 当`token`未设置关键字时，将使用第一个 ID 令牌进行身份验证。
- 在 GitLab 15.8 到 15.11 中，您必须启用[**限制 JSON Web 令牌 (JWT) 访问**](https://docs.gitlab.com/ee/ci/secrets/id_token_authentication.html#enable-automatic-id-token-authentication-deprecated)才能使该关键字可用。
- **禁用限制 JSON Web 令牌 (JWT) 访问**时，`token`将忽略该关键字并`CI_JOB_JWT` 使用 CI/CD 变量进行身份验证。

### `services`

用于`services`指定脚本成功运行所需的任何其他 Docker 映像。该[`services`图像](https://docs.gitlab.com/ee/ci/services/index.html)链接到[`image`](https://docs.gitlab.com/ee/ci/yaml/#image)关键字中指定的图像。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：服务映像的名称，包括注册表路径（如果需要），采用以下格式之一：

- `<image-name>``<image-name>`（与使用标签相同`latest`）
- `<image-name>:<tag>`
- `<image-name>@<digest>`

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量，但[不支持`alias`](https://gitlab.com/gitlab-org/gitlab/-/issues/19561).

**示例`services`**：

```
default:
  image:
    name: ruby:2.6
    entrypoint: ["/bin/bash"]

  services:
    - name: my-postgres:11.7
      alias: db-postgres
      entrypoint: ["/usr/local/bin/db-postgres"]
      command: ["start"]

  before_script:
    - bundle install

test:
  script:
    - bundle exec rake spec
```

在此示例中，GitLab 为该作业启动了两个容器：

- 运行命令的 Ruby 容器`script`。
- PostgreSQL 容器。Ruby 容器中的命令`script`可以连接到主机名上的 PostgreSQL 数据库`db-postgrest`。

**相关主题**：

- [的可用设置`services`](https://docs.gitlab.com/ee/ci/services/index.html#available-settings-for-services)。
- [`services`在`.gitlab-ci.yml`文件中定义](https://docs.gitlab.com/ee/ci/services/index.html#define-services-in-the-gitlab-ciyml-file)。
- [在 Docker 容器中运行 CI/CD 作业](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html)。
- [使用 Docker 构建 Docker 镜像](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html)。

#### `service:pull_policy`

版本历史 

运行程序用于获取 Docker 映像的拉取策略。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的[`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 单个拉取策略或阵列中的多个拉取策略。可以是`always`、`if-not-present`、 或`never`。

**示例`service:pull_policy`**：

```
job1:
  script: echo "A single pull policy."
  services:
    - name: postgres:11.6
      pull_policy: if-not-present

job2:
  script: echo "Multiple pull policies."
  services:
    - name: postgres:11.6
      pull_policy: [always, if-not-present]
```

**其他详细信息**：

- 如果运行程序不支持定义的拉取策略，则作业将失败并出现类似以下内容的错误： `ERROR: Job failed (system failure): the configured PullPolicies ([always]) are not allowed by AllowedPullPolicies ([never])`。

**相关主题**：

- [在 Docker 容器中运行 CI/CD 作业](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html)。
- [跑步者拉动政策如何运作](https://docs.gitlab.com/runner/executors/docker.html#how-pull-policies-work)。
- [使用多种拉动策略](https://docs.gitlab.com/runner/executors/docker.html#using-multiple-pull-policies)。

### `stage`

用于`stage`定义作业在 哪个[阶段](https://docs.gitlab.com/ee/ci/yaml/#stages)`stage`运行。同一阶段中的作业可以并行执行（请参阅**其他详细信息**）。

如果`stage`未定义，则作业`test`默认使用该阶段。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：一个字符串，可以是：

- [默认阶段](https://docs.gitlab.com/ee/ci/yaml/#stages)。
- 用户定义的阶段。

**示例`stage`**：

```
stages:
  - build
  - test
  - deploy

job1:
  stage: build
  script:
    - echo "This job compiles code."

job2:
  stage: test
  script:
    - echo "This job tests the compiled code. It runs when the build stage completes."

job3:
  script:
    - echo "This job also runs in the test stage".

job4:
  stage: deploy
  script:
    - echo "This job deploys the code. It runs when the test stage completes."
  environment: production
```

**其他详细信息**：

- 如果作业在不同的运行器上运行，则它们可以并行运行。
- [`concurrent`如果您只有一个运行程序，并且运行程序的设置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-global-section) 大于，则作业可以并行运行 `1`。

#### `stage: .pre`

在 GitLab 12.4 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/31441)

使用该`.pre`阶段使作业在管道的开头运行。`.pre`始终是管道中的第一阶段。用户定义的阶段在 后执行`.pre`。您不必`.pre`在 中定义[`stages`](https://docs.gitlab.com/ee/ci/yaml/#stages)。

如果管道仅包含`.pre`或`.post`阶段中的作业，则它不会运行。不同阶段必须至少有一项其他工作。

**关键字类型**：您只能将其与职位的`stage`关键字一起使用。

**示例`stage: .pre`**：

```
stages:
  - build
  - test

job1:
  stage: build
  script:
    - echo "This job runs in the build stage."

first-job:
  stage: .pre
  script:
    - echo "This job runs in the .pre stage, before all other stages."

job2:
  stage: test
  script:
    - echo "This job runs in the test stage."
```

#### `stage: .post`

在 GitLab 12.4 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/31441)

使用`.post`阶段使作业在管道末端运行。`.post` 始终是管道中的最后阶段。用户定义的阶段在 之前执行`.post`。您不必`.post`在 中定义[`stages`](https://docs.gitlab.com/ee/ci/yaml/#stages)。

如果管道仅包含`.pre`或`.post`阶段中的作业，则它不会运行。不同阶段必须至少有一项其他工作。

**关键字类型**：您只能将其与职位的`stage`关键字一起使用。

**示例`stage: .post`**：

```
stages:
  - build
  - test

job1:
  stage: build
  script:
    - echo "This job runs in the build stage."

last-job:
  stage: .post
  script:
    - echo "This job runs in the .post stage, after all other stages."

job2:
  stage: test
  script:
    - echo "This job runs in the test stage."
```

**额外细节：**

- 如果管道有作业[`needs: [\]`](https://docs.gitlab.com/ee/ci/yaml/#needs)和阶段中的作业`.pre`，则它们将在管道创建后立即启动。作业`needs: []`立即启动，忽略任何阶段配置。

### `tags`

版本历史 

用于`tags`从项目可用的所有运行程序列表中选择特定运行程序。

注册跑步者时，您可以指定跑步者的标签，例如`ruby`、`postgres`、 或`development`。要选择并运行作业，必须为运行者分配作业中列出的每个标签。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：

- 标签名称数组。
- GitLab 14.1 及更高版本[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`tags`**：

```
job:
  tags:
    - ruby
    - postgres
```

在此示例中，只有*同时*具有`ruby`和`postgres`标签的运行程序才能运行作业。

**其他详细信息**：

- 在[GitLab 14.3](https://gitlab.com/gitlab-org/gitlab/-/issues/338479)及更高版本中，标签数量必须小于`50`。

**相关主题**：

- [使用标签来控制跑步者可以运行哪些作业](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#use-tags-to-control-which-jobs-a-runner-can-run)。
- [为每个并行矩阵作业选择不同的运行者标签](https://docs.gitlab.com/ee/ci/jobs/job_control.html#select-different-runner-tags-for-each-parallel-matrix-job)。

### `timeout`

在 GitLab 12.3 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/14887)

用于`timeout`为特定作业配置超时。如果作业运行时间超过超时时间，则作业失败。

作业级别超时可以比[项目级别超时](https://docs.gitlab.com/ee/ci/pipelines/settings.html#set-a-limit-for-how-long-jobs-can-run)更长。但不能长于[跑步者的超时时间](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#set-maximum-job-timeout-for-a-runner)。

**关键字类型**：职位关键字。您只能将其用作作业或部分中的 [`default`一部分](https://docs.gitlab.com/ee/ci/yaml/#default)。

**可能的输入**：用自然语言编写的一段时间。例如，这些都是等效的：

- `3600 seconds`
- `60 minutes`
- `one hour`

**示例`timeout`**：

```
build:
  script: build.sh
  timeout: 3 hours 30 minutes

test:
  script: rspec
  timeout: 3h 30m
```

### `trigger`

用于`trigger`声明作业是“触发作业”，它启动 [下游管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html)，该管道是：

- [多项目管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#multi-project-pipelines)。
- [子管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines)。

触发器作业只能使用一组有限的 GitLab CI/CD 配置关键字。可在触发器作业中使用的关键字有：

- [`allow_failure`](https://docs.gitlab.com/ee/ci/yaml/#allow_failure)。
- [`extends`](https://docs.gitlab.com/ee/ci/yaml/#extends)。
- [`needs`](https://docs.gitlab.com/ee/ci/yaml/#needs)，但不是[`needs:project`](https://docs.gitlab.com/ee/ci/yaml/#needsproject)。
- [`only`和`except`](https://docs.gitlab.com/ee/ci/yaml/#only--except)。
- [`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)。
- [`stage`](https://docs.gitlab.com/ee/ci/yaml/#stage)。
- [`trigger`](https://docs.gitlab.com/ee/ci/yaml/#trigger)。
- [`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables)。
- [`when`](https://docs.gitlab.com/ee/ci/yaml/#when)（仅当值为`on_success`、`on_failure`或 时`always`）。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 对于多项目管道，指向下游项目的路径。[GitLab 15.3 及更高版本支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量 ，但不支持[作业级持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。或者，使用[`trigger:project`](https://docs.gitlab.com/ee/ci/yaml/#triggerproject).
- 对于子管道，请使用[`trigger:include`](https://docs.gitlab.com/ee/ci/yaml/#triggerinclude).

**示例`trigger`**：

```
trigger-multi-project-pipeline:
  trigger: my-group/my-project
```

**其他详细信息**：

- 您[不能使用 API 来启动`when:manual`触发器作业](https://gitlab.com/gitlab-org/gitlab/-/issues/284086)。
- 在[GitLab 13.5 及更高](https://gitlab.com/gitlab-org/gitlab/-/issues/201938)[`when:manual`](https://docs.gitlab.com/ee/ci/yaml/#when)版本中，您可以在与`trigger`. 在 GitLab 13.4 及更早版本中，一起使用它们会导致错误`jobs:#{job-name} when should be on_success, on_failure or always`。
- 在运行手动触发作业之前，您无法[手动指定 CI/CD 变量。](https://docs.gitlab.com/ee/ci/jobs/index.html#specifying-variables-when-running-manual-jobs)
- [默认情况下，手动管道变量](https://docs.gitlab.com/ee/ci/variables/index.html#override-a-defined-cicd-variable) 和[计划管道变量](https://docs.gitlab.com/ee/ci/pipelines/schedules.html#add-a-pipeline-schedule) 不会传递到下游管道。使用[trigger:forward](https://docs.gitlab.com/ee/ci/yaml/#triggerforward) 将这些变量转发到下游管道。
- [作业级持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables) 在触发器作业中不可用。

**相关主题**：

- [多项目管道配置示例](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-downstream-pipeline-from-a-job-in-the-gitlab-ciyml-file)。
- 要为特定分支、标签或提交运行管道，您可以使用[触发令牌](https://docs.gitlab.com/ee/ci/triggers/index.html) 通过[管道触发器 API](https://docs.gitlab.com/ee/api/pipeline_triggers.html)进行身份验证。触发令牌与关键字不同`trigger`。

#### `trigger:include`

用于`trigger:include`声明作业是启动 [子管道的](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines)“触发作业” 。

用于`trigger:include:artifact`触发[动态子管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#dynamic-child-pipelines)。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 子管道配置文件的路径。

**示例`trigger:include`**：

```
trigger-child-pipeline:
  trigger:
    include: path/to/child-pipeline.gitlab-ci.yml
```

**相关主题**：

- [子管道配置示例](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-downstream-pipeline-from-a-job-in-the-gitlab-ciyml-file)。

#### `trigger:project`

用于`trigger:project`声明作业是启动 [多项目管道的](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#multi-project-pipelines)“触发作业” 。

默认情况下，多项目管道会触发默认分支。用于`trigger:branch` 指定不同的分支。

**关键字类型**：职位关键字。您只能将其用作工作的一部分。

**可能的输入**：

- 通往下游项目的路径。[GitLab 15.3 及更高版本支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量 ，但不支持[作业级持久变量](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#persisted-variables)。

**示例`trigger:project`**：

```
trigger-multi-project-pipeline:
  trigger:
    project: my-group/my-project
```

**`trigger:project`不同分支的示例**：

```
trigger-multi-project-pipeline:
  trigger:
    project: my-group/my-project
    branch: development
```

**相关主题**：

- [多项目管道配置示例](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#trigger-a-downstream-pipeline-from-a-job-in-the-gitlab-ciyml-file)。
- 要为特定分支、标签或提交运行管道，您还可以使用[触发令牌](https://docs.gitlab.com/ee/ci/triggers/index.html) 通过[管道触发器 API](https://docs.gitlab.com/ee/api/pipeline_triggers.html)进行身份验证。触发令牌与关键字不同`trigger`。

#### `trigger:strategy`

用于`trigger:strategy`强制`trigger`作业等待下游管道完成后再将其标记为**成功**。

此行为与默认行为不同，默认行为是在创建下游管道后立即`trigger`将作业标记为 **成功。**

此设置使您的管道执行线性而不是并行。

**示例`trigger:strategy`**：

```
trigger_job:
  trigger:
    include: path/to/child-pipeline.yml
    strategy: depend
```

在此示例中，后续阶段的作业在启动之前等待触发的管道成功完成。

**其他详细信息**：

- [下游管道中的可选手动作业](https://docs.gitlab.com/ee/ci/jobs/job_control.html#types-of-manual-jobs)不会影响下游管道或上游触发作业的状态。下游管道无需运行任何可选的手动作业即可成功完成。
- [下游管道中的阻塞手动作业](https://docs.gitlab.com/ee/ci/jobs/job_control.html#types-of-manual-jobs)必须在触发器作业标记为成功或失败之前运行。如果下游管道状态 由于手动作业而**正在等待手动操作**( )，则触发器作业将显示**待处理**( )。默认情况下，后续阶段的作业在触发作业完成后才会启动。
- 如果下游管道有失败的作业，但作业使用[`allow_failure: true`](https://docs.gitlab.com/ee/ci/yaml/#allow_failure)，则下游管道被认为是成功的，并且触发作业显示**success**。

#### `trigger:forward`

版本历史 

用于`trigger:forward`指定转发到下游管道的内容。您可以控制转发到[父子管道](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#parent-child-pipelines) 和[多项目管道的](https://docs.gitlab.com/ee/ci/pipelines/downstream_pipelines.html#multi-project-pipelines)内容。

**可能的输入**：

- `yaml_variables`:（`true`默认），或`false`. 当 时`true`，触发器作业中定义的变量将传递到下游管道。
- `pipeline_variables`:`true`或`false`（默认）。当 时`true`，[手动管道变量](https://docs.gitlab.com/ee/ci/variables/index.html#override-a-defined-cicd-variable)和[计划管道变量](https://docs.gitlab.com/ee/ci/pipelines/schedules.html#add-a-pipeline-schedule) 将传递到下游管道。

**示例`trigger:forward`**：

使用 CI/CD 变量[手动运行此管道](https://docs.gitlab.com/ee/ci/pipelines/index.html#run-a-pipeline-manually)`MYVAR = my value`：

```
variables: # default variables for each job
  VAR: value

# Default behavior:
# - VAR is passed to the child
# - MYVAR is not passed to the child
child1:
  trigger:
    include: .child-pipeline.yml

# Forward pipeline variables:
# - VAR is passed to the child
# - MYVAR is passed to the child
child2:
  trigger:
    include: .child-pipeline.yml
    forward:
      pipeline_variables: true

# Do not forward YAML variables:
# - VAR is not passed to the child
# - MYVAR is not passed to the child
child3:
  trigger:
    include: .child-pipeline.yml
    forward:
      yaml_variables: false
```

### `variables`

用于`variables`定义作业的[CI/CD 变量。](https://docs.gitlab.com/ee/ci/variables/index.html#define-a-cicd-variable-in-the-gitlab-ciyml-file)

**关键字类型**：全局关键字和工作关键字。您可以在全局级别使用它，也可以在工作级别使用它。

如果您定义`variables`为[全局关键字](https://docs.gitlab.com/ee/ci/yaml/#keywords)，它的行为就像所有作业的默认变量。创建管道时，每个变量都会复制到每个作业配置中。如果作业已定义该变量，则[作业级别变量优先](https://docs.gitlab.com/ee/ci/variables/index.html#cicd-variable-precedence)。

在全局级别定义的变量不能用作其他全局关键字（如 ）的输入[`include`](https://docs.gitlab.com/ee/ci/yaml/includes.html#use-variables-with-include)。这些变量只能在作业级别、 、`script`和`before_script`部分中使用`after_script`，以及某些作业关键字（如 ）中的输入[`rules`](https://docs.gitlab.com/ee/ci/jobs/job_control.html#cicd-variable-expressions)。

**可能的输入**：变量名称和值对：

- 该名称只能使用数字、字母和下划线 ( `_`)。在某些 shell 中，第一个字符必须是字母。
- 该值必须是字符串。

[支持](https://docs.gitlab.com/ee/ci/variables/where_variables_can_be_used.html#gitlab-ciyml-file)CI/CD 变量。

**示例`variables`**：

```
variables:
  DEPLOY_SITE: "https://example.com/"

deploy_job:
  stage: deploy
  script:
    - deploy-script --url $DEPLOY_SITE --path "/"
  environment: production

deploy_review_job:
  stage: deploy
  variables:
    REVIEW_PATH: "/review"
  script:
    - deploy-review-script --url $DEPLOY_SITE --path $REVIEW_PATH
  environment: production
```

**其他详细信息**：

- 所有 YAML 定义的变量也设置为任何链接的[Docker 服务容器](https://docs.gitlab.com/ee/ci/services/index.html)。
- YAML 定义的变量适用于非敏感项目配置。将敏感信息存储在[受保护的变量](https://docs.gitlab.com/ee/ci/variables/index.html#protect-a-cicd-variable)或[CI/CD 机密](https://docs.gitlab.com/ee/ci/secrets/index.html)中。
- [默认情况下，手动管道变量](https://docs.gitlab.com/ee/ci/variables/index.html#override-a-defined-cicd-variable) 和[计划管道变量](https://docs.gitlab.com/ee/ci/pipelines/schedules.html#add-a-pipeline-schedule) 不会传递到下游管道。使用[trigger:forward](https://docs.gitlab.com/ee/ci/yaml/#triggerforward) 将这些变量转发到下游管道。

**相关主题**：

- [预定义变量](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)是运行程序自动创建并在作业中可用的变量。
- 您可以[使用变量配置运行器行为](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#configure-runner-behavior-with-variables)。

#### `variables:description`

在 GitLab 13.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/30101)

使用`description`关键字定义管道级（全局）变量的描述。[手动运行管道时，](https://docs.gitlab.com/ee/ci/pipelines/index.html#prefill-variables-in-manual-pipelines)说明会显示预填充的变量名称。

**关键字类型**：全局关键字。您不能将其用于作业级别变量。

**可能的输入**：

- 一根绳子。

**示例`variables:description`**：

```
variables:
  DEPLOY_NOTE:
    description: "The deployment note. Explain the reason for this deployment."
```

**其他详细信息**：

- 当不使用 时`value`，该变量存在于未手动触发的管道中，默认值为空字符串 ( `''`)。

#### `variables:value`

在 GitLab 13.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/issues/30101)

使用`value`关键字定义管道级（全局）变量的值。当与 一起使用时 [`variables: description`](https://docs.gitlab.com/ee/ci/yaml/#variablesdescription)，变量值会[在手动运行管道时预填充](https://docs.gitlab.com/ee/ci/pipelines/index.html#prefill-variables-in-manual-pipelines)。

**关键字类型**：全局关键字。您不能将其用于作业级别变量。

**可能的输入**：

- 一根绳子。

**示例`variables:value`**：

```
variables:
  DEPLOY_ENVIRONMENT:
    value: "staging"
    description: "The deployment target. Change this variable to 'canary' or 'production' if needed."
```

**其他详细信息**：

- 如果不使用[`variables: description`](https://docs.gitlab.com/ee/ci/yaml/#variablesdescription)，则行为与 相同[`variables`](https://docs.gitlab.com/ee/ci/yaml/#variables)。

#### `variables:options`

在 GitLab 15.7 中[引入。](https://gitlab.com/gitlab-org/gitlab/-/merge_requests/105502)

用于定义[手动运行管道时可在 UI 中选择的](https://docs.gitlab.com/ee/ci/pipelines/index.html#configure-a-list-of-selectable-prefilled-variable-values)`variables:options`值数组。

必须与`variables: value`, 以及为 定义的字符串一起使用`value`：

- 也必须是数组中的字符串之一`options`。
- 是默认选择。

如果没有[`description`](https://docs.gitlab.com/ee/ci/yaml/#variablesdescription)，则该关键字无效。

**关键字类型**：全局关键字。您不能将其用于作业级别变量。

**可能的输入**：

- 字符串数组。

**示例`variables:options`**：

```
variables:
  DEPLOY_ENVIRONMENT:
    value: "staging"
    options:
      - "production"
      - "staging"
      - "canary"
    description: "The deployment target. Set to 'staging' by default."
```

#### `variables:expand`

版本历史 

使用`expand`关键字将变量配置为可扩展或不可扩展。

**关键字类型**：全局关键字和工作关键字。您可以在全局级别使用它，也可以在工作级别使用它。

**可能的输入**：

- `true`（默认）：变量是可扩展的。
- `false`: 该变量不可扩展。

**示例`variables:expand`**：

```
variables:
  VAR1: value1
  VAR2: value2 $VAR1
  VAR3:
    value: value3 $VAR1
    expand: false
```

- 的结果`VAR2`是`value2 value1`.
- 的结果`VAR3`是`value3 $VAR1`.

**其他详细信息**：

- 该`expand`关键字只能与全局关键字和作业级`variables`关键字一起使用。您不能将它与[`rules:variables`](https://docs.gitlab.com/ee/ci/yaml/#rulesvariables)或 一起使用[`workflow:rules:variables`](https://docs.gitlab.com/ee/ci/yaml/#workflowrulesvariables)。

### `when`

用于`when`配置作业运行时的条件。如果作业中未定义，则默认值为`when: on_success`。

**关键字类型**：职位关键字。您可以将其用作工作的一部分。`when: always`并且`when: never`也可以用在[`workflow:rules`](https://docs.gitlab.com/ee/ci/yaml/#workflow).

**可能的输入**：

- `on_success`（默认）：仅当早期阶段的作业没有失败或没有`allow_failure: true`.
- `on_failure`：仅当早期阶段至少有一个作业失败时才运行该作业。早期阶段的工作`allow_failure: true`总是被认为是成功的。
- `never`：无论早期阶段的作业状态如何，都不要运行该作业。只能在[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)节或 中使用`workflow: rules`。
- `always`：无论早期阶段的作业状态如何，都运行作业。也可以用在`workflow:rules`.
- `manual`[：仅在手动触发](https://docs.gitlab.com/ee/ci/jobs/job_control.html#create-a-job-that-must-be-run-manually)时运行作业。
- `delayed`：[将作业的执行](https://docs.gitlab.com/ee/ci/jobs/job_control.html#run-a-job-after-a-delay) 延迟指定的时间。

**示例`when`**：

```
stages:
  - build
  - cleanup_build
  - test
  - deploy
  - cleanup

build_job:
  stage: build
  script:
    - make build

cleanup_build_job:
  stage: cleanup_build
  script:
    - cleanup build when failed
  when: on_failure

test_job:
  stage: test
  script:
    - make test

deploy_job:
  stage: deploy
  script:
    - make deploy
  when: manual
  environment: production

cleanup_job:
  stage: cleanup
  script:
    - cleanup after jobs
  when: always
```

在此示例中，脚本：

1. `cleanup_build_job`仅在失败时执行`build_job`。
2. `cleanup_job`无论成功或失败，始终作为管道中的最后一步执行。
3. `deploy_job`当您在 GitLab UI 中手动运行它时执行。

**其他详细信息**：

- 在[GitLab 13.5 及更高](https://gitlab.com/gitlab-org/gitlab/-/issues/201938)`when:manual`版本中，您可以在与[`trigger`](https://docs.gitlab.com/ee/ci/yaml/#trigger). 在 GitLab 13.4 及更早版本中，一起使用它们会导致错误`jobs:#{job-name} when should be on_success, on_failure or always`。
- 的默认行为`allow_failure`更改为`true`with `when: manual`。但是，如果您使用`when: manual`with [`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)，则`allow_failure`默认为`false`。

**相关主题**：

- `when`可与 一起使用[`rules`](https://docs.gitlab.com/ee/ci/yaml/#rules)以实现更动态的作业控制。
- `when`可以与 一起使用[`workflow`](https://docs.gitlab.com/ee/ci/yaml/#workflow)来控制管道何时可以启动。

## 已弃用的关键字

以下关键字已被弃用。

### 全局定义`image`, `services`, `cache`, `before_script`,`after_script`

不推荐在全局范围内定义`image`、`services`、`cache`、`before_script`和 `after_script`。未来版本可能会删除支持。

[`default`](https://docs.gitlab.com/ee/ci/yaml/#default)代替使用。例如：

```
default:
  image: ruby:3.0
  services:
    - docker:dind
  cache:
    paths: [vendor/]
  before_script:
    - bundle config set path vendor/bundle
    - bundle install
  after_script:
    - rm -rf tmp/
```

帮助和反馈

### 文档

[编辑此页面](https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/ci/yaml/index.md) 以修复错误或添加合并请求的改进。
[创建一个问题](https://gitlab.com/gitlab-org/gitlab/-/issues/new?issue[description]=Link the doc and describe what is wrong with it.  %2Flabel ~documentation ~"docs\-comments" &issue[title]=Docs feedback: Write your title) 来建议对此页面的改进。

### 产品

如果您不喜欢此功能，[请创建问题。](https://gitlab.com/gitlab-org/gitlab/-/issues/new?issue[description]=Describe what you would like to see improved.  %2Flabel ~"docs\-comments" &issue[title]=Docs - product feedback: Write your title) 通过提交功能请求来
[提出功能建议。](https://gitlab.com/gitlab-org/gitlab/-/issues/new?issuable_template=Feature proposal - detailed&issue[title]=Docs feedback - feature proposal: Write your title)
[加入 First Look](https://about.gitlab.com/community/gitlab-first-look/) 来帮助塑造新功能。

### 功能可用性和产品试用

[查看定价](https://about.gitlab.com/pricing/) 以查看所有 GitLab 级别和功能，或进行升级。
[免费试用 GitLab](https://about.gitlab.com/free-trial/) 
