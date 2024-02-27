# Defender SDK Actions Client

The OpenZeppelin Defender provides a security operations (SecOps) platform for Ethereum with built-in best practices. Development teams implement Defender to ship faster and minimize security risks.

This library provides methods related to actions. See Examples for usage.

## Defender Actions CLI tool

In addition to the SDK APIs for managing actions, we provide a CLI tool for running, updating (code) and tail action executions logs.

### Setup

1. Install actions package globally:

`npm install -g @openzeppelin/defender-sdk-action-client`

2. Export environment variables:

```sh
# Defender API key and secret
$ export API_KEY=
$ export API_SECRET=
```

### Usage

#### Run action

```sh
$ defender-action execute-run $ACTION_ID
```

#### Update action code

```sh
$ defender-action update-code $ACTION_ID $PATH
```

#### Tail action run logs

```sh
$ defender-action tail-runs $ACTION_ID
```
