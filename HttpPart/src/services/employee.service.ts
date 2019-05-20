import {IEmployee} from "../controllers/employeeController";
import * as fs from "fs";

export class EmployeeService {

    public updateEmployeeData(id: string | string[], employeeData: any, callback: any) {
        fs.readFile('./src/store/employees.json', 'utf8', (err, data): void => {
            if (err) throw err;

            if (id) {
                let employeeList = JSON.parse(data).map((el: IEmployee) => {
                    if (el.id === id) {
                        return {
                            id: el.id,
                            firstName: employeeData.firstName || el.firstName,
                            lastName: employeeData.lastName || el.lastName,
                            vacationDaysLeft: employeeData.vacationDaysLeft || el.vacationDaysLeft
                        }
                    } else {
                        return el;
                    }
                });

                fs.writeFile('./src/store/employees.json', JSON.stringify(employeeList), callback.bind(this, employeeList));
            }
        });
    }

}
