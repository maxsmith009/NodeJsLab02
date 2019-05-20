import express from 'express'
import {createVacation} from "../controllers/vacations";

const router = express.Router();
const uniqid = require('uniqid');
const {Store} = require("fs-json-store");
const dataDirectory = `store/employees.json`;
const store = new Store({file: dataDirectory});

export interface IEmployee {
    id: string,
    firstName: string,
    lastName: string,
    vacationDaysLeft: number
}


router.get('/', (req, res) => {
    store
        .read()
        .then((data: any) => {
            res.json(data);
        });
});

router.get('/employee', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    store
        .read()
        .then((data: any) => {
            const employeeData = data.filter((el: IEmployee) => {
                return el.id === req.query.id
            })[0];

            if (employeeData) {
                res.json(employeeData);
            } else {
                res.status(404).send('Not found');
            }
        });
});

router.post('/employee', (req, res) => {

    const newEmployeeData = req.body;

    if (!newEmployeeData.firstName && !newEmployeeData.lastName) {
        res.status(400).send('Bad request');
        return;
    }

    store
        .read()
        .then((employees: any) => {
            const newEmployee = {
                id: uniqid(),
                firstName: newEmployeeData.firstName,
                lastName: newEmployeeData.lastName,
                vacationDaysLeft: 27
            };
            return store.write([...employees, newEmployee]);
        })
        .then((employees: any) => {
            res.json(employees);
        });
});

router.delete('/employee', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    store
        .read()
        .then((data: any) => {
            const employees = data.filter((el: IEmployee) => {
                return el.id !== req.query.id
            });

            return store.write(employees);
        })
        .then((data: any) => {
            res.json(data);
        });
});

router.put('/employee', (req, res) => {

    if (!req.query.id) {
        res.status(404).send('Not found');
        return;
    }

    const body = req.body;

    store
        .read()
        .then((data: any) => {
            const employeeNewData = data.map((el: IEmployee) => {
                if (el.id === req.query.id) {
                    return {
                        id: el.id,
                        firstName: body.firstName || el.firstName,
                        lastName: body.lastName || el.lastName,
                        vacationDaysLeft: body.vacationDaysLeft || el.vacationDaysLeft
                    }
                } else {
                    return el;
                }
            });


            return store.write(employeeNewData);
        })
        .then((data: any) => {
            res.json(data);
        });
});

router.post('/new-vacation-request', (req, res) => {
    const employeeId = req.query.id;
    const body = req.body;

    if (!employeeId) {
        res.status(404).send('Not found');
        return;
    }

    if (!body.startDate && !body.numberOfDays) {
        res.status(400).send('Bad request');
        return;
    }

    const newVacation = {
        employeeId: employeeId,
        startDate: body.startDate,
        numberOfDays: body.numberOfDays
    };

    store
        .read()
        .then((employees: any) => {

            const employeeData = employees.filter((el: IEmployee) => {
                return el.id === req.query.id;
            })[0];

            if (!employeeData) {
                res.status(404).send('There is no such employee');
                return;
            }

            if (employeeData.vacationDaysLeft < body.numberOfDays) {
                res.status(404).send('Not enough days');
                return;
            }

            const employeeNewData = employees.map((el: IEmployee) => {
                if (el.id === req.query.id) {
                    return {
                        id: el.id,
                        firstName: el.firstName,
                        lastName: el.lastName,
                        vacationDaysLeft: el.vacationDaysLeft - body.numberOfDays
                    }
                } else {
                    return el;
                }
            });

            return store.write(employeeNewData);
        })
        .then(() => createVacation(newVacation))
        .then((data: any) => {
            res.json(data);
        });

});

module.exports = router;
