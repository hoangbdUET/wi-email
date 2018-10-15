const config = require('config');
const bodyParser = require('body-parser');
const kue = require('kue');
const queue = kue.createQueue();
const app = kue.app;
const sendMail = require('./utils/send-mail').sendMail;

app.use(bodyParser.json());

queue.process('email', 1, function (job, done) {
    job.log(job.data);
    sendMail(job.data, done);
});
// queue.on('job complete', function (id, result) {
//     console.log(id, result);
//     kue.Job.get(id, function (err, job) {
//         if (err) return;
//         job.remove(function (err) {
//             if (err) throw err;
//             console.log('Removed completed job #%d', job.id);
//         });
//     });
// });
app.get('/api', (req, res) => {
    res.send("Email service : OK");
});
app.post('/api/email/add', (req, res) => {
    let job = queue.create("email", {
        title: req.body.toAddress,
        fromAddress: req.body.fromAddress,
        toAddress: req.body.toAddress,
        subject: req.body.subject,
        text: req.body.text,
        html: req.body.html
    }).attempts(5).save(err => {
        if (!err) {
            console.log("New email added to queue ", job.id);
            res.send("Queue added");
        } else {
            res.send("Queue added error", err);
        }
    });
});

app.listen(config.app.port, (err) => {
    if (err) console.log(err);
    console.log("Email service listening in port", config.app.port);
});