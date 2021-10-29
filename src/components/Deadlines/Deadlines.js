import React, { Component, Fragment } from "react"

import { 
    withStyles,
    CardMedia,
    CardContent,
    CardActionArea,
    Grid,
    Typography,
} from "@material-ui/core"
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'

import CardsList from "../CardsList/CardsList"
import timeDiff from "../../helpers/DynamicTimeDiff"

import styles from "../../assets/jss/components/deadlinesStyle"

class Deadlines extends Component {

    deadlineMoreInfo = (id) => {
        console.log(`The notfication id is ${id}`)
    }

    render() {
        const { classes, title, deadlineList } = this.props
        const contentStruct = (card) => {
            return (
                <CardActionArea onClick={ () => this.deadlineMoreInfo(card.notifyId) } className={classes.cardActionArea}>
                    <Grid container justify="left" spacing={0} className={classes.cardActionArea}>
                        <Grid item xs={3}>
                            <CardMedia
                                component="img"
                                alt={card.organisationName}
                                image={card.organisationLogo}
                                className={classes.cardMedia}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <CardContent>
                                <Fragment className={classes.cardLabel}>
                                    <Typography component="h5" className={classes.title}>
                                        <b>
                                            {card.event}
                                        </b>
                                    </Typography>
                                    <Typography component="span" variant="body2" className={classes.timeDiff}>
                                        <b>
                                            {timeDiff(new Date(), new Date(card.dueDate), true)}
                                        </b>
                                    </Typography>
                                    <br/>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {card.projectName}
                                    </Typography>
                                </Fragment>
                            </CardContent>
                        </Grid>
                    </Grid>
                </CardActionArea>
            )
        }

        return (
            <CardsList 
                title={title} 
                cardData={deadlineList} 
                contentStruct={contentStruct}
                EmptyIcon={EmojiEmotionsIcon}
                emptyText="No Upcoming Deadlines!"
            />
        )
    }
}

export default withStyles(styles)(Deadlines)