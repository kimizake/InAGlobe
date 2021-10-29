import React, { Component } from "react"
import PerfectScrollbar from 'react-perfect-scrollbar'

import { 
    withStyles, 
    Card,
    List,
    ListSubheader,
    Typography,
} from "@material-ui/core"

import styles from "../../assets/jss/components/cardsListStyle"
import 'react-perfect-scrollbar/dist/css/styles.css'

class CardsList extends Component {

    render() {
        const { classes, title, cardData, contentStruct, EmptyIcon, emptyText, groupBy } = this.props

        var cardsList = []
        if (groupBy) {
            const projectIds = [...new Set(cardData.map(item => item[groupBy]))]
            
            projectIds.forEach(projectId => {
                const filteredCards = cardData.filter(card => card.projectId === projectId)

                cardsList.push(
                    <ListSubheader disableSticky={true}>
                        {`${filteredCards[0].projectName} (ID: ${projectId})`}
                    </ListSubheader>
                )

                cardsList = cardsList.concat(filteredCards.map((card, key) => (
                    <Card key={key} className={classes.card}>
                        {contentStruct(card)}
                    </Card>
                )))
            })
        } else {
            cardsList = cardData.map((card, key) => (
                <Card key={key} className={classes.card}>
                    {contentStruct(card)}
                </Card>
            ))
        }

        return (
            <div>
                <h3 className={classes.subtitle}>{title}</h3>
                <PerfectScrollbar component="div" className={classes.scrollbar}>
                    <List>
                        {cardData.length === 0 
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
                                {cardsList}
                            </>
                        }
                    </List>
                </PerfectScrollbar>
            </div>
        )
    }
}

export default withStyles(styles)(CardsList)