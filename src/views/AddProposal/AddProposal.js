// Main ReactJS libraries
import React, {Component} from 'react'
import {FilePond, registerPlugin} from "react-filepond"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"

// Material UI libraries
import {
    withStyles,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton
} from "@material-ui/core"
import {Close} from '@material-ui/icons'

// Imports of different components in project
import CustomInput from '../../components/CustomInput/CustomInput'
import ProposalPreviewPage from '../ProposalPage/ProposalPreviewPage'
import RegularButton from "../../components/CustomButtons/RegularButton"
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'

// Importing the helper functions from other files
import upload from "../../s3"
import {generateId} from "../../helpers/utils"
import {projectService} from "../../services/projectsService"
import cloneDeep from "lodash.clonedeep"

// Importing class's stylesheet
import styles from "../../assets/jss/views/addProposalStyle"
import "filepond/dist/filepond.min.css"
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import {GAEvent} from "../../components/Tracking/Tracking";


class AddProposal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {
                // No point in id
                // id: "",
                title: "",
                shortDescription: "",
                detailedDescription: "",
                location: "",
                // don't need this either, its assigned on the backend
                // projectOwner: "",
                // Fill these in properly later
                organisationName: "dummy",
                organisationLogo: "dummy",
                // status is not approved by default so we don't need it
                // status: "",
            },
            documents: [],
            images: [],
            previewOpen: false,
            submissionOpen: false,
            submissionResult: "",
            submitting: false,
        }
        registerPlugin(FilePondPluginImagePreview)
        registerPlugin(FilePondPluginFileValidateType)
    }

    checkIfNotEmpty = () => {
        return Object.values(this.state.data).every(e => e.length !== 0);
        //return true;
    };

    handleFormChange = (event) => {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.id]: event.target.value
            }
        })
    }

    post = () => {
        if (this.checkIfNotEmpty()) {
            const id = generateId()
            const modifiedData = cloneDeep(this.state.data)
            modifiedData.documents = upload(this.state.documents, id + '/Documents')
            modifiedData.images = upload(this.state.images, id + '/Images')
            console.log(modifiedData)
            projectService.postProject(modifiedData)
                .then(response => {
                    console.log(response)
                    this.setState({
                        submitting: false,
                        submissionResult: "Submission Successful"
                    })
                }).catch(err => {
                console.log(err)
            })
        } else {
            this.setState({
                submitting: false,
                submissionResult: "Please fill in all the entries provided."
            })
        }
    }

    render() {
        const {classes} = this.props
        return (
            <div>
                <ResponsiveDrawer name={"Add Proposal"}>
                    <Grid container>
                        <Grid item xs={12}>
                            <CustomInput
                                id="title"
                                labelText="Project Title"
                                inputProps={{
                                    onChange: this.handleFormChange,
                                    required: "true"
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomInput
                                id="organisation"
                                labelText="Name of Organisation"
                                inputProps={{
                                    onChange: this.handleFormChange,
                                    required: "true"
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomInput
                                id="location"
                                labelText="Location"
                                inputProps={{
                                    onChange: this.handleFormChange,
                                    required: "true"
                                }}
                                formControlProps={{
                                    fullWidth: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomInput
                                id="shortDescription"
                                labelText="Short Description"
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    rows: 4,
                                    rowsMax: 6,
                                    onChange: this.handleFormChange,
                                    required: "true"
                                }}
                                extraLines={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomInput
                                id="detailedDescription"
                                labelText="Detailed Description"
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    rows: 6,
                                    rowsMax: 12,
                                    onChange: this.handleFormChange,
                                    required: "true"
                                }}
                                placeholder="Detailed Description"
                                extraLines={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FilePond
                                allowMultiple={true}
                                files={this.state.images}
                                labelIdle='Drag & Drop your images (.jpg, .png. or .bmp) or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={["image/*"]}
                                onupdatefiles={pictureItems => this.setState({
                                    images: pictureItems.map(pictureItem => pictureItem.file)
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FilePond
                                allowMultiple={true}
                                files={this.state.documents}
                                labelIdle='Drag & Drop your documents (.pdf, .docx, .doc, .txt and .odt) or <span class="filepond--label-action">Browse</span>'
                                acceptedFileTypes={[
                                    "application/msword",
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    "application/pdf",
                                    "text/plain",
                                    "application/vnd.oasis.opendocument.text"
                                ]}
                                onupdatefiles={fileItems => this.setState({
                                    documents: fileItems.map(fileItem => fileItem.file)
                                })}
                            />
                        </Grid>
                        <div className={classes.cardButtonDiv}>
                            <RegularButton
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        previewOpen: true
                                    });
                                    GAEvent("Add Proposal", "Preview Clicked", "");
                                }}
                                className={classes.previewButton}
                            >
                                Preview
                            </RegularButton>
                            <RegularButton
                                color="primary"
                                onClick={() => {
                                    this.setState({
                                        submitting: true,
                                        submissionOpen: true
                                    })
                                    GAEvent("Add Proposal", "Post Clicked", "");
                                    this.post()
                                }}
                                className={classes.submitButton}
                            >
                                Submit
                            </RegularButton>
                        </div>
                    </Grid>
                </ResponsiveDrawer>

                <Dialog
                    fullWidth={true}
                    maxWidth="lg"
                    open={this.state.previewOpen}
                    onClose={() => this.setState({
                        previewOpen: false
                    })}
                    aria-labelledby="previewDialogTitle"
                    aria-describedby="previewDialogDes">
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <DialogTitle id="previewDialogTitle">
                                        Project Preview
                                    </DialogTitle>
                                </Grid>
                                <Grid item xs={2} className={classes.rightAlign}>
                                    <IconButton
                                        onClick={() => {
                                            this.setState({
                                                previewOpen: false
                                            });


                                        }}
                                    >
                                        <Close fontSize="medium"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <DialogContent>
                                {this.checkIfNotEmpty()
                                    ?
                                    <ProposalPreviewPage data={this.state.data}/>
                                    :
                                    <DialogContentText
                                        id="previewDialogDes"
                                        className={classes.centering}
                                    >
                                        Please fill in all the entries provided before previewing.
                                    </DialogContentText>
                                }
                            </DialogContent>
                        </Grid>
                    </Grid>
                </Dialog>

                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={this.state.submissionOpen}
                    onClose={() => this.setState({
                        submissionOpen: false
                    })}
                    aria-labelledby="submissionDialogTitle"
                    aria-describedby="submissionDialogDes"
                >
                    <DialogTitle id="submissionDialogTitle">
                        Submission Result
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="submissionDialogDes" className={classes.centering}>
                            {this.state.submitting ? <CircularProgress/> : this.state.submissionResult}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <RegularButton
                            color="primary"
                            onClick={() => this.setState({
                                submissionOpen: false
                            })}
                            className={classes.closeButton}>
                            Close
                        </RegularButton>
                        <RegularButton
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    submissionOpen: false
                                })
                                projectService.getProjects().then(data => {
                                    data.projects.forEach(project =>
                                        project.status = (project.status === 0 ? "Needs Approval" : "Approved")
                                    );
                                    localStorage.setItem("projects", JSON.stringify(data));
                                    this.props.history.push("/main/projectlist")
                                })
                            }}
                            className={classes.okButton}
                        >
                            Ok
                        </RegularButton>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

export default withStyles(styles)(AddProposal)