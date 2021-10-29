// Importing icons from Drawer
import Person from '@material-ui/icons/Person'
import PersonAdd from "@material-ui/icons/PersonAdd"
import Home from "@material-ui/icons/Home"
import List from "@material-ui/icons/List"
import Subject from "@material-ui/icons/Subject"
import PersonOutline from '@material-ui/icons/PersonOutline'
import Info from "@material-ui/icons/Info"

// Importing reference to all the different views
import SignInSide from './views/SignInSide/SignInSide'
import SignUp from "./views/SignUp/SignUp"
import ConfirmEmail from "./views/ConfirmEmail/ConfirmEmail"
import Dashboard from "./views/Home/Dashboard"
import ProjectList from "./views/ProjectList/ProjectList"
import AddProposal from "./views/AddProposal/AddProposal"
import ProposalMainPage from "./views/ProposalPage/ProposalMainPage"
import ProposalPreviewPage from './views/ProposalPage/ProposalPreviewPage'
import AddCheckpoint from "./views/AddCheckpoint/AddCheckpoint"
import EditProfile from "./views/UserProfile/EditProfile"
import UserProfile from "./views/UserProfile/UserProfile"
import SendEmail from "./views/ResetPassword/SendEmail"
import ResetPassword from "./views/ResetPassword/ResetPassword"
import About from './views/About/About'

const loginRoutes = [
    {
        path: "/signin",
        name: "Sign In",
        icon: Person,
        component: SignInSide,
        layout: "/login"
    },
    {
        path: "/signup",
        name: "Sign Up",
        icon: PersonAdd,
        component: SignUp,
        layout: "/login"
    },
    {
        path: "/confirm/:token",
        name: "Confirm",
        icon: PersonAdd,
        component: ConfirmEmail,
        layout: "/login"
    },
    {
        path: "/requestpassword/",
        name: "Reset Password",
        icon: PersonAdd,
        component: SendEmail,
        layout: "/login"
    },
    {
        path: "/resetpassword/:token",
        name: "Reset Password",
        icon: PersonAdd,
        component: ResetPassword,
        layout: "/login"
    }
]

const profileRoutes = [
    {
        path: "/userprofile/:id",
        name: "User Profile",
        component: UserProfile,
        icon: null,
        layout: "/main",
        userLevel: 3
    },
    {
        path: "/editprofile",
        name: "Edit Profile",
        component: EditProfile,
        icon: null,
        layout: "/main",
        userLevel: 3
    }
]

const proposalRoutes = [
    {
        path: "/preview",
        name: "Preview",
        component: ProposalPreviewPage,
        icon: null,
        layout: "/main/addproposal",
        userLevel: 2
    },
    {
        path: "/proposalpage/:id",
        name: "Proposal Page",
        component: ProposalMainPage,
        icon: null,
        layout: "/main/projectlist",
        userLevel: 3
    },
    {
        path: "/checkpoint/:id",
        name: "Checkpoint",
        component: AddCheckpoint,
        icon: null,
        layout: "/main/projectlist",
        userLevel: 3
    },
]

const drawerRoutes = [
    {
        path: "/home",
        name: "Dashboard",
        icon: Home,
        component: Dashboard,
        layout: "/main",
        userLevel: 3
    },
    {
        path: "/projectlist",
        name: "Project List",
        icon: List,
        component: ProjectList,
        layout: "/main",
        userLevel: 3,
    },
    {
        path: "/addproposal",
        name: "Add Proposal",
        icon: Subject,
        component: AddProposal,
        layout: "/main",
        userLevel: 2
    },
    {
        path: "/userprofile",
        name: "User Profile",
        icon: PersonOutline,
        component: UserProfile,
        layout: "/main",
        userLevel: 3
    },
    {
        path: "/about",
        name: "About",
        icon: Info,
        component: About,
        layout: "/main",
        userLevel: 3
    }
]

const mainRoutes = [...drawerRoutes, ...proposalRoutes, ...profileRoutes]

const routes = {
    auth: loginRoutes,
    drawer: drawerRoutes,
    proposal: proposalRoutes
}

export default routes
export {
    loginRoutes,
    drawerRoutes,
    mainRoutes
}