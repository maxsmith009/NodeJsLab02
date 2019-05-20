const uniqid = require('uniqid');
const {Store} = require("fs-json-store");
const dataDirectory = `store/employees.json`;
const store = new Store({file: dataDirectory});


export const getEmployeesById = (vacationsData: {employeeId: string, endDate: number}[]) => {

    return store
        .read()
        .then((employees: any) => {

           return  vacationsData.map((el) => {

                let employee = employees.filter((employee: { id: string; }) => {
                    return employee.id === el.employeeId;
                })[0];

                return {
                    endDate: el.endDate,
                    lastName: employee.lastName,
                    firstName: employee.firstName,
                    vacationDaysLeft:employee.vacationDaysLeft
                }
            });
        });
};
