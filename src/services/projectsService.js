import config from "../config"

function getProjects() {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;

    return fetch(`${config.apiUrl}/projects/`, {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Authorization': bearer
        }
    }).then(res => res.json())
}

function postProject(data) {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;
    return fetch(`${config.apiUrl}/projects/`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

function deleteProject(projectId) {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;
    return fetch(config.apiUrl + `/projects/${projectId}/`, {
        mode: 'cors',
        method: 'DELETE',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        }
    })

}

function updateProject(projectId, data) {
    console.log(data);
    const token = JSON.parse(localStorage.getItem('user')).token;
    const bearer = 'Bearer ' + token;
    return fetch(config.apiUrl + `/projects/${projectId}/`, {
        mode: 'cors',
        method: 'PATCH',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}



export const projectService = {
    getProjects, postProject, deleteProject, updateProject
};
