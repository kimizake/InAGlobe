import React, { Component } from "react"

import { withStyles, Avatar, Grid, Typography } from "@material-ui/core"

import ResponsiveDrawer from "../../components/ResponsiveDrawer/ResponsiveDrawer"

import styles from "../../assets/jss/views/aboutStyle"
import logo from "../../assets/img/logo.png"

class About extends Component {

    render() {
        const { classes } = this.props
        return (
            <ResponsiveDrawer name="About">
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Avatar
                            alt="Profile Picture"
                            src={logo}
                            className={classes.logo}
                        />
                        <Typography component="h3" variant="h2" style={{ paddingLeft: "20px" }}>
                            <b> InAGlobe Education </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography component="h5" variant="h6" style={{ marginLeft: "5%", marginRight: "5%", paddingBottom: "50px" }}>
                            InAGlobe Education is a partnership building social enterprise. By facilitating partnerships between 
                            humanitarians and academics, we seek to tackle the effects of scarcity and poverty in developing 
                            countries with technological innovation and in turn help educate engineering students about the 
                            most important global challenges.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Typography component="h4" variant="h3">
                            <b> Our Mission </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className={classes.centering}>
                        <figure>
                            <img
                                alt="Education"
                                src="https://images.squarespace-cdn.com/content/v1/5a8867012278e78aeff88690/1537107737233-AXM62UGZZPB6UQYWW6JS/ke17ZwdGBToddI8pDm48kNiEM88mrzHRsd1mQ3bxVct7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0topjEaZcWjtmMYdCWL4dkGbxs35J-ZjFa9s1e3LsxrX8g4qcOj2k2AL08mW_Htcgg/INAGLOBEloguis-14.png?format=1000w"
                                style={{ width: "100%", height: "100%", maxWidth: "400px", maxHeight: "400px" }}
                            />
                            <figcaption>
                                <Typography component="h5" variant="h5" className={classes.centering}>
                                    <b>Education</b>
                                </Typography>
                                <br />
                                <Typography component="h5" variant="h6" className={classes.centering}>
                                    Educate about the importance of innovation in human development.
                                </Typography>
                            </figcaption>
                        </figure>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className={classes.centering}>
                        <figure>
                            <img
                                alt="Growth"
                                src="https://images.squarespace-cdn.com/content/v1/5a8867012278e78aeff88690/1537107856037-UIU7O87G761KD3PLNG64/ke17ZwdGBToddI8pDm48kNiEM88mrzHRsd1mQ3bxVct7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0topjEaZcWjtmMYdCWL4dkGbxs35J-ZjFa9s1e3LsxrX8g4qcOj2k2AL08mW_Htcgg/INAGLOBEloguis-13.png?format=1000w"
                                style={{ width: "100%", height: "100%", maxWidth: "400px", maxHeight: "400px" }}
                            />
                            <figcaption>
                                <Typography component="h5" variant="h5" className={classes.centering}>
                                    <b>Growth</b>
                                </Typography>
                                <br />
                                <Typography component="h5" variant="h6" className={classes.centering}>
                                    Improve the livelihood of those in need through innovation.
                                </Typography>
                            </figcaption>
                        </figure>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} className={classes.centering}>
                        <figure>
                            <img
                                alt="Sustainability"
                                src="https://images.squarespace-cdn.com/content/v1/5a8867012278e78aeff88690/1537107871973-CZHCQ8AMDM5HN7IHHEK7/ke17ZwdGBToddI8pDm48kNiEM88mrzHRsd1mQ3bxVct7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0topjEaZcWjtmMYdCWL4dkGbxs35J-ZjFa9s1e3LsxrX8g4qcOj2k2AL08mW_Htcgg/INAGLOBEloguis-15.png?format=1000w"
                                style={{ width: "100%", height: "100%", maxWidth: "400px", maxHeight: "400px" }}
                            />
                            <figcaption>
                                <Typography component="h5" variant="h5" className={classes.centering}>
                                    <b>Sustainability</b>
                                </Typography>
                                <br />
                                <Typography component="h5" variant="h6" className={classes.centering}>
                                    Promote energetic, environmental and economic sustainability.
                                </Typography>
                            </figcaption>
                        </figure>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Typography component="h4" variant="h3">
                            <b> Our Model </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <img 
                            alt="Our Model"
                            src="https://images.squarespace-cdn.com/content/v1/5a8867012278e78aeff88690/1537109446526-OX7RR8GJXOCBBK2G3ZDJ/ke17ZwdGBToddI8pDm48kLHbMC3rV78LIK1J0TjB7FR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0i3EvU4t4qBXvqGDXWGZvhPMcuCkgzSq9kPNfpt4N7nCli5vrxmLWWIKvIlmOd4jnw/Model_Schematic.png?format=2500w"
                            style={{ width: "80%", height: "80%" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography component="h5" variant="h6" style={{ marginLeft: "5%", marginRight: "5%", paddingBottom: "50px" }}>
                            InAGlobe connects humanitarian partners working on the ground with either an idea or a problem with 
                            academia, where technological development can be undertaken. By having problem-centered and user-centred 
                            approaches to the design, we aim to facilitate the development of technologies that will be systemic solutions.

                            We seek to promote humanitarian engineering across the academic curriculum so that university students 
                            can become involved in problem-solving challenges of human development, humanitarian aid and sustainability.

                            By involving academia, humanitarian organisations can be involved in disruptive innovation, without 
                            shouldering the risk involved.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Typography component="h4" variant="h3">
                            <b> The Team </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <img 
                            alt="The Team"
                            src="https://images.squarespace-cdn.com/content/v1/5a8867012278e78aeff88690/1537110517149-NURXJVC310GOJIX7BUVG/ke17ZwdGBToddI8pDm48kEP4h9jdiv4fy7OjyiNEVeVZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxHkMWh01y9H6cmjsRa40o4plkuOdw5AaSn4Q34gbMV2pu2U3Z7jCEYAYRhT0FLNsw/img_2056+copy.jpg?format=1500w"
                            style={{ width: "100%", height: "100%", maxWidth: "600px", maxHeight: "400px" }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography component="h5" variant="h6" style={{ marginLeft: "20%", marginRight: "20%", paddingBottom: "50px" }}>
                            InAGlobe Education was founded by three Imperial College students in May 2017. 
                            In addition to the founders, a team of volunteers have been ever so important 
                            for the creation of the non-profit.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "30px" }}>
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            <b>Jaime Aguilera Garcia</b>
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            CEO
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h6" className={classes.centering}>
                            A Biomedical Engineering graduate, Jaime has been heavily involved 
                            in working with emerging countries as a result of his involvement 
                            with Fundación Barraquer, attending several cataract surgery expeditions.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "30px" }}>
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            <b>Alberto Pérez Robledo</b>
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            Project Manager
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h6" className={classes.centering}>
                            MSci in Physics graduate, Alberto is characterised by his wide spectrum of 
                            interest, ranging from high-tech to classics, and most recently the role of 
                            education in society, an aspect key to InAGlobe's direction.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "30px" }}>
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            <b>Xavier Laguarta Soler</b>
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h5" className={classes.centering}>
                            Financial Advisor
                        </Typography>
                        <br />
                        <Typography component="h5" variant="h6" className={classes.centering}>
                            An Electrical & Electronic Engineering graduate, Xavi has shown widespread 
                            interest in applying technology to the developing world. He has worked on 
                            the BBOXX project for rural Uganda.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Typography component="h4" variant="h3">
                            <b> Our Vision (Challenges of our Generation) </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className={classes.centering}>
                        <Typography component="h5" variant="h5">
                            <b>By: Jaime Aguilera Garcia</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} style={{ marginLeft: "5%", marginRight: "5%" }}>
                        <Typography component="h5" variant="h6" className={classes.centering}>
                            InAGlobe Education is an initiative that spurted from a lack of opportunities for 
                            three Imperial College students to work on engineering projects catered to the 
                            developing world. Countless hours and invaluable work every year is invested into 
                            curricula-based projects, yet these rarely cater a real need, and therefor the result 
                            of the project ends up archived. So this void was seen as an opportunity to solve one
                            ever more present problem: the developing world does not receive the attention it 
                            needs with regards to innovation. By 2050, the world will see a new population boom 
                            in emerging countries which will result in a steep increase in demand for energy, 
                            clean water, food, communication systems, energy and many more basic needs. Therefore, 
                            it is imperative that novel technologies are developed to cater these needs in their 
                            specific contexts. With an ever more damaged environment and a warmer planet Earth, 
                            developing more sustainable and cleaner technologies is crucial to build a better society. 
                            Presenting this opportunity to future engineers and scientists will open a world of 
                            understanding and involvement that is overflowing with fulfilment and impact; and thus 
                            can truly drive a new era for innovation.
                            <br /><br />
                            The grand vision of the InAGlobe Education platform is to create a matchmaking platform 
                            for innovation opportunities to academics and students looking to become involved in 
                            humanitarian development. By having a large pool of involved academics and a large pool of 
                            partner NGOs, hopefully all innovation voids can be filled. With a large supply of projects 
                            and a large demand for involvement, a more specific allocation of projects will improve the 
                            quality of the technologies and their implementation prospects.
                            <br /><br />
                            The narrative with regards to innovation and technologies for the developing world has 
                            increasingly been about developing a product for the West, and then adapt it to the new context. 
                            Often this comes with unforeseen consequences, especially from domino effects. Our aim as a 
                            nonprofit is to apply scientific data acquisition methodologies to acquire the most representative 
                            image of the landscape and all the players involved so that by applying systems thinking, a project 
                            can be proposed for remote engineering of a personalised solution. A solution that uses local 
                            resources, local logistics channels, local labour, complements education and that is implemented in 
                            such a way that the local population is given agency to ensure maintenance.
                            <br /><br />
                            Due to a lack of resources, and the difficulty of justifying spending on careers events, NGOs and 
                            nonprofits working in the developing world struggle greatly to lure in talent from top universities, 
                            especially from technical fields. This is highly paradoxical to the huge responsibility that engineers
                            and scientists have towards increasing the carrying capacity of this planet, such that it will cater 
                            the needs of 10 billion in the next 30 years, without destroying the natural habitat of all the other 
                            species local to the Earth, whether plants, animals, insects, fungi or protozoa. Prior to the 
                            contemporary era, engineers and scientists bent nature to favour the survival and growth of the human 
                            species; as this now irresponsible approach becomes apparent, the goal shifts towards maintaining the 
                            beauty of a planet which will not be replaceable anywhere in the near future. Exposing the future 
                            engineers and scientists to challenges found in the developing world will allow more individuals to 
                            become involved in a field that is underrepresented in career fairs and events. Complementing their 
                            education with new sets of contextual constraints that will allow for the development of technologies 
                            that are low-cost, energy efficient and clean.
                        </Typography>
                    </Grid>
                </Grid>
                
            </ResponsiveDrawer>
        )
    }

}

export default withStyles(styles)(About)