const uniqid = require('uniqid');
const {Store} = require("fs-json-store");
const dataDirectory = `store/vacations.json`;
const store = new Store({file: dataDirectory});


export const createVacation = (data: { employeeId: any; startDate: number; numberOfDays: number; }) => {

    return store
        .read()
        .then((vacations: any) => {
            const newVacation = {
                id: uniqid(),
                employeeId: data.employeeId,
                startDate: data.startDate,
                endDate: data.startDate + (data.numberOfDays * 24 * 60 * 60 * 1000),
                numberOfDays: data.numberOfDays
            };
            return store.write([...vacations, newVacation]);
        });
};
