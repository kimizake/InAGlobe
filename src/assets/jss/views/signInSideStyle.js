const imageLinks = [
	"https://picsum.photos/id/10/1920/1080",
	"https://picsum.photos/id/1000/1920/1080",
	"https://picsum.photos/id/1002/1920/1080",
	"https://picsum.photos/id/1015/1920/1080",
	"https://picsum.photos/id/1016/1920/1080",
	"https://picsum.photos/id/1018/1920/1080",
	"https://picsum.photos/id/1019/1920/1080",
	"https://picsum.photos/id/1029/1920/1080",
	"https://picsum.photos/id/1032/1920/1080",
	"https://picsum.photos/id/1033/1920/1080"
]

const styles = theme => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: `url("${imageLinks[Math.floor(Math.random() * imageLinks.length)]}")`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	loading: {
		color: 'white',
	}
})

export default styles