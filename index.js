const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const ConnectToMongo = require('./db.js')
const Student = require('./studentm.js');
const Aslots = require('./AvailableSlots.js');
const Bslots = require('./BookedSlots.js')


app.use(express.json());

ConnectToMongo();
app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.post('/login', async (req, res) => {

    const { uid, password } = req.body;
    if (uid == 'Dean' && password == 'Dean1234') {
        const student = await Student.create({
            uid: uid,
            upassword: password
        })
        const data = {
            user: {
                uuid: student.token,
                name: student.uid,
            }
        }
        const token = jwt.sign(data, 'secret123');
        res.json({ token: token, Description: "Hi You are Dean Goto /pendingsession to see your session " })
    }
    else {
        const student = await Student.create({
            uid: uid,
            upassword: password
        })
        const data = {
            user: {
                uuid: student.token,
                name: student.uid,
            }
        }
        const token = jwt.sign(data, 'secret123');
        res.json({ token: token, Description: "To Check which slots is available set  the token in headers   go to /aslots " })
    }


})

app.get('/aslots', async (req, res) => {
    let token = req.headers['token']
    if (token) {
        const avaliable = await Aslots.find();
        const aslots = []
        let today = new Date()
        console.log(today)
        avaliable.map((e) => {
            if (e.TimeDate.getTime() > today.getTime()) {
                aslots.push(e.TimeDate.toLocaleDateString())

            }
        })
        res.json({ slots: aslots, Description: "If You want to Book slot go  to /bookslot and send date and Name in body to book the Slot Remember  the Date type is Y-M-D " })
    }
    else {
        res.json({ error: "You have to login and set token to the headers " })
    }

})




app.post('/bookslot', async (req, res) => {
    let token = req.headers['token']
    if (token) {
        const { name, date } = req.body;
        const data = jwt.verify(token, 'secret123')
        console.log(data)
        const da = new Date(date)
        await Aslots.deleteOne({ TimeDate: da })
        const booked = Bslots.create({
            TimeDate: da,
            studentname: name,
            uid: data.user.name,
            suuid: data.user.uuid
        })

        res.json({ success: true , Description: "Your Slot has been booked " })
    }
    else {
        res.json({ error: "You have to login and set token to the headers to book the slot  " })

    }
})


//  Just for testing Purposes 
app.post('/addslot', async (req, res) => {
    const { date } = req.body;
    const da = new Date(date)
    console.log(da)
    const dat = Aslots.create({
        TimeDate: da
    })

    res.json({ 'success': true })
})


app.get('/pendingsession', async (req, res) => {
    let token = req.headers['token']
    console.log(token)
    if (token) {
        const t = jwt.verify(token, 'secret123')
        console.log(t)
        if (t.user.name == 'Dean') {
            const sessions = await Bslots.find();
            let today = new Date()

            let asessions = []
            sessions.map((e) => {
                if (e.TimeDate.getTime() > today.getTime()) {
                    let obj = { 'name': e.studentname, 'date': e.TimeDate.toLocaleDateString() }
                    asessions.push(obj)

                }
            })
            res.json(asessions)
        }
        else {
            res.json({ 'error': "You are not the admin token one  " })
        }
    }
    else {
        res.json({ 'error': "You are not the admin " })

    }

})

app.get('/bslots', async (req, res) => {
    let token = req.headers['token']
    if (token) {
        const t = jwt.verify(token, 'secret123')
        if (t.user.name == 'Dean') {
            const bookk = await Bslots.find();
            res.json({ slots: bookk })
        }
        else {
            res.json({ 'error': "You are not the admin " })
        }
    }
    else {
        res.json({ 'error': "You are not the admin " })

    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})