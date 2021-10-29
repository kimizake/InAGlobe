import React, { Component } from "react"
import ScrollMenu from "react-horizontal-scrolling-menu"

import { 
    withStyles, 
    Card, 
    CardContent,
    CardActionArea, 
    CardMedia,
    Grid,
    IconButton,
    Hidden,
    Typography
} from "@material-ui/core"

import { 
    ArrowBackIos, 
    ArrowForwardIos
} from "@material-ui/icons"

import styles from "../../assets/jss/components/cardScrollViewStyle"
import config from "../../config";
import {GAEvent} from "../Tracking/Tracking";


class CardScrollView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: window.innerWidth
        }
        this.list = null
    }

    goToProposalPage = (card) => {
        console.log(`Card ${card.id} clicked!`);
        const dataValue = JSON.stringify(card);
        GAEvent("Dashboard", "Card Clicked", dataValue.id + "|" + dataValue.title);
        localStorage.setItem(`proposalPage/${card.id}`, dataValue)
        this.props.history.push(`/main/projectlist/proposalpage/${card.id}`)
    }

    updateDimensions = () => {
        this.setState({ 
            width: window.innerWidth
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        if (this.list) this.list.scrollTo(0)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    render() {
        const { classes, cardData, title, EmptyIcon, emptyText } = this.props
        
        const cardsList = (
            cardData.map((card, key) => (
                <Card key={key} className={classes.card}>
                    <CardActionArea onClick={() => this.goToProposalPage(card)} className={classes.cardActionArea}>
                        <Grid container justify="left" spacing={0} className={classes.cardActionArea}>
                            <Grid item xs={4}>
                                <CardMedia
                                    component="img"
                                    alt={card.title}
                                    image={config.s3Bucket + card.images[0]}
                                    className={classes.cardMedia}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <CardContent>
                                    <h5 className={classes.cardLabel}>{card.title}</h5>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Card>
            ))
        )

        const arrowLeft = (
            <IconButton aria-label="scroll-left">
                <ArrowBackIos fontSize="small"/>
            </IconButton>
        )

        const arrowRight = (
            <IconButton aria-label="scroll-right">
                <ArrowForwardIos fontSize="small"/>
            </IconButton>
        )

        const scrollMenu = (
            <ScrollMenu 
                ref={element => (this.list = element)}
                data={cardsList}
                arrowLeft={arrowLeft}
                arrowRight={arrowRight}
                hideArrows={true}
                hideSingleArrow={true}
                alignOnResize={true}
                scrollToSelected={true}
                transition={0.6}
                innerWrapperStyle={{
                    marginTop: "0", 
                    marginBottom: "10px"
                }}
            />
        )

        return (
            <>
                <h3 className={classes.title}>{title}</h3>
                {cardsList.length === 0
                ?
                    <div className={classes.emptyComponentDiv}>
                        <div className={classes.emptyComponentIcon}>
                            <EmptyIcon fontSize="large" className={classes.colouring}/>
                        </div>
                        <div className={classes.emptyComponentText}>
                            <Typography component="h3" variant="h5" className={classes.colouring}>{emptyText}</Typography>
                        </div>
                    </div>
                :
                    <>
                        <Hidden xsDown implementation="css">
                            <div style={{ width: `calc(${this.state.width}px - 320px)` }}>
                                {scrollMenu}
                            </div>
                        </Hidden>
                        <Hidden smUp implementation="css">
                            <div style={{ width: `calc(${this.state.width}px - 30px)` }}>
                                {scrollMenu}
                            </div>
                        </Hidden>
                    </>
                }
            </>
        )
    }
}

export default withStyles(styles)(CardScrollView)