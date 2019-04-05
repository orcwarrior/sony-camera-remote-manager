import {apiUrl} from "./config"

const storageAPI = {
    _call: (method, params = []) => {
        console.log("Called call:", method, params);
        const finalParams = Array.isArray(params) ? params : [params];
        return fetch(`${apiUrl}/call`,
            fetchPostConfig({method, params: finalParams}))
            .then(handleResponse)
    },
};

class storageAPI {
        constructor() {
            this.
        }
}