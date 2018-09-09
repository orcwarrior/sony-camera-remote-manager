const utils = {
    wait: (ms) => new Promise(r => setTimeout(_ => r(ms),ms)),
};

export default utils