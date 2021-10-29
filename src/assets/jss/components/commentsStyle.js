const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    commentsPostDiv: {
        width: "100%",
        textAlign: "center"
    },
    commentsPostText: {
        width: "80%",
        marginBottom: "20px"
    },
    commentsPostButton: {
        width: "10%",
        maxWidth: "100px",
        marginLeft: "2%",
        marginTop: "15px",
        paddingTop: "20px",
        paddingBottom: "20px"
    },
    buttonsDivider: {
        width: "5px",
        height: "auto",
        display: "inline"
    }
})

export default styles