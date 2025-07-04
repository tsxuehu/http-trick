import forge from "node-forge";

export interface IRootSecurityContext {
    certPem: string
    keyPem: string
    key: forge.pki.rsa.PrivateKey
    cert: forge.pki.Certificate
}
export interface IHostSecurityContext {
    keyPem: string
    certPem: string
}