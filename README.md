# Shop-Apotheke Coding Challenge
Task: [here](challenge.pdf)

# Solution
* I have created a REST API to parse data from GitHub API;
* In order to improve flexibility, two versions of the GitHub API can be used:
    * REST API v3
    * GraphQL API
* A swagger documentation is also available;
* I have decided to use [NestJS](https://github.com/nestjs/nest), as it includes several features to help with the development.

# Environment Variables
| Name               | Description                                                                | Default                  |
| ------------------ | -------------------------------------------------------------------------- | ------------------------ |
| GITHUB_API         | GitHub API base URL                                                        | `https://api.github.com` |
| GITHUB_API_VERSION | GitHub API Version to be used. You can choose between `GRAPHQL` or `REST`. | REST                     |
| GITHUB_TOKEN       | Token to authenticate with the GraphQL API                                 |                          |

# GraphQL API
GitHub GraphQL has some advantages in relation to the REST API. As GraphQL only returns the information 
that is required in the request, the response is way smaller than the REST API. The only downside is: GraphQL API is 
not public. A token has to be generated your GitHub account in order to give access to the API.
In order to use the GraphQL integration, you have to set `GITHUB_API_VERSION` to `GRAPHQL` and set a token in 
the `GITHUB_TOKEN` variable. If one of these conditions are not valid, the `REST` api will be used instead.

## How to create a Authentication token
* Go to Settings > Developer Settings > Personal access tokens ([here](https://github.com/settings/tokens))
* Click on **Generate new token** button
* Choose a name for the token and press **Generate token**. There's no need to give any special access to it

# Additional Links
* GitHub REST API documenation: https://developer.github.com/v3/
* GitHub GraphQL API documentation: https://developer.github.com/v4/