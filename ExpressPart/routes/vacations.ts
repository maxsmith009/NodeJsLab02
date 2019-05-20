import express from 'express'
import {getEmployeesById} from "../controllers/employees";

const router = express.Router();
const uniqid = require('uniqid');
const {Store} = require("fs-json-store");
const dataDirectory = `store/vacations.json`;
const store = new Store({file: dataDirectory});

export interface IVacation {
    id: string,
    employeeId: string,
    startDate: number,
    endDate: number,
    numberOfDays: number
}


router.get('/', (req, res) => {
    store
        .read()
        .then((data: any) => {
            res.json(data);
        });
});

router.get('/vacation', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    store
        .read()
        .then((data: any) => {
            const vacationData = data.filter((el: IVacation) => {
                return el.id === req.query.id
            })[0];

            if (vacationData) {
                res.json(vacationData);
            } else {
                res.status(404).send('Not found');
            }
        });
});

router.post('/vacation', (req, res) => {

    const body = req.body;

    if (!body.employeeId && !body.startDate && !body.numberOfDays) {
        res.status(400).send('Bad request');
        return;
    }

    store
        .read()
        .then((vacations: any) => {
            const newVacation = {
                id: uniqid(),
                employeeId: body.employeeId,
                startDate: body.startDate,
                endDate: body.startDate + (body.numberOfDays * 24 * 60 * 60 * 1000),
                numberOfDays: body.numberOfDays

            };
            return store.write([...vacations, newVacation]);
        })
        .then((vacations: any) => {
            res.json(vacations);
        });
});


router.delete('/vacation', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    store
        .read()
        .then((data: any) => {
            const vacations = data.filter((el: IVacation) => {
                return el.id !== req.query.id
            });

            return store.write(vacations);
        })
        .then((data: any) => {
            res.json(data);
        });
});

router.put('/vacation', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    const body = req.body;

    store
        .read()
        .then((data: any) => {
            const vacationNewData = data.map((el: IVacation) => {
                if (el.id === req.query.id) {
                    return {
                        id: el.id,
                        employeeId: body.employeeId || el.employeeId,
                        startDate: body.startDate || el.startDate,
                        endDate: body.endDate || el.endDate,
                        numberOfDays: body.numberOfDays || el.numberOfDays
                    }
                } else {
                    return el;
                }
            });


            return store.write(vacationNewData);
        })
        .then((data: any) => {
            res.json(data);
        });
});

router.get('/vacations-of-employee', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    store
        .read()
        .then((data: any) => {
            const filteredData = data.filter((el: IVacation)=>{
                return el.employeeId === req.query.id;
            });
            res.json(filteredData);
        });
});

router.get('/vacations-on-day', (req, res) => {
const searchDate = req.query.date;

    if (!searchDate) {
        res.status(404).send('No date provided');
        return;
    }

    store
        .read()
        .then((data: any) => {
            return data
                .filter((el: IVacation)=>{
                return Number(el.startDate) < searchDate && searchDate < Number(el.endDate)
            })
                .map((el: { employeeId: string; endDate: number; }) => {
                return {employeeId: el.employeeId,
                    endDate: el.endDate
                };
            });
        })
        .then((data: {employeeId: string, endDate: number}[] ) => getEmployeesById(data))
        .then((data: any) => {
            res.json(data)
        }) ;
});

module.exports = router;