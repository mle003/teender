// class PrivateHomeRoute extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       loaded: false,
//       user: null,
//       saved: false
//     }
//   }

//   componentDidMount() {
//     let {loaded} = this.state
//     if (!loaded) {
//       MyRequest.checkUser(localStorage.getItem("token"))
//       .then((res) => {
//         console.log('res check user');
//         console.log(res)
//         this.setState({ user: res, loaded: true })
//       })
//       .catch((err) => {
//         console.log(err);
//         this.setState({ loaded: true })
//       })
//     }
//   }
//   render() {
//     console.log(this.props)
//     console.log(this.state.user)
//     return (<Subscribe to={[MyContainer]}>
//       {container => { 
//         if (!this.state.saved) {
//           container.saveUserData(this.state.user)
//           this.setState({saved: true})
//         }
//         console.log('this.state.user')
//             console.log(this.state.user)
//             console.log('container.state.user')
//             console.log(container.state.user)
//         return <Route
//           {...this.props}
//           render={({ location }) => {
//             return (!!this.state.user || !!container.state.user) ? (
//               this.props.children
//             ) : (
//                 <Redirect
//                   to={{
//                     pathname: ROUTES.SIGN_IN,
//                     state: { from: location },
//                   }}
//                 />
//               );
//           }}
//       />}}
//       </Subscribe>)
//   }
// }