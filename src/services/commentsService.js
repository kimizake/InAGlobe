import config from '../config'

// const apiUrl = 'http://localhost:5000'
// const apiUrl = 'https://inaglobe-api.herokuapp.com'

export const commentsService = {
    getComments, postComment, deleteComment
}

function getComments(projectId) {
    var token = JSON.parse(localStorage.getItem('user')).token
    var bearer = 'Bearer ' + token
    const requestOptions = {
        mode: 'cors',
        method: 'GET',
        headers: {
            'Authorization': bearer,
        },
    }

    return fetch(config.apiUrl + '/comments/' + projectId.toString() + '/', requestOptions)
}

function postComment(projectId, commentText) {
    var token = JSON.parse(localStorage.getItem('user')).token
    var bearer = 'Bearer ' + token
    return fetch(config.apiUrl + `/comments/${projectId}/`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({text: commentText})
    })

}

function deleteComment(commentId) {
    const token = JSON.parse(localStorage.getItem('user')).token
    const bearer = 'Bearer ' + token
    return fetch(config.apiUrl + `/comments/${commentId}/`, {
        mode: 'cors',
        method: 'DELETE',
        headers: {
            'Authorization': bearer,
            'Content-type': 'application/json'
        }
    })

}
