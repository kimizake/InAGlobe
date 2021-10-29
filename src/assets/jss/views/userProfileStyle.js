const styles = {
    centering: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: "20px"
    },
    leftAlign: { 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "left", 
        marginBottom: "20px", 
        marginLeft: "20px"
    },
    rightAlign: { 
        direction: "rtl",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "right", 
        marginBottom: "20px", 
        marginLeft: "20px"
    },
    mapsLinkIcon: {
        marginLeft: "10px"
    },
    albumDiv: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        // overflow: "hidden",
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    scrollViewImage: {
        width: "300px", 
        height: "200px", 
        marginRight: "20px"
    },
    editProfile: {
        color: "grey",
        marginRight: "20px"
    },
    avatar: {
        height: "250px", 
        width: "250px"
    }

}

export default styles