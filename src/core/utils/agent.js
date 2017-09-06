
export let defaultHttpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 5
});

export let defaultHttpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 5
});