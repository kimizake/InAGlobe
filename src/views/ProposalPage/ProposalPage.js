import React, { Component } from "react"
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'

import { withStyles, Link } from "@material-ui/core"
import { School } from '@material-ui/icons'

import config from "../../config"

import styles from "../../assets/jss/views/proposalPageStyle"
import 'react-vertical-timeline-component/style.min.css'

class ProposalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.data.title,
            organisation: props.data.organisation,
            images: props.data.images,
            documents: props.data.documents,
            status: props.data.status,
            detailedDescription: props.data.detailedDescription,
            location: props.data.location,
            checkpoints: props.data.checkpoints,
        }
    }

    componentWillReceiveProps () {

        this.setState({
            title: this.props.data.title,
            organisation: this.props.data.organisation,
            images: this.props.data.images,
            status: this.props.data.status,
            detailedDescription: this.props.data.detailedDescription,
            documents: this.props.data.documents,
            location: this.props.data.location,
            checkpoints: this.props.data.checkpoints,
        });

    }

    render() {
        const {classes, data, children, isPreview} = this.props

        console.log("Rendering proposal page");
        console.log(this.props);
        console.log(this.state);

        return (
            <div>
                <div className={classes.container}>
                    <h1>{this.state.title}</h1>
                </div>
                <div className={classes.container}>
                    <h2>{this.state.organisation}</h2>
                </div>
                {this.state.images.map(image => (
                    <div className={classes.imagesContainer}>
                        <img
                            alt={this.state.title}
                            src={isPreview ? URL.createObjectURL(image) : config.s3Bucket + image}
                            className={classes.projectImages}
                        />
                    </div>
                ))}
                <div className={classes.container}>
                    <h3>{this.state.status}</h3>
                </div>
                <div className={classes.container}>
                    <h4>{this.state.location}</h4>
                </div>
                <div className={classes.container}>
                    <h5>{this.state.detailedDescription}</h5>
                </div>
                <div className={classes.container}>
                    {this.state.documents.map(doc => (
                        <Link href={isPreview ? URL.createObjectURL(doc) : config.s3Bucket + doc}>
                            {isPreview ? doc["name"] : /[^/]*$/.exec(doc)[0]}{"\n"}
                        </Link>
                    ))}
                </div>
                <VerticalTimeline>
                    {this.state.checkpoints ? this.state.checkpoints.map(event => (
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            iconStyle={{background: 'rgb(33, 150, 243)', color: '#fff'}}
                            date={event.date.substring(0,16)}
                            icon={<School />}
                        >
                            <h3 className="vertical-timeline-element-title">{event.title}</h3>
                            <h4 className="vertical-timeline-element-subtitle">{event.subtitle}</h4>
                            <p>{event.text}</p>
                            <p>{event.documents.map(doc => (
                                <a href={config.s3Bucket + doc}> {/[^/]*$/.exec(doc)[0]} {"\n"}</a>
                            ))}
                            </p>
                            <p>{event.images.map(doc => (
                                <a href={config.s3Bucket + doc}> {/[^/]*$/.exec(doc)[0]} {"\n"}</a>
                            ))}
                            </p>
                        </VerticalTimelineElement>
                    )) : null}
                </VerticalTimeline>

                {children}

            </div>

        )
    }
}

export default withStyles(styles)(ProposalPage)