import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/issue';

const app = express();
app.use(cors())
const router = express.Router();

app.use(bodyParser.json());

mongoose.connect('mongodb://admin:password1234@ds145463.mlab.com:45463/issues');

const connection = mongoose.connection;

connection.once('open', _ => console.log('MongoDB database connection established successfully!'));

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            res.json(issues);
    })
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    });
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(_ => res.status(200).json({'issue': 'Added successfully!'}))
        .catch(_ => res.status(400).send('Failed to create a new record'));
});

router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load document'));

        issue.title = req.body.title;
        issue.responsible = req.body.responsible;
        issue.description = req.body.description;
        issue.severity = req.body.severity;
        issue.status = req.body.status;

        issue.save()
            .then(_ => res.json('Update Done!'))
            .catch(_ => res.status(400).send('Update failed'));
    });
});

router.route('/issues/delete/:id').get((req,res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if(err)
            res.json(err);

        res.json('Remove successfully!');
    });
});

app.use('/', router);

app.listen(4000, _ => console.log('Express server running on port 4000'));
