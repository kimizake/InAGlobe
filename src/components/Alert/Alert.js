import {userService} from "../../services/userService";

import {Warning} from "@material-ui/icons"
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";


class Alert {
    render() {
        return(
        //<Tooltip title="Incomplete user profile!">
        <Warning/>
        // </Tooltip>
        )
    }
}

