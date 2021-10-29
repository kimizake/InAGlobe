const styles = {
    cardDiv: {
        marginTop: "10px",
        marginBottom: "10px"
    },
    cardImgTop: {
        width: "100%",
        height: "180px",
        borderTopLeftRadius: "calc(.25rem - 1px)",
        borderTopRightRadius: "calc(.25rem - 1px)",
        display: "block", 
        objectFit: "cover"
    },
    cardImgBottom: {
        width: "100%",
        borderBottomRightRadius: "calc(.25rem - 1px)",
        borderBottomLeftRadius: "calc(.25rem - 1px)"
    },
    cardImgOverlay: {
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        padding: "1.25rem"
    },
    cardImg: {
        width: "100%",
        borderRadius: "calc(.25rem - 1px)"
    },
    learnMoreButton: {
        width: "25%",
        marginRight: "10px",
        marginLeft:"10px",
        minWidth: "100px",
        maxWidth: "200px"
    },
    selectProposalButton: {
        width: "auto",
        minWidth: "40%"
    },
    buttonDiv: {
        width: "100%",
        textAlign: "center" 
    },
    cardAction: {
        display: 'block',
        textAlign: 'initial',
        width: '100%',
        height: '100%',
        fontSize: '110%'
    }
}

export default styles