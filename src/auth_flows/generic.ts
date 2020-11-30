import { AuthCallback } from "isomorphic-git";
import { Config, AuthFlow } from "../config";
import { Secrets } from "../secrets";

export function makeAuthCallback(config: Config, secrets: Secrets): AuthCallback {
    switch (config.authFlow) {
        case AuthFlow.PasswordFlow:
            return () => {
                if (secrets.passwordFlowOptions === undefined) {
                    throw "passwordFlowOptions need to be set in order to use the password flow.";
                }
                return {
                    username: secrets.passwordFlowOptions.username,
                    password: secrets.passwordFlowOptions.password
                };
            };
        case AuthFlow.PATFlow:
            return () => {
                if (secrets.patFlowOptions === undefined) {
                    throw "patFlowOptions need to be set in order to use the PAT flow.";
                }
                if (secrets.patFlowOptions.username === undefined) {
                    throw `The generic git provider ${config.provider} requires a username to be set when using the PAT flow.`;
                }
                return {
                    username: secrets.patFlowOptions.username,
                    password: secrets.patFlowOptions.token
                };
            }
        default:
            throw "Invalid authFlow in config.";
    }
}