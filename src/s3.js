import AWS from 'aws-sdk'
import { lookup } from "mime-types"
import config from "./config"

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
})

function upload(files, dir) {
    const links = []

    files.forEach(file => {
        console.log(file)
        console.log(typeof file)
        if (typeof file !== typeof "") {
            const name = dir + '/' + file.name
            const params = {
                Bucket: process.env.REACT_APP_BUCKET,
                Key: name,
                Body: file
            }

            links.push(name)

            s3.upload(params, (err, data) => {
                if (err) throw err
                console.log(`File uploaded successfully: ${data.Location}`)
            })
        }

    })

    return links
} 

function download(dirs, isImage) {
    // const param = {
    //     Bucket: process.env.REACT_APP_BUCKET,
    //     Key : dir
    // }
    const files = []

    dirs.forEach(dir => {
        const splitDir = dir.split("/")
        const fileName = splitDir[splitDir.length - 1]
        console.log(fileName)
        console.log(lookup(fileName))

        fetch(config.s3Bucket + "/" + dir)
            .then(res => res.blob())
            .then(data => {
                if (isImage) {
                    let image = new Image([data])
                    files.push(image)
                } else {
                    files.push(new File([data], fileName, { type: lookup(fileName) }))
                }
            })
            .catch(console.log)
    })

    // return s3.getObject(param, (err, data) => {
    //     if (err) throw err
    //     console.log(data)
    //     let file  = new File(data.Body, fileName, { type: lookup(fileName) })
    //     console.log(file)
    //     return file
    // })

    return files
}


export { upload, download }
export default upload

/*
**
* {
*   Response: {
*     bucket: "your-bucket-name",
*     key: "photos/image.jpg",
*     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
*   }
* }
*/
