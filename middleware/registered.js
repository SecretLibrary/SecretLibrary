
export default function ({ $auth, redirect }) {
    const user = $auth.user

    if (!user) {
        return redirect('/Login')
    }

    if (!user.registered) {
        return redirect('/Register')
    }
}
