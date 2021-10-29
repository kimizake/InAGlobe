import config from "../config";

export const checkpointService = {
    postCheckpoint
};

function postCheckpoint(projectId, data) {
    var token = JSON.parse(localStorage.getItem('user')).token;
    var bearer = 'Bearer ' + token;
    return fetch(config.apiUrl + `/checkpoint/${projectId}/`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

}
