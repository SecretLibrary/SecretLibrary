
export default function ({ $auth, redirect }) {
    const user = $auth.user
    console.log('fucking middleware', user)
    if (!user) {
        return redirect('/Login')
    }

    if (!user.registered) {
        return redirect('/Register')
    }
}
